import {
    ArrowRight,
    Building,
    Calculator,
    Car,
    Coffee,
    Compass,
    FileCheck,
    Fuel,
    Hotel,
    MapPin,
    Megaphone,
    PieChart,
    Plane,
    Sparkles
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { DEPUTADOS, DESPESAS } from '../../lib/data/dataset.ts';
import { BILHETES_AEREOS } from '../../lib/data/schemaModels.ts';
import { formatCurrency, formatInteger, formatPercent } from '../../lib/format/formatters.ts';
import { BrazilExpensesMap } from './BrazilExpensesMap.tsx';

interface CitizenInfographicViewProps {
    onNavigateToDeputyDossier?: (deputyId: number) => void;
    onNavigateToExpensesWithFilters?: (filters: any) => void;
}

export const CitizenInfographicView: React.FC<CitizenInfographicViewProps> = ({
    onNavigateToDeputyDossier,
    onNavigateToExpensesWithFilters,
}) => {
    const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');
    const [simulatorAmount, setSimulatorAmount] = useState<number>(45000);

    // Total overview numbers
    const totalGeral = useMemo(() => {
        return DESPESAS.reduce((acc, d) => acc + d.valorLiquido, 0);
    }, []);

    const totalComprovantes = DESPESAS.length;
    const totalDeputados = DEPUTADOS.length;
    const mediaNacionalPorDeputado = totalDeputados > 0 ? totalGeral / totalDeputados : 0;

    // Category breakdown
    const categoryStats = useMemo(() => {
        const map = new Map<string, { total: number; count: number; icon: any }>();

        const getIconForCategory = (cat: string) => {
            const lower = cat.toLowerCase();
            if (lower.includes('passag') || lower.includes('aére')) return Plane;
            if (lower.includes('divulga') || lower.includes('public')) return Megaphone;
            if (lower.includes('combust') || lower.includes('lubrif')) return Fuel;
            if (lower.includes('locação') || lower.includes('veícul') || lower.includes('fretament'))
                return Car;
            if (lower.includes('hosped')) return Hotel;
            if (lower.includes('aliment')) return Coffee;
            return Building;
        };

        DESPESAS.forEach((d) => {
            const cur = map.get(d.tipoDespesa) || {
                total: 0,
                count: 0,
                icon: getIconForCategory(d.tipoDespesa),
            };
            cur.total += d.valorLiquido;
            cur.count += 1;
            map.set(d.tipoDespesa, cur);
        });

        return Array.from(map.entries())
            .map(([nome, data]) => ({
                nome,
                total: data.total,
                count: data.count,
                percent: totalGeral > 0 ? (data.total / totalGeral) * 100 : 0,
                salariosMinimos: Number((data.total / 1509).toFixed(1)),
                cestasBasicas: Number((data.total / 830).toFixed(1)),
                Icon: data.icon,
            }))
            .sort((a, b) => b.total - a.total);
    }, [totalGeral]);

    // Regional breakdown
    const regionalStats = useMemo(() => {
        const regions = [
            { id: 'Sudeste', ufs: ['SP', 'RJ', 'MG', 'ES'] },
            { id: 'Nordeste', ufs: ['BA', 'PE', 'CE', 'MA', 'PB', 'RN', 'AL', 'SE', 'PI'] },
            { id: 'Sul', ufs: ['PR', 'RS', 'SC'] },
            { id: 'Centro-Oeste', ufs: ['DF', 'GO', 'MT', 'MS'] },
            { id: 'Norte', ufs: ['AM', 'PA', 'RO', 'AC', 'TO', 'RR', 'AP'] },
        ];

        return regions.map((reg) => {
            const depsInReg = DEPUTADOS.filter((d) => reg.ufs.includes(d.siglaUf));
            const depIds = new Set(depsInReg.map((d) => d.id));
            const despesasInReg = DESPESAS.filter((d) => reg.ufs.includes(d.uf));
            const total = despesasInReg.reduce((acc, d) => acc + d.valorLiquido, 0);
            const media = depsInReg.length > 0 ? total / depsInReg.length : 0;
            const voos = BILHETES_AEREOS.filter((b) => depIds.has(b.deputadoId));

            return {
                regiao: reg.id,
                ufs: reg.ufs.join(', '),
                totalDeputados: depsInReg.length,
                totalDespesas: total,
                mediaPorDeputado: media,
                totalVoos: voos.length,
                percentualNacional: totalGeral > 0 ? (total / totalGeral) * 100 : 0,
            };
        });
    }, [totalGeral]);

    return (
        <div className="space-y-10">
            {/* 1. Hero Infographic Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-emerald-500/30">
                <div className="relative z-10 max-w-3xl space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        Infográfico Cidadão • Transparência em Linguagem Acessível
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                        Para Onde Vai o Dinheiro da Cota Parlamentar?
                    </h2>
                    <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
                        A Cota para o Exercício da Atividade Parlamentar (CEAP) financia passagens aéreas,
                        divulgação do mandato, combustíveis e escritórios. Abaixo você navega pelo mapa do
                        Brasil, entende cada centavo e compara gastos em termos da vida real.
                    </p>
                </div>

                {/* 3 Large Highlight Metric Cards inside Hero */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-emerald-500/20">
                    <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                        <span className="text-xs text-emerald-200 uppercase font-bold tracking-wider block">
                            Total Ressarcido no Período
                        </span>
                        <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">
                            {formatCurrency(totalGeral)}
                        </span>
                        <span className="text-[11px] text-emerald-200 mt-0.5 block">
                            Equivalente a {(totalGeral / 1509).toFixed(0)} salários mínimos
                        </span>
                    </div>

                    <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                        <span className="text-xs text-emerald-200 uppercase font-bold tracking-wider block">
                            Média por Deputado em Exercício
                        </span>
                        <span className="text-2xl sm:text-3xl font-black text-emerald-300 mt-1 block">
                            {formatCurrency(mediaNacionalPorDeputado)}
                        </span>
                        <span className="text-[11px] text-emerald-200 mt-0.5 block">
                            Base justa de comparação nacional
                        </span>
                    </div>

                    <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                        <span className="text-xs text-emerald-200 uppercase font-bold tracking-wider block">
                            Comprovantes Auditados
                        </span>
                        <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">
                            {formatInteger(totalComprovantes)} notas fiscais
                        </span>
                        <span className="text-[11px] text-emerald-200 mt-0.5 block">
                            {formatInteger(BILHETES_AEREOS.length)} bilhetes de voo vinculados
                        </span>
                    </div>
                </div>
            </div>

            {/* 2. Interactive Map of Brazil with States */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl sm:text-2xl font-black text-[var(--color-text)] flex items-center gap-2">
                            <MapPin className="w-6 h-6 text-[var(--color-primary)]" />
                            1. Mapa Interativo: Onde os Recursos Estão Concentrados?
                        </h3>
                        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
                            Toque ou clique em qualquer estado no mapa para ver a bancada, o gasto médio e o
                            principal fornecedor contratado.
                        </p>
                    </div>
                </div>

                <BrazilExpensesMap onNavigateToExpenses={onNavigateToExpensesWithFilters} />
            </section>

            {/* 3. Infográfico de Categorias: "Com o que o dinheiro foi gasto?" */}
            <section className="space-y-6">
                <div>
                    <h3 className="text-xl sm:text-2xl font-black text-[var(--color-text)] flex items-center gap-2">
                        <PieChart className="w-6 h-6 text-amber-500" />
                        2. Com o Que os Deputados Gastam?
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
                        Veja as principais rubricas da cota parlamentar e o que cada valor representa em
                        salários mínimos da vida real.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryStats.map((cat, idx) => {
                        const Icon = cat.Icon;

                        return (
                            <div
                                key={cat.nome}
                                className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm hover:shadow-md transition-shadow space-y-4 relative overflow-hidden"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] shrink-0">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] font-mono">
                                                #{idx + 1} Maior Despesa
                                            </span>
                                            <h4 className="text-sm font-bold text-[var(--color-text)] line-clamp-1">
                                                {cat.nome}
                                            </h4>
                                        </div>
                                    </div>
                                </div>

                                {/* Amount and percentage bar */}
                                <div>
                                    <div className="flex items-baseline justify-between">
                                        <span className="text-xl font-extrabold text-[var(--color-text)]">
                                            {formatCurrency(cat.total)}
                                        </span>
                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono">
                                            {formatPercent(cat.percent)} do total
                                        </span>
                                    </div>

                                    <div className="w-full bg-[var(--color-surface-hover)] h-2.5 rounded-full overflow-hidden mt-2 border border-[var(--color-border)]/50">
                                        <div
                                            className="bg-gradient-to-r from-[var(--color-primary)] to-emerald-500 h-full rounded-full"
                                            style={{ width: `${Math.max(cat.percent, 3)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Real-world equivalents */}
                                <div className="p-3 rounded-xl bg-[var(--color-surface-hover)]/40 border border-[var(--color-border)] space-y-1.5 text-xs text-[var(--color-text-muted)]">
                                    <div className="flex items-center justify-between">
                                        <span>Equivale a:</span>
                                        <strong className="text-[var(--color-text)] font-semibold">
                                            {cat.salariosMinimos} salários mínimos
                                        </strong>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px]">
                                        <span>Cestas básicas (DIEESE):</span>
                                        <strong className="text-[var(--color-text)] font-semibold">
                                            {cat.cestasBasicas} cestas
                                        </strong>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[var(--color-border)]">
                                        <span>Comprovantes emitidos:</span>
                                        <span className="font-semibold text-[var(--color-text)]">
                                            {formatInteger(cat.count)} notas
                                        </span>
                                    </div>
                                </div>

                                {/* Quick filter action */}
                                {onNavigateToExpensesWithFilters && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onNavigateToExpensesWithFilters({
                                                searchTerm: cat.nome,
                                            })
                                        }
                                        className="w-full text-center py-2 text-xs font-semibold text-[var(--color-primary)] hover:underline inline-flex items-center justify-center gap-1"
                                    >
                                        Ver notas desta categoria
                                        <ArrowRight className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 4. Infográfico: Comparativo das 5 Grandes Regiões */}
            <section className="space-y-6">
                <div>
                    <h3 className="text-xl sm:text-2xl font-black text-[var(--color-text)] flex items-center gap-2">
                        <Compass className="w-6 h-6 text-indigo-500" />
                        3. Como as Regiões do Brasil se Comparam?
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
                        Comparação da média de gastos por deputado em cada região geográfica do Brasil.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {regionalStats.map((reg) => (
                        <div
                            key={reg.regiao}
                            className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                                    {reg.regiao}
                                </span>
                                <span className="text-xs font-mono text-[var(--color-text-muted)]">
                                    {formatPercent(reg.percentualNacional)}
                                </span>
                            </div>

                            <div>
                                <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] block">
                                    Média por Deputado
                                </span>
                                <span className="text-lg font-bold text-[var(--color-text)] block">
                                    {formatCurrency(reg.mediaPorDeputado)}
                                </span>
                            </div>

                            <div className="pt-2 border-t border-[var(--color-border)] text-xs space-y-1 text-[var(--color-text-muted)]">
                                <div className="flex justify-between">
                                    <span>Total regional:</span>
                                    <span className="font-semibold text-[var(--color-text)]">
                                        {formatCurrency(reg.totalDespesas)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Parlamentares:</span>
                                    <span className="font-semibold text-[var(--color-text)]">
                                        {reg.totalDeputados}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Bilhetes aéreos:</span>
                                    <span className="font-semibold text-[var(--color-text)]">
                                        {reg.totalVoos} voos
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. Infográfico: "O Caminho do Dinheiro" (Fluxograma Cidadão) */}
            <section className="p-6 sm:p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm space-y-6">
                <div>
                    <h3 className="text-xl sm:text-2xl font-black text-[var(--color-text)] flex items-center gap-2">
                        <FileCheck className="w-6 h-6 text-emerald-500" />
                        4. O Caminho do Reembolso: Como Funciona na Prática?
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
                        Entenda passo a passo as 4 etapas oficiais entre a contratação do serviço e a
                        publicação para o cidadão.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                    <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-hover)]/30 space-y-2 relative">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm">
                            1
                        </div>
                        <h4 className="text-sm font-bold text-[var(--color-text)]">Atividade Parlamentar</h4>
                        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                            O deputado realiza uma viagem, contrata consultoria, abastece o carro ou divulga ações
                            do mandato.
                        </p>
                    </div>

                    <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-hover)]/30 space-y-2 relative">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm">
                            2
                        </div>
                        <h4 className="text-sm font-bold text-[var(--color-text)]">Comprovante Fiscal</h4>
                        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                            A empresa emite Nota Fiscal Eletrônica (NF-e) com CNPJ válido e descrição discriminada
                            dos itens contratados.
                        </p>
                    </div>

                    <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-hover)]/30 space-y-2 relative">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm">
                            3
                        </div>
                        <h4 className="text-sm font-bold text-[var(--color-text)]">Auditoria da Câmara</h4>
                        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                            O setor técnico analisa os limites da cota. Caso haja valor indevido, ocorre a retenção
                            (glosa contábil).
                        </p>
                    </div>

                    <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-hover)]/30 space-y-2 relative">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                            4
                        </div>
                        <h4 className="text-sm font-bold text-[var(--color-text)]">Dados Abertos</h4>
                        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                            O reembolso é publicado na API oficial, onde nosso sistema sincroniza e calcula as
                            equivalências para o cidadão.
                        </p>
                    </div>
                </div>
            </section>

            {/* 6. Simulador Interativo de Equivalências do Cidadão */}
            <section className="p-6 sm:p-8 rounded-2xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-hover)]/30 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl sm:text-2xl font-black text-[var(--color-text)] flex items-center gap-2">
                            <Calculator className="w-6 h-6 text-[var(--color-primary)]" />
                            5. Calculadora de Perspectiva do Cidadão
                        </h3>
                        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
                            Arraste o valor ou digite uma quantia para ver instantaneamente a quantas realidades
                            ela equivale na economia real do trabalhador.
                        </p>
                    </div>
                </div>

                {/* Input slider */}
                <div className="space-y-4 max-w-xl">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                            Simular Valor em Reais (R$):
                        </label>
                        <span className="text-2xl font-black text-[var(--color-primary)] font-mono">
                            {formatCurrency(simulatorAmount)}
                        </span>
                    </div>

                    <input
                        type="range"
                        min="1000"
                        max="120000"
                        step="1000"
                        value={simulatorAmount}
                        onChange={(e) => setSimulatorAmount(Number(e.target.value))}
                        className="w-full h-2.5 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
                    />

                    <div className="flex justify-between text-[11px] text-[var(--color-text-muted)] font-mono">
                        <span>R$ 1.000 (Mínimo)</span>
                        <span>R$ 45.000 (Média cota mensal)</span>
                        <span>R$ 120.000 (Acumulado)</span>
                    </div>
                </div>

                {/* Real World Conversion Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs">
                        <span className="text-[11px] font-bold uppercase text-[var(--color-text-muted)] block">
                            Salários Mínimos Nacionais
                        </span>
                        <span className="text-2xl sm:text-3xl font-black text-[var(--color-primary)] mt-1 block font-mono">
                            {(simulatorAmount / 1509).toFixed(1)}x
                        </span>
                        <span className="text-xs text-[var(--color-text-muted)] mt-1 block">
                            Equivale a {(simulatorAmount / 1509).toFixed(0)} meses inteiros de trabalho ao piso
                            nacional (R$ 1.509,00).
                        </span>
                    </div>

                    <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs">
                        <span className="text-[11px] font-bold uppercase text-[var(--color-text-muted)] block">
                            Cestas Básicas Familiares (DIEESE)
                        </span>
                        <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1 block font-mono">
                            {(simulatorAmount / 830).toFixed(1)}x
                        </span>
                        <span className="text-xs text-[var(--color-text-muted)] mt-1 block">
                            Alimentação mensal básica completa calculada pelo DIEESE (média R$ 830,00).
                        </span>
                    </div>

                    <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs">
                        <span className="text-[11px] font-bold uppercase text-[var(--color-text-muted)] block">
                            Renda Média do Trabalhador (IBGE)
                        </span>
                        <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block font-mono">
                            {(simulatorAmount / 3210).toFixed(1)}x
                        </span>
                        <span className="text-xs text-[var(--color-text-muted)] mt-1 block">
                            Rendimento médio habitual de trabalhadores brasileiros medido pela PNAD Contínua (R$
                            3.210,00).
                        </span>
                    </div>
                </div>
            </section>
        </div>
    );
};
