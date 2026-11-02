import { pgTable, foreignKey, integer, text, char, bigint, timestamp, uniqueIndex, bigserial, jsonb, index, check, numeric, unique, boolean, date, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const deputados = pgTable("deputados", {
	id: integer().primaryKey().notNull(),
	nome: text().notNull(),
	uri: text().notNull(),
	urlFoto: text("url_foto"),
	rowHash: char("row_hash", { length: 64 }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const partidos = pgTable("partidos", {
	id: integer().primaryKey().notNull(),
	sigla: text().notNull(),
	nome: text().notNull(),
	uri: text().notNull(),
	rowHash: char("row_hash", { length: 64 }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("partidos_sigla_idx").using("btree", table.sigla.asc().nullsLast().op("text_ops")),
]);

export const deputadoPartidoVigencias = pgTable("deputado_partido_vigencias", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	deputadoId: integer("deputado_id").notNull(),
	legislaturaId: integer("legislatura_id").notNull(),
	partidoId: integer("partido_id"),
	dataInicio: timestamp("data_inicio", { mode: 'string' }),
	dataFim: timestamp("data_fim", { mode: 'string' }),
	rowHash: char("row_hash", { length: 64 }).notNull(),
}, (table) => [
	index("deputado_partido_vigencias_deputado_leg_idx").using("btree", table.deputadoId.asc().nullsLast().op("int4_ops"), table.legislaturaId.asc().nullsLast().op("int4_ops")),
	uniqueIndex("deputado_partido_vigencias_deputado_leg_inicio_uq").using("btree", table.deputadoId.asc().nullsLast().op("int4_ops"), table.legislaturaId.asc().nullsLast().op("timestamp_ops"), table.dataInicio.asc().nullsLast().op("timestamp_ops")).where(sql`(data_inicio IS NOT NULL)`),
	foreignKey({
			columns: [table.deputadoId, table.legislaturaId],
			foreignColumns: [deputadoLegislaturas.deputadoId, deputadoLegislaturas.legislaturaId],
			name: "deputado_partido_vigencias_deputado_legislatura_fk"
		}),
	foreignKey({
			columns: [table.legislaturaId, table.partidoId],
			foreignColumns: [partidoLegislaturas.partidoId, partidoLegislaturas.legislaturaId],
			name: "deputado_partido_vigencias_partido_legislatura_fk"
		}),
	check("deputado_partido_vigencias_data_check", sql`(data_fim IS NULL) OR (data_inicio IS NULL) OR (data_fim >= data_inicio)`),
]);

export const bilhetesAereosCsv = pgTable("bilhetes_aereos_csv", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	deputadoId: integer("deputado_id").notNull(),
	legislaturaId: integer("legislatura_id").notNull(),
	ano: integer().notNull(),
	mes: integer().notNull(),
	tipoDespesa: text("tipo_despesa").notNull(),
	codTipoDocumento: integer("cod_tipo_documento").notNull(),
	codDocumento: text("cod_documento").notNull(),
	dataDocumento: timestamp("data_documento", { mode: 'string' }).notNull(),
	numDocumento: text("num_documento").notNull(),
	parcela: integer().notNull(),
	codLote: integer("cod_lote").notNull(),
	cnpjCpfFornecedor: text("cnpj_cpf_fornecedor").notNull(),
	valorDocumento: numeric("valor_documento", { precision: 14, scale:  2 }).notNull(),
	passageiro: text().notNull(),
	trecho: text().notNull(),
	arquivo: text().notNull(),
	linha: integer().notNull(),
}, (table) => [
	uniqueIndex("bilhetes_aereos_csv_identity_uq").using("btree", table.deputadoId.asc().nullsLast().op("int4_ops"), table.legislaturaId.asc().nullsLast().op("numeric_ops"), table.ano.asc().nullsLast().op("numeric_ops"), table.mes.asc().nullsLast().op("text_ops"), table.tipoDespesa.asc().nullsLast().op("timestamp_ops"), table.codDocumento.asc().nullsLast().op("text_ops"), table.codTipoDocumento.asc().nullsLast().op("int4_ops"), table.dataDocumento.asc().nullsLast().op("int4_ops"), table.numDocumento.asc().nullsLast().op("int4_ops"), table.parcela.asc().nullsLast().op("int4_ops"), table.codLote.asc().nullsLast().op("int4_ops"), table.valorDocumento.asc().nullsLast().op("numeric_ops"), table.passageiro.asc().nullsLast().op("int4_ops"), table.trecho.asc().nullsLast().op("int4_ops")),
	index("bilhetes_aereos_csv_match_idx").using("btree", table.deputadoId.asc().nullsLast().op("text_ops"), table.legislaturaId.asc().nullsLast().op("text_ops"), table.ano.asc().nullsLast().op("timestamp_ops"), table.mes.asc().nullsLast().op("timestamp_ops"), table.codDocumento.asc().nullsLast().op("timestamp_ops"), table.dataDocumento.asc().nullsLast().op("timestamp_ops"), table.numDocumento.asc().nullsLast().op("int4_ops")),
	index("bilhetes_aereos_csv_year_idx").using("btree", table.ano.asc().nullsLast().op("int4_ops")),
]);

export const tiposDespesa = pgTable("tipos_despesa", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	nome: text().notNull(),
}, (table) => [
	uniqueIndex("tipos_despesa_nome_uq").using("btree", table.nome.asc().nullsLast().op("text_ops")),
]);

export const despesas = pgTable("despesas", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	deputadoId: integer("deputado_id").notNull(),
	legislaturaId: integer("legislatura_id").notNull(),
	ano: integer().notNull(),
	mes: integer().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	tipoDespesaId: bigint("tipo_despesa_id", { mode: "number" }).notNull(),
	codDocumento: text("cod_documento").notNull(),
	tipoDocumento: text("tipo_documento").notNull(),
	codTipoDocumento: integer("cod_tipo_documento").notNull(),
	dataDocumento: timestamp("data_documento", { mode: 'string' }),
	numDocumento: text("num_documento").notNull(),
	parcela: integer().notNull(),
	numRessarcimento: text("num_ressarcimento").notNull(),
	codLote: integer("cod_lote").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	fornecedorId: bigint("fornecedor_id", { mode: "number" }).notNull(),
	valorDocumento: numeric("valor_documento", { precision: 14, scale:  2 }).notNull(),
	valorGlosa: numeric("valor_glosa", { precision: 14, scale:  2 }).notNull(),
	valorLiquido: numeric("valor_liquido", { precision: 14, scale:  2 }).notNull(),
	urlDocumento: text("url_documento"),
	passageiro: text(),
	trecho: text(),
	bilheteMatchAmbiguo: boolean("bilhete_match_ambiguo").default(false).notNull(),
	rowHash: char("row_hash", { length: 64 }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("despesas_fornecedor_idx").using("btree", table.fornecedorId.asc().nullsLast().op("int8_ops")),
	index("despesas_legislatura_periodo_idx").using("btree", table.legislaturaId.asc().nullsLast().op("int4_ops"), table.ano.asc().nullsLast().op("int4_ops"), table.mes.asc().nullsLast().op("int4_ops")),
	index("despesas_tipo_despesa_idx").using("btree", table.tipoDespesaId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.tipoDespesaId],
			foreignColumns: [tiposDespesa.id],
			name: "despesas_tipo_despesa_id_tipos_despesa_id_fk"
		}),
	foreignKey({
			columns: [table.fornecedorId],
			foreignColumns: [fornecedores.id],
			name: "despesas_fornecedor_id_fornecedores_id_fk"
		}),
	foreignKey({
			columns: [table.deputadoId, table.legislaturaId],
			foreignColumns: [deputadoLegislaturas.deputadoId, deputadoLegislaturas.legislaturaId],
			name: "despesas_deputado_legislatura_fk"
		}),
	unique("despesas_natural_key_uq").on(table.valorLiquido, table.valorGlosa, table.valorDocumento, table.parcela, table.numDocumento, table.mes, table.legislaturaId, table.deputadoId, table.dataDocumento, table.codLote, table.codDocumento, table.ano),
]);

