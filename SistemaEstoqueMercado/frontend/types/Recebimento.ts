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
