"use client";

import { DeputyAvatar } from "@/app/components/ui/DeputyAvatar";
import { useDeputadoDetalhe } from "@/app/hooks/use-deputado-detalhe";
import {
  formatBirthDate,
  formatDate,
  formatGabineteAddressLine,
  safeText,
} from "@/app/lib/formartters.lib";
import {
  ArrowLeft,
  Building,
  Calendar,
  Check,
  ChevronRight,
  Download,
  ExternalLink,
  GraduationCap,
  Mail,
  MapPin,
  Share2,
  ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { DeputadoDespesas } from "./DeputadoDespesas";

interface IDeputadoDetailViewProps {
  id: number;
}

export const DeputadoDetailView = ({ id }: IDeputadoDetailViewProps) => {
  const { data, isPending, isError } = useDeputadoDetalhe(id);

  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  if (isPending) return <p>Carregando...</p>;
  if (isError || !data) return <p>Deputado não encontrado.</p>;

  const { perfil: deputado, filiacoes } = data;

  const onBack = () => { };
  const handleDownloadCsv = () => { };

  const handleCopyLink = () => {
    try {
      const url = new URL(window.location.href);
      navigator.clipboard.writeText(url.toString());
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch { }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Breadcrumb */}
        <nav
          aria-label="Navegação em trilha"
          className="flex items-center gap-2 text-xs text-text-muted"
        >
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 font-medium transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Deputados</span>
          </button>
          <ChevronRight
            className="h-3 w-3 text-text-subtle"
            aria-hidden="true"
          />
          <span className="text-text-subtle">Dossiê Parlamentar</span>
          <ChevronRight
            className="h-3 w-3 text-text-subtle"
            aria-hidden="true"
          />
          <span className="max-w-50 truncate font-semibold text-text">
            {deputado.nome}
          </span>
        </nav>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text transition-colors hover:bg-surface-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            title="Copiar link direto para este dossiê"
          >
            {copiedLink ? (
              <>
                <Check
                  className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400"
                  aria-hidden="true"
                />
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  Link copiado!
                </span>
              </>
            ) : (
              <>
                <Share2
                  className="h-3.5 w-3.5 text-text-muted"
                  aria-hidden="true"
                />
                <span>Compartilhar</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            title="Baixar extrato completo de despesas em formato CSV"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Exportar Despesas (CSV)</span>
          </button>

          <a
            href={`https://www.camara.leg.br/deputados/${deputado.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-text-muted transition-colors hover:bg-surface-hover hover:text-text"
            title="Abrir página oficial no Portal da Câmara dos Deputados"
          >
            <span>Portal Oficial</span>
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Hero Card: Biografia, Snapshot Oficial & Gabinete */}
      <section
        aria-label="Identidade Parlamentar e Snapshot Oficial"
        className="overflow-hidden rounded-xl border border-border bg-surface shadow-xs"
      >
        <div className="bg-linear-to-r from-surface-subtle via-surface to-surface-subtle p-6 sm:p-8">
          <div className="flex flex-col items-start gap-6 md:flex-row lg:gap-8">
            {/* Foto Oficial com Destaque */}
            <div className="relative shrink-0">
              <DeputyAvatar
                urlFoto={deputado.urlFoto}
                nome={deputado.nome}
                size="lg"
                className="h-28 w-28 rounded-2xl border-2 border-border shadow-md sm:h-36 sm:w-36"
              />
              <span className="absolute -right-2 -bottom-2 rounded-full bg-primary px-2.5 py-0.5 font-mono text-[11px] font-bold text-white shadow-xs">
                {deputado.siglaPartido}
              </span>
            </div>

            {/* Informações Principais */}
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-primary/20 bg-(--color-primary-light) px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {deputado.siglaPartido} · {deputado.siglaUf}
                </span>
                <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-medium text-text">
                  Situação: {deputado.situacao}
                </span>
                <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-medium text-text-muted">
                  Condição: {deputado.condicaoEleitoral}
                </span>
                <span className="ml-auto font-mono text-[11px] text-text-subtle">
                  ID Oficial: #{deputado.id}
                </span>
              </div>

              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-text sm:text-3xl">
                  {deputado.nome}
                </h1>
                <p className="mt-0.5 text-xs text-text-muted">
                  Nome civil registrado:{" "}
                  <strong className="text-text">{deputado.nomeCivil}</strong>
                </p>
              </div>

              {/* Grid de Dados Biográficos e Gabinete */}
              <div className="grid grid-cols-1 gap-x-6 gap-y-2.5 border-t border-border-subtle pt-3 text-xs sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center gap-2 text-text">
                  <Calendar
                    className="h-3.5 w-3.5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span>{formatBirthDate(deputado.dataNascimento)}</span>
                </div>

                <div className="flex items-center gap-2 truncate text-text">
                  <MapPin
                    className="h-3.5 w-3.5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span className="truncate">
                    Natural de {safeText(deputado.municipioNascimento)} (
                    {safeText(deputado.ufNascimento)})
                  </span>
                </div>

                <div className="flex items-center gap-2 truncate text-text">
                  <GraduationCap
                    className="h-3.5 w-3.5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span className="truncate">
                    {safeText(deputado.escolaridade)}
                  </span>
                </div>

                {deputado.gabinete.email && (
                  <div className="flex items-center gap-2 truncate text-text">
                    <Mail
                      className="h-3.5 w-3.5 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <a
                      href={`mailto:${deputado.gabinete.email}`}
                      className="truncate text-link hover:underline"
                      title="Enviar e-mail para o gabinete parlamentar"
                    >
                      {deputado.gabinete.email}
                    </a>
                  </div>
                )}

                {deputado.gabinete && (
                  <div className="flex items-center gap-2 truncate text-text sm:col-span-2">
                    <Building
                      className="h-3.5 w-3.5 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span className="truncate">
                      {formatGabineteAddressLine(deputado.gabinete)}
                    </span>
                  </div>
                )}
              </div>

              {/* Auditoria de Metadados e Sincronização */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border-subtle pt-2.5 text-[11px] text-text-subtle">
                <span aria-hidden="true">·</span>
                <span>
                  Última alteração cadastral: {formatDate(deputado.updatedAt)}
                </span>
                <span aria-hidden="true">·</span>
                <span>Data do status: {formatDate(deputado.dataStatus)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Linha do Tempo Partidária (Regra inegociável de histórico de filiações) */}
        <div className="border-t border-border bg-surface p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
            <h3 className="text-xs font-bold tracking-wider text-text uppercase">
              Histórico Partidário em Linha do Tempo
            </h3>
            <span className="text-[11px] text-text-muted">
              (Vínculos por vigência na Câmara)
            </span>
          </div>

          {filiacoes ? (
            <div className="relative ml-2 space-y-3 border-l-2 border-border pl-6">
              {filiacoes.map((filiacao, idx) => {
                const isAtual = filiacao.dataFim === null;
                return (
                  <div key={idx} className="group relative">
                    <div
                      className={`absolute top-1 -left-7.75 h-3 w-3 rounded-full border-2 border-surface ${isAtual
                          ? "bg-primary ring-2 ring-primary/20"
                          : "bg-text-subtle"
                        }`}
                      aria-hidden="true"
                    />
                    <div className="flex flex-col gap-1 text-xs sm:flex-row sm:items-baseline sm:justify-between">
                      <div className="flex items-center gap-2">
                        <strong className="font-mono text-text">
                          {filiacao.siglaPartido}
                        </strong>
                        <span className="text-text-muted">
                          — {filiacao.nomePartido}
                        </span>
                        {isAtual && (
                          <span className="rounded-full bg-(--color-primary-light) px-2 py-0.5 text-[10px] font-bold text-primary">
                            Filiação Vigente
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[11px] text-text-subtle">
                        {formatDate(filiacao.dataInicio)} até{" "}
                        {filiacao.dataFim
                          ? formatDate(filiacao.dataFim)
                          : "o momento"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>

      <DeputadoDespesas
        key={data.perfil.id}
        deputadoId={data.perfil.id}
        legislaturaIds={data.legislaturas.map((l) => l.legislaturaId)}
      />
    </div>
  );
};