export const fornecedores = pgTable("fornecedores", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	nome: text().notNull(),
	cnpjCpf: text("cnpj_cpf").notNull(),
}, (table) => [
	index("fornecedores_cnpj_cpf_idx").using("btree", table.cnpjCpf.asc().nullsLast().op("text_ops")),
	uniqueIndex("fornecedores_nome_cnpj_cpf_uq").using("btree", table.nome.asc().nullsLast().op("text_ops"), table.cnpjCpf.asc().nullsLast().op("text_ops")),
]);

export const legislaturas = pgTable("legislaturas", {
	id: integer().primaryKey().notNull(),
	uri: text().notNull(),
	dataInicio: date("data_inicio").notNull(),
	dataFim: date("data_fim"),
	rowHash: char("row_hash", { length: 64 }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	legislaturaAtual: boolean("legislatura_atual").default(false).notNull(),
});

export const crawlerRuns = pgTable("crawler_runs", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	functionId: text("function_id").notNull(),
	runId: text("run_id").notNull(),
	eventName: text("event_name").notNull(),
	attempt: integer().notNull(),
	status: text().notNull(),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	finishedAt: timestamp("finished_at", { withTimezone: true, mode: 'string' }),
	summary: jsonb(),
	error: text(),
}, (table) => [
	uniqueIndex("crawler_runs_function_run_uq").using("btree", table.functionId.asc().nullsLast().op("text_ops"), table.runId.asc().nullsLast().op("text_ops")),
	index("crawler_runs_status_started_idx").using("btree", table.status.asc().nullsLast().op("text_ops"), table.startedAt.asc().nullsLast().op("text_ops")),
	check("crawler_runs_status_check", sql`status = ANY (ARRAY['running'::text, 'completed'::text, 'failed'::text])`),
	check("crawler_runs_attempt_check", sql`attempt > 0`),
]);

