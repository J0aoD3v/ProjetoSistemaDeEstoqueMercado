export interface ColunaMeta {
  coluna: string;
  rotulo: string;
  tipo: string;
  obrigatorio: boolean;
  exemplo: string;
  descricao: string;
}

export interface EntidadeMeta {
  chave: string;
  rotulo: string;
  descricao: string;
  totalRegistros: number;
  permitirImportacao: boolean;
  colunas: ColunaMeta[];
}

export interface ErroLinha {
  linha: number;
  mensagem: string;
}

export interface ValidacaoImportacao {
  totalLinhas: number;
  registrosValidos: number;
  registrosComErro: number;
  registrosDuplicados: number;
  prontoParaImportar: boolean;
  erros: ErroLinha[];
  duplicidades: ErroLinha[];
}

export interface ResultadoImportacao {
  totalLinhas: number;
  importados: number;
  duplicadosIgnorados: number;
  errosRejeitados: number;
  sucesso: boolean;
  mensagem: string;
  erros: ErroLinha[];
}

export interface ResumoExportacao {
  chave: string;
  rotulo: string;
  formato: string;
  quantidade: number;
  colunas: string[];
}