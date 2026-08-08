export interface AtividadeRecente {
  id: number;
  tipo: string;
  titulo: string;
  dataHora: string;
  status: string;
  corStatus: string;
}

export interface DashboardData {
  totalProdutosAtivos: number;
  totalRecebimentosHoje: number;
  totalDivergenciasAbertas: number;
  totalFornecedoresAtivos: number;
  atividadesRecentes: AtividadeRecente[];
}
