export interface NotaFiscal {
  idNotaFiscal?: number;
  numeroNf: string;
  serie: string;
  dataEmissao: string;
  chaveAcessoNfe: string;
  valorTotal: number;
  idFornecedor: number;
}
