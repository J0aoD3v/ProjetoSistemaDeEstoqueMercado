export interface Lote {
  idLote?: number;
  numeroLote: string;
  dataFabricacao: string; // Usando string para datas ISO
  dataValidade: string;
  idProduto: number;
}