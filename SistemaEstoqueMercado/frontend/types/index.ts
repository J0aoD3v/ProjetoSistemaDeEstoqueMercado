export interface Produto {
  idProduto?: number;
  sku: string;
  codigoBarras: string;
  descricao: string;
  unidadeMedida: string;
  statusAtivo: boolean;
}

export interface Fornecedor {
  idFornecedor?: number;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
}

export interface Recebimento {
  idRecebimento?: number;
  dataHoraChegada: string;
  dataHoraInicioConferencia?: string;
  dataHoraFimConferencia?: string;
  statusRecebimento: string;
  idNotaFiscal: number;
  idFuncionario: number;
  idMotorista: number;
  idVeiculo: number;
}

export interface Divergencia {
  idDivergencia?: number;
  tipoDivergencia: string;
  quantidadeDivergente: number;
  observacao: string;
  idItemRecebimento: number;
}