"use client"

import { DeputyAvatar } from "@/app/components/ui/DeputyAvatar"
import { useDeputadoDetalhe } from "@/app/hooks/use-deputado-detalhe"
import { formatBirthDate, formatDate, formatGabineteAddressLine, safeText } from "@/app/lib/formartters.lib"
import { ArrowLeft, ArrowLeftRight, Building, Calendar, Check, ChevronRight, Download, ExternalLink, GraduationCap, Mail, MapPin, Share2, ShieldCheck } from "lucide-react"
import { useState } from "react"

interface IDeputadoDetailViewProps {
    id: number
}

export const DeputadoDetailView = ({ id }: IDeputadoDetailViewProps) => {
    const { data, isPending, isError } = useDeputadoDetalhe(id);

    const [copiedLink, setCopiedLink] = useState<boolean>(false);

    if (isPending) return <p>Carregando...</p>
    if (isError || !data) return <p>Deputado não encontrado.</p>

    const { perfil: deputado, filiacoes } = data

    const onBack = () => { }
    const handleDownloadCsv = () => { }

    const handleCopyLink = () => {
        try {
            const url = new URL(window.location.href);
            navigator.clipboard.writeText(url.toString());
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2500);
        } catch {

        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
                {/* Breadcrumb */}
                <nav aria-label="Navegação em trilha" className="flex items-center gap-2 text-xs text-text-muted">
                    <button
                        type="button"
                        onClick={onBack}
                        className="inline-flex items-center gap-1 font-medium hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Deputados</span>
                    </button>
                    <ChevronRight className="w-3 h-3 text-text-subtle" aria-hidden="true" />
                    <span className="text-text-subtle">Dossiê Parlamentar</span>
                    <ChevronRight className="w-3 h-3 text-text-subtle" aria-hidden="true" />
                    <span className="font-semibold text-text truncate max-w-50">
                        {deputado.nome}
                    </span>
                </nav>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={handleCopyLink}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface text-text text-xs font-medium hover:bg-surface-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                        title="Copiar link direto para este dossiê"
                    >
                        {copiedLink ? (
                            <>
                                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Link copiado!</span>
                            </>
                        ) : (
                            <>
                                <Share2 className="w-3.5 h-3.5 text-text-muted" aria-hidden="true" />
                                <span>Compartilhar</span>
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={handleDownloadCsv}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                        title="Baixar extrato completo de despesas em formato CSV"
                    >
                        <Download className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Exportar Despesas (CSV)</span>
                    </button>

                    <a
                        href={`https://www.camara.leg.br/deputados/${deputado.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-surface text-text-muted hover:text-text hover:bg-surface-hover text-xs transition-colors"
                        title="Abrir página oficial no Portal da Câmara dos Deputados"
                    >
                        <span>Portal Oficial</span>
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                </div>
            </div>

            {/* Hero Card: Biografia, Snapshot Oficial & Gabinete */}
            <section
                aria-label="Identidade Parlamentar e Snapshot Oficial"
                className="rounded-xl border border-border bg-surface shadow-xs overflow-hidden"
            >
                <div className="p-6 sm:p-8 bg-linear-to-r from-surface-subtle via-surface to-surface-subtle">
                    <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
                        {/* Foto Oficial com Destaque */}
                        <div className="shrink-0 relative">
                            <DeputyAvatar
                                urlFoto={deputado.urlFoto}
                                nome={deputado.nome}
                                size="lg"
                                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl shadow-md border-2 border-border"
                            />
                            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono bg-primary text-white shadow-xs">
                                {deputado.siglaPartido}
                            </span>
                        </div>

                        {/* Informações Principais */}
                        <div className="flex-1 space-y-3 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-(--color-primary-light) text-primary border border-primary/20">
                                    {deputado.siglaPartido} · {deputado.siglaUf}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface text-text border border-border">
                                    Situação: {deputado.situacao}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface text-text-muted border border-border">
                                    Condição: {deputado.condicaoEleitoral}
                                </span>
                                <span className="text-[11px] font-mono text-text-subtle ml-auto">
                                    ID Oficial: #{deputado.id}
                                </span>
                            </div>

                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
                                    {deputado.nome}
                                </h1>
                                <p className="text-xs text-text-muted mt-0.5">
                                    Nome civil registrado: <strong className="text-text">{deputado.nomeCivil}</strong>
                                </p>
                            </div>

                            {/* Grid de Dados Biográficos e Gabinete */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2.5 gap-x-6 pt-3 border-t border-border-subtle text-xs">
                                <div className="flex items-center gap-2 text-text">
                                    <Calendar className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
                                    <span>
                                        {formatBirthDate(deputado.dataNascimento)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-text truncate">
                                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
                                    <span className="truncate">
                                        Natural de {safeText(deputado.municipioNascimento)} ({safeText(deputado.ufNascimento)})
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-text truncate">
                                    <GraduationCap className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
                                    <span className="truncate">{safeText(deputado.escolaridade)}</span>
                                </div>

                                {deputado.gabinete.email && (
                                    <div className="flex items-center gap-2 text-text truncate">
                                        <Mail className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
                                        <a
                                            href={`mailto:${deputado.gabinete.email}`}
                                            className="text-link hover:underline truncate"
                                            title="Enviar e-mail para o gabinete parlamentar"
                                        >
                                            {deputado.gabinete.email}
                                        </a>
                                    </div>
                                )}

                                {deputado.gabinete && (
                                    <div className="flex items-center gap-2 text-text truncate sm:col-span-2">
                                        <Building className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
                                        <span className="truncate">
                                            {formatGabineteAddressLine(deputado.gabinete)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Auditoria de Metadados e Sincronização */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2.5 text-[11px] text-text-subtle border-t border-border-subtle">
                                <span aria-hidden="true">·</span>
                                <span>Última alteração cadastral: {formatDate(deputado.updatedAt)}</span>
                                <span aria-hidden="true">·</span>
                                <span>Data do status: {formatDate(deputado.dataStatus)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Linha do Tempo Partidária (Regra inegociável de histórico de filiações) */}
                <div className="p-5 sm:p-6 border-t border-border bg-surface">
                    <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck className="w-4 h-4 text-primary" aria-hidden="true" />
                        <h3 className="text-xs font-bold text-text uppercase tracking-wider">
                            Histórico Partidário em Linha do Tempo
                        </h3>
                        <span className="text-[11px] text-text-muted">
                            (Vínculos por vigência na Câmara)
                        </span>
                    </div>

                    {filiacoes ? (
                        <div className="relative pl-6 space-y-3 border-l-2 border-border ml-2">
                            {filiacoes.map((filiacao, idx) => {
                                const isAtual = filiacao.dataFim === null;
                                return (
                                    <div key={idx} className="relative group">
                                        <div
                                            className={`absolute -left-7.75 top-1 w-3 h-3 rounded-full border-2 border-surface ${isAtual ? 'bg-primary ring-2 ring-primary/20' : 'bg-text-subtle'
                                                }`}
                                            aria-hidden="true"
                                        />
                                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between text-xs gap-1">
                                            <div className="flex items-center gap-2">
                                                <strong className="text-text font-mono">{filiacao.siglaPartido}</strong>
                                                <span className="text-text-muted">— {filiacao.nomePartido}</span>
                                                {isAtual && (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-(--color-primary-light) text-primary">
                                                        Filiação Vigente
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-[11px] font-mono text-text-subtle">
                                                {formatDate(filiacao.dataInicio)} até {filiacao.dataFim ? formatDate(filiacao.dataFim) : 'o momento'}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : null}
                </div>
            </section>
        </div>
    )
}