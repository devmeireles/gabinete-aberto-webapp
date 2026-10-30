import { ILegislatura } from "./legislatura.interface";

export interface ResumoTotais {
  valorBruto: number;
  valorGlosa: number;
  valorLiquido: number;
  totalRegistros: number;
  deputadosAtivosCount?: number;
  partidosCount?: number;
}

export interface IOverviewMetrics {
  legislaturaAtual: ILegislatura;
  totais: ResumoTotais;
  evolucaoMensal: Array<{
    ano: number;
    mes: number;
    competenciaFormatada: string;
    valorLiquido: number;
    valorGlosa: number;
    valorBruto: number;
    quantidadeDespesas: number;
  }>;
  distribuicaoPorTipo: Array<{
    tipoDespesa: string;
    tipoDespesaId: number;
    valorLiquido: number;
    percentual: number;
    quantidade: number;
  }>;
  maioresGastosPartidos: Array<{
    partidoId: number;
    sigla: string;
    nome: string;
    totalLiquido: number;
    membrosCount: number;
    mediaPorMembro: number;
  }>;
  meta: {
    lastUpdatedAt: string;
    fonte: string;
    proximaCargaAgendada: string;
  };
}
