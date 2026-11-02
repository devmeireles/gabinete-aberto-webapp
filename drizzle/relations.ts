import { relations } from "drizzle-orm/relations";
import {
	deputadoDetalhes,
	deputadoLegislaturas,
	deputadoPartidoVigencias,
	deputados,
	despesas,
	fornecedores,
	legislaturas,
	partidoDetalhes,
	partidoLegislaturas,
	partidos,
	tiposDespesa,
} from "./schema";

export const deputadosRelations = relations(deputados, ({ many }) => ({
	deputadoDetalhes: many(deputadoDetalhes),
	deputadoLegislaturas: many(deputadoLegislaturas),
}));

export const partidosRelations = relations(partidos, ({ many }) => ({
	partidoDetalhes: many(partidoDetalhes),
	partidoLegislaturas: many(partidoLegislaturas),
}));

export const deputadoPartidoVigenciasRelations = relations(
	deputadoPartidoVigencias,
	({ one }) => ({
		deputadoLegislatura: one(deputadoLegislaturas, {
			fields: [deputadoPartidoVigencias.deputadoId],
			references: [deputadoLegislaturas.deputadoId],
		}),
		partidoLegislatura: one(partidoLegislaturas, {
			fields: [deputadoPartidoVigencias.legislaturaId],
			references: [partidoLegislaturas.partidoId],
		}),
	}),
);

export const deputadoLegislaturasRelations = relations(
	deputadoLegislaturas,
	({ one, many }) => ({
		deputadoPartidoVigencias: many(deputadoPartidoVigencias),
		despesas: many(despesas),
		deputado: one(deputados, {
			fields: [deputadoLegislaturas.deputadoId],
			references: [deputados.id],
		}),
		legislatura: one(legislaturas, {
			fields: [deputadoLegislaturas.legislaturaId],
			references: [legislaturas.id],
		}),
	}),
);

export const partidoLegislaturasRelations = relations(
	partidoLegislaturas,
	({ one, many }) => ({
		deputadoPartidoVigencias: many(deputadoPartidoVigencias),
		partido: one(partidos, {
			fields: [partidoLegislaturas.partidoId],
			references: [partidos.id],
		}),
		legislatura: one(legislaturas, {
			fields: [partidoLegislaturas.legislaturaId],
			references: [legislaturas.id],
		}),
	}),
);

export const despesasRelations = relations(despesas, ({ one }) => ({
	tiposDespesa: one(tiposDespesa, {
		fields: [despesas.tipoDespesaId],
		references: [tiposDespesa.id],
	}),
	fornecedore: one(fornecedores, {
		fields: [despesas.fornecedorId],
		references: [fornecedores.id],
	}),
	deputadoLegislatura: one(deputadoLegislaturas, {
		fields: [despesas.deputadoId],
		references: [deputadoLegislaturas.deputadoId],
	}),
}));

export const tiposDespesaRelations = relations(tiposDespesa, ({ many }) => ({
	despesas: many(despesas),
}));

export const fornecedoresRelations = relations(fornecedores, ({ many }) => ({
	despesas: many(despesas),
}));

export const legislaturasRelations = relations(legislaturas, ({ many }) => ({
	partidoDetalhes: many(partidoDetalhes),
	deputadoDetalhes: many(deputadoDetalhes),
	partidoLegislaturas: many(partidoLegislaturas),
	deputadoLegislaturas: many(deputadoLegislaturas),
}));

export const partidoDetalhesRelations = relations(
	partidoDetalhes,
	({ one }) => ({
		partido: one(partidos, {
			fields: [partidoDetalhes.partidoId],
			references: [partidos.id],
		}),
		legislatura: one(legislaturas, {
			fields: [partidoDetalhes.statusLegislaturaId],
			references: [legislaturas.id],
		}),
	}),
);

export const deputadoDetalhesRelations = relations(
	deputadoDetalhes,
	({ one }) => ({
		deputado: one(deputados, {
			fields: [deputadoDetalhes.deputadoId],
			references: [deputados.id],
		}),
		legislatura: one(legislaturas, {
			fields: [deputadoDetalhes.statusLegislaturaId],
			references: [legislaturas.id],
		}),
	}),
);
