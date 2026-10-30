export interface ILegislatura {
  id: number;
  numero: number;
  dataInicio: string; // ISO date 'YYYY-MM-DD'
  dataFim: string; // ISO date 'YYYY-MM-DD'
  anoInicio: number;
  anoFim: number;
  uri: string;
  isAtual: boolean;
}