export const despesaConflicts = pgTable("despesa_conflicts", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	naturalKey: text("natural_key").notNull(),
	rowHash: char("row_hash", { length: 64 }).notNull(),
	payload: jsonb().notNull(),
	reason: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("despesa_conflicts_natural_key_hash_uq").using("btree", table.naturalKey.asc().nullsLast().op("text_ops"), table.rowHash.asc().nullsLast().op("char_ops")),
]);

export const partidoDetalhes = pgTable("partido_detalhes", {
	partidoId: integer("partido_id").primaryKey().notNull(),
	statusData: text("status_data"),
	statusLegislaturaId: integer("status_legislatura_id"),
	situacao: text(),
	totalPosse: integer("total_posse"),
	totalMembros: integer("total_membros"),
	uriMembros: text("uri_membros"),
	liderUri: text("lider_uri"),
	liderNome: text("lider_nome"),
	liderSiglaPartido: text("lider_sigla_partido"),
	liderUriPartido: text("lider_uri_partido"),
	liderUf: char("lider_uf", { length: 2 }),
	liderLegislaturaId: integer("lider_legislatura_id"),
	liderUrlFoto: text("lider_url_foto"),
	numeroEleitoral: text("numero_eleitoral"),
	urlLogo: text("url_logo"),
	urlWebsite: text("url_website"),
	urlFacebook: text("url_facebook"),
	rowHash: char("row_hash", { length: 64 }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	lastFetchedAt: timestamp("last_fetched_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("partido_detalhes_status_legislatura_idx").using("btree", table.statusLegislaturaId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.partidoId],
			foreignColumns: [partidos.id],
			name: "partido_detalhes_partido_id_partidos_id_fk"
		}),
	foreignKey({
			columns: [table.statusLegislaturaId],
			foreignColumns: [legislaturas.id],
			name: "partido_detalhes_status_legislatura_id_legislaturas_id_fk"
		}),
]);

