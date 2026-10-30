-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "deputados" (
	"id" integer PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"uri" text NOT NULL,
	"url_foto" text,
	"row_hash" char(64) NOT NULL,
	"source_payload_id" bigint,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "raw_payloads" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"request_key" text NOT NULL,
	"content_hash" char(64) NOT NULL,
	"payload" jsonb NOT NULL,
	"first_fetched_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partidos" (
	"id" integer PRIMARY KEY NOT NULL,
	"sigla" text NOT NULL,
	"nome" text NOT NULL,
	"uri" text NOT NULL,
	"row_hash" char(64) NOT NULL,
	"source_payload_id" bigint,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deputado_partido_vigencias" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"deputado_id" integer NOT NULL,
	"legislatura_id" integer NOT NULL,
	"partido_id" integer,
	"data_inicio" timestamp,
	"data_fim" timestamp,
	"row_hash" char(64) NOT NULL,
	"source_payload_id" bigint,
	CONSTRAINT "deputado_partido_vigencias_data_check" CHECK ((data_fim IS NULL) OR (data_inicio IS NULL) OR (data_fim >= data_inicio))
);
--> statement-breakpoint
CREATE TABLE "bilhetes_aereos_csv" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"deputado_id" integer NOT NULL,
	"legislatura_id" integer NOT NULL,
	"ano" integer NOT NULL,
	"mes" integer NOT NULL,
	"tipo_despesa" text NOT NULL,
	"cod_tipo_documento" integer NOT NULL,
	"cod_documento" text NOT NULL,
	"data_documento" timestamp NOT NULL,
	"num_documento" text NOT NULL,
	"parcela" integer NOT NULL,
	"cod_lote" integer NOT NULL,
	"cnpj_cpf_fornecedor" text NOT NULL,
	"valor_documento" numeric(14, 2) NOT NULL,
	"passageiro" text NOT NULL,
	"trecho" text NOT NULL,
	"arquivo" text NOT NULL,
	"linha" integer NOT NULL,
	"status" text DEFAULT 'available' NOT NULL,
	"associated_expense_id" bigint,
	CONSTRAINT "bilhetes_aereos_csv_association_status_chk" CHECK (((status = 'available'::text) AND (associated_expense_id IS NULL)) OR ((status = 'associated'::text) AND (associated_expense_id IS NOT NULL)))
);
--> statement-breakpoint
CREATE TABLE "tipos_despesa" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "despesas" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"deputado_id" integer NOT NULL,
	"legislatura_id" integer NOT NULL,
	"ano" integer NOT NULL,
	"mes" integer NOT NULL,
	"tipo_despesa_id" bigint NOT NULL,
	"cod_documento" text NOT NULL,
	"tipo_documento" text NOT NULL,
	"cod_tipo_documento" integer NOT NULL,
	"data_documento" timestamp,
	"num_documento" text NOT NULL,
	"parcela" integer NOT NULL,
	"num_ressarcimento" text NOT NULL,
	"cod_lote" integer NOT NULL,
	"fornecedor_id" bigint NOT NULL,
	"valor_documento" numeric(14, 2) NOT NULL,
	"valor_glosa" numeric(14, 2) NOT NULL,
	"valor_liquido" numeric(14, 2) NOT NULL,
	"url_documento" text,
	"passageiro" text,
	"trecho" text,
	"bilhete_match_ambiguo" boolean DEFAULT false NOT NULL,
	"row_hash" char(64) NOT NULL,
	"source_payload_id" bigint,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "despesas_natural_key_uq" UNIQUE("valor_liquido","valor_glosa","valor_documento","parcela","num_documento","mes","legislatura_id","deputado_id","data_documento","cod_lote","cod_documento","ano")
);
--> statement-breakpoint
CREATE TABLE "fornecedores" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"cnpj_cpf" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "legislaturas" (
	"id" integer PRIMARY KEY NOT NULL,
	"uri" text NOT NULL,
	"data_inicio" date NOT NULL,
	"data_fim" date,
	"row_hash" char(64) NOT NULL,
	"source_payload_id" bigint,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"legislatura_atual" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crawler_runs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"function_id" text NOT NULL,
	"run_id" text NOT NULL,
	"event_name" text NOT NULL,
	"attempt" integer NOT NULL,
	"status" text NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"summary" jsonb,
	"error" text,
	CONSTRAINT "crawler_runs_status_check" CHECK (status = ANY (ARRAY['running'::text, 'completed'::text, 'failed'::text])),
	CONSTRAINT "crawler_runs_attempt_check" CHECK (attempt > 0)
);
--> statement-breakpoint
CREATE TABLE "despesa_conflicts" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"source_payload_id" bigint NOT NULL,
	"natural_key" text NOT NULL,
	"row_hash" char(64) NOT NULL,
	"payload" jsonb NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partido_detalhes" (
	"partido_id" integer PRIMARY KEY NOT NULL,
	"status_data" text,
	"status_legislatura_id" integer,
	"situacao" text,
	"total_posse" integer,
	"total_membros" integer,
	"uri_membros" text,
	"lider_uri" text,
	"lider_nome" text,
	"lider_sigla_partido" text,
	"lider_uri_partido" text,
	"lider_uf" char(2),
	"lider_legislatura_id" integer,
	"lider_url_foto" text,
	"numero_eleitoral" text,
	"url_logo" text,
	"url_website" text,
	"url_facebook" text,
	"row_hash" char(64) NOT NULL,
	"source_payload_id" bigint NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_fetched_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deputado_detalhes" (
	"deputado_id" integer PRIMARY KEY NOT NULL,
	"nome_civil" text,
	"cpf" text,
	"sexo" text,
	"url_website" text,
	"redes_sociais" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"data_nascimento" date,
	"data_falecimento" date,
	"uf_nascimento" char(2),
	"municipio_nascimento" text,
	"escolaridade" text,
	"status_legislatura_id" integer NOT NULL,
	"nome_eleitoral" text,
	"sigla_partido" text,
	"uri_partido" text,
	"sigla_uf" char(2),
	"url_foto" text,
	"email" text,
	"data_status" date,
	"situacao" text,
	"condicao_eleitoral" text,
	"descricao_status" text,
	"gabinete_nome" text,
	"gabinete_predio" text,
	"gabinete_sala" text,
	"gabinete_andar" text,
	"gabinete_telefone" text,
	"gabinete_email" text,
	"row_hash" char(64) NOT NULL,
	"source_payload_id" bigint NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status_nome" text,
	"status_uri" text NOT NULL,
	"last_fetched_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partido_legislaturas" (
	"partido_id" integer NOT NULL,
	"legislatura_id" integer NOT NULL,
	"row_hash" char(64) NOT NULL,
	"source_payload_id" bigint,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "partido_legislaturas_partido_id_legislatura_id_pk" PRIMARY KEY("partido_id","legislatura_id")
);
--> statement-breakpoint
CREATE TABLE "deputado_legislaturas" (
	"deputado_id" integer NOT NULL,
	"legislatura_id" integer NOT NULL,
	"sigla_uf" char(2),
	"email" text,
	"row_hash" char(64) NOT NULL,
	"source_payload_id" bigint,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "deputado_legislaturas_deputado_id_legislatura_id_pk" PRIMARY KEY("legislatura_id","deputado_id")
);
--> statement-breakpoint
ALTER TABLE "deputados" ADD CONSTRAINT "deputados_source_payload_id_raw_payloads_id_fk" FOREIGN KEY ("source_payload_id") REFERENCES "public"."raw_payloads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partidos" ADD CONSTRAINT "partidos_source_payload_id_raw_payloads_id_fk" FOREIGN KEY ("source_payload_id") REFERENCES "public"."raw_payloads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deputado_partido_vigencias" ADD CONSTRAINT "deputado_partido_vigencias_source_payload_id_raw_payloads_id_fk" FOREIGN KEY ("source_payload_id") REFERENCES "public"."raw_payloads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deputado_partido_vigencias" ADD CONSTRAINT "deputado_partido_vigencias_deputado_legislatura_fk" FOREIGN KEY ("deputado_id","legislatura_id") REFERENCES "public"."deputado_legislaturas"("deputado_id","legislatura_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deputado_partido_vigencias" ADD CONSTRAINT "deputado_partido_vigencias_partido_legislatura_fk" FOREIGN KEY ("legislatura_id","partido_id") REFERENCES "public"."partido_legislaturas"("partido_id","legislatura_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bilhetes_aereos_csv" ADD CONSTRAINT "bilhetes_aereos_csv_associated_expense_id_despesas_id_fk" FOREIGN KEY ("associated_expense_id") REFERENCES "public"."despesas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "despesas" ADD CONSTRAINT "despesas_tipo_despesa_id_tipos_despesa_id_fk" FOREIGN KEY ("tipo_despesa_id") REFERENCES "public"."tipos_despesa"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "despesas" ADD CONSTRAINT "despesas_fornecedor_id_fornecedores_id_fk" FOREIGN KEY ("fornecedor_id") REFERENCES "public"."fornecedores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "despesas" ADD CONSTRAINT "despesas_source_payload_id_raw_payloads_id_fk" FOREIGN KEY ("source_payload_id") REFERENCES "public"."raw_payloads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "despesas" ADD CONSTRAINT "despesas_deputado_legislatura_fk" FOREIGN KEY ("deputado_id","legislatura_id") REFERENCES "public"."deputado_legislaturas"("deputado_id","legislatura_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legislaturas" ADD CONSTRAINT "legislaturas_source_payload_id_raw_payloads_id_fk" FOREIGN KEY ("source_payload_id") REFERENCES "public"."raw_payloads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "despesa_conflicts" ADD CONSTRAINT "despesa_conflicts_source_payload_id_raw_payloads_id_fk" FOREIGN KEY ("source_payload_id") REFERENCES "public"."raw_payloads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partido_detalhes" ADD CONSTRAINT "partido_detalhes_partido_id_partidos_id_fk" FOREIGN KEY ("partido_id") REFERENCES "public"."partidos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partido_detalhes" ADD CONSTRAINT "partido_detalhes_status_legislatura_id_legislaturas_id_fk" FOREIGN KEY ("status_legislatura_id") REFERENCES "public"."legislaturas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partido_detalhes" ADD CONSTRAINT "partido_detalhes_source_payload_id_raw_payloads_id_fk" FOREIGN KEY ("source_payload_id") REFERENCES "public"."raw_payloads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deputado_detalhes" ADD CONSTRAINT "deputado_detalhes_deputado_id_deputados_id_fk" FOREIGN KEY ("deputado_id") REFERENCES "public"."deputados"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deputado_detalhes" ADD CONSTRAINT "deputado_detalhes_status_legislatura_id_legislaturas_id_fk" FOREIGN KEY ("status_legislatura_id") REFERENCES "public"."legislaturas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deputado_detalhes" ADD CONSTRAINT "deputado_detalhes_source_payload_id_raw_payloads_id_fk" FOREIGN KEY ("source_payload_id") REFERENCES "public"."raw_payloads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partido_legislaturas" ADD CONSTRAINT "partido_legislaturas_partido_id_partidos_id_fk" FOREIGN KEY ("partido_id") REFERENCES "public"."partidos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partido_legislaturas" ADD CONSTRAINT "partido_legislaturas_legislatura_id_legislaturas_id_fk" FOREIGN KEY ("legislatura_id") REFERENCES "public"."legislaturas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partido_legislaturas" ADD CONSTRAINT "partido_legislaturas_source_payload_id_raw_payloads_id_fk" FOREIGN KEY ("source_payload_id") REFERENCES "public"."raw_payloads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deputado_legislaturas" ADD CONSTRAINT "deputado_legislaturas_deputado_id_deputados_id_fk" FOREIGN KEY ("deputado_id") REFERENCES "public"."deputados"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deputado_legislaturas" ADD CONSTRAINT "deputado_legislaturas_legislatura_id_legislaturas_id_fk" FOREIGN KEY ("legislatura_id") REFERENCES "public"."legislaturas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deputado_legislaturas" ADD CONSTRAINT "deputado_legislaturas_source_payload_id_raw_payloads_id_fk" FOREIGN KEY ("source_payload_id") REFERENCES "public"."raw_payloads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "raw_payloads_key_hash_uq" ON "raw_payloads" USING btree ("request_key" text_ops,"content_hash" text_ops);--> statement-breakpoint
CREATE INDEX "partidos_sigla_idx" ON "partidos" USING btree ("sigla" text_ops);--> statement-breakpoint
CREATE INDEX "deputado_partido_vigencias_deputado_leg_idx" ON "deputado_partido_vigencias" USING btree ("deputado_id" int4_ops,"legislatura_id" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "deputado_partido_vigencias_deputado_leg_inicio_uq" ON "deputado_partido_vigencias" USING btree ("deputado_id" int4_ops,"legislatura_id" timestamp_ops,"data_inicio" timestamp_ops) WHERE (data_inicio IS NOT NULL);--> statement-breakpoint
CREATE INDEX "bilhetes_aereos_csv_associated_expense_idx" ON "bilhetes_aereos_csv" USING btree ("associated_expense_id" int8_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "bilhetes_aereos_csv_identity_uq" ON "bilhetes_aereos_csv" USING btree ("deputado_id" int4_ops,"legislatura_id" numeric_ops,"ano" numeric_ops,"mes" text_ops,"tipo_despesa" timestamp_ops,"cod_documento" text_ops,"cod_tipo_documento" int4_ops,"data_documento" int4_ops,"num_documento" int4_ops,"parcela" int4_ops,"cod_lote" int4_ops,"valor_documento" numeric_ops,"passageiro" int4_ops,"trecho" int4_ops);--> statement-breakpoint
CREATE INDEX "bilhetes_aereos_csv_match_idx" ON "bilhetes_aereos_csv" USING btree ("deputado_id" text_ops,"legislatura_id" text_ops,"ano" timestamp_ops,"mes" timestamp_ops,"cod_documento" timestamp_ops,"data_documento" timestamp_ops,"num_documento" int4_ops);--> statement-breakpoint
CREATE INDEX "bilhetes_aereos_csv_status_year_idx" ON "bilhetes_aereos_csv" USING btree ("status" text_ops,"ano" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "tipos_despesa_nome_uq" ON "tipos_despesa" USING btree ("nome" text_ops);--> statement-breakpoint
CREATE INDEX "despesas_fornecedor_idx" ON "despesas" USING btree ("fornecedor_id" int8_ops);--> statement-breakpoint
CREATE INDEX "despesas_legislatura_periodo_idx" ON "despesas" USING btree ("legislatura_id" int4_ops,"ano" int4_ops,"mes" int4_ops);--> statement-breakpoint
CREATE INDEX "despesas_tipo_despesa_idx" ON "despesas" USING btree ("tipo_despesa_id" int8_ops);--> statement-breakpoint
CREATE INDEX "fornecedores_cnpj_cpf_idx" ON "fornecedores" USING btree ("cnpj_cpf" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "fornecedores_nome_cnpj_cpf_uq" ON "fornecedores" USING btree ("nome" text_ops,"cnpj_cpf" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "crawler_runs_function_run_uq" ON "crawler_runs" USING btree ("function_id" text_ops,"run_id" text_ops);--> statement-breakpoint
CREATE INDEX "crawler_runs_status_started_idx" ON "crawler_runs" USING btree ("status" text_ops,"started_at" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "despesa_conflicts_source_hash_uq" ON "despesa_conflicts" USING btree ("source_payload_id" int8_ops,"row_hash" int8_ops);--> statement-breakpoint
CREATE INDEX "partido_detalhes_status_legislatura_idx" ON "partido_detalhes" USING btree ("status_legislatura_id" int4_ops);--> statement-breakpoint
CREATE INDEX "deputado_detalhes_status_legislatura_idx" ON "deputado_detalhes" USING btree ("status_legislatura_id" int4_ops);
*/