export const deputadoDetalhes = pgTable("deputado_detalhes", {
	deputadoId: integer("deputado_id").primaryKey().notNull(),
	nomeCivil: text("nome_civil"),
	cpf: text(),
	sexo: text(),
	urlWebsite: text("url_website"),
	redesSociais: jsonb("redes_sociais").default([]).notNull(),
	dataNascimento: date("data_nascimento"),
	dataFalecimento: date("data_falecimento"),
	ufNascimento: char("uf_nascimento", { length: 2 }),
	municipioNascimento: text("municipio_nascimento"),
	escolaridade: text(),
	statusLegislaturaId: integer("status_legislatura_id").notNull(),
	nomeEleitoral: text("nome_eleitoral"),
	siglaPartido: text("sigla_partido"),
	uriPartido: text("uri_partido"),
	siglaUf: char("sigla_uf", { length: 2 }),
	urlFoto: text("url_foto"),
	email: text(),
	dataStatus: date("data_status"),
	situacao: text(),
	condicaoEleitoral: text("condicao_eleitoral"),
	descricaoStatus: text("descricao_status"),
	gabineteNome: text("gabinete_nome"),
	gabinetePredio: text("gabinete_predio"),
	gabineteSala: text("gabinete_sala"),
	gabineteAndar: text("gabinete_andar"),
	gabineteTelefone: text("gabinete_telefone"),
	gabineteEmail: text("gabinete_email"),
	rowHash: char("row_hash", { length: 64 }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	statusNome: text("status_nome"),
	statusUri: text("status_uri").notNull(),
	lastFetchedAt: timestamp("last_fetched_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("deputado_detalhes_status_legislatura_idx").using("btree", table.statusLegislaturaId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.deputadoId],
			foreignColumns: [deputados.id],
			name: "deputado_detalhes_deputado_id_deputados_id_fk"
		}),
	foreignKey({
			columns: [table.statusLegislaturaId],
			foreignColumns: [legislaturas.id],
			name: "deputado_detalhes_status_legislatura_id_legislaturas_id_fk"
		}),
]);

export const partidoLegislaturas = pgTable("partido_legislaturas", {
	partidoId: integer("partido_id").notNull(),
	legislaturaId: integer("legislatura_id").notNull(),
	rowHash: char("row_hash", { length: 64 }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.partidoId],
			foreignColumns: [partidos.id],
			name: "partido_legislaturas_partido_id_partidos_id_fk"
		}),
	foreignKey({
			columns: [table.legislaturaId],
			foreignColumns: [legislaturas.id],
			name: "partido_legislaturas_legislatura_id_legislaturas_id_fk"
		}),
	primaryKey({ columns: [table.partidoId, table.legislaturaId], name: "partido_legislaturas_partido_id_legislatura_id_pk"}),
]);

export const deputadoLegislaturas = pgTable("deputado_legislaturas", {
	deputadoId: integer("deputado_id").notNull(),
	legislaturaId: integer("legislatura_id").notNull(),
	siglaUf: char("sigla_uf", { length: 2 }),
	email: text(),
	rowHash: char("row_hash", { length: 64 }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.deputadoId],
			foreignColumns: [deputados.id],
			name: "deputado_legislaturas_deputado_id_deputados_id_fk"
		}),
	foreignKey({
			columns: [table.legislaturaId],
			foreignColumns: [legislaturas.id],
			name: "deputado_legislaturas_legislatura_id_legislaturas_id_fk"
		}),
	primaryKey({ columns: [table.legislaturaId, table.deputadoId], name: "deputado_legislaturas_deputado_id_legislatura_id_pk"}),
]);
