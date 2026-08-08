package j0aod3v.sistemaestoquemercado.model;

import java.time.LocalDateTime;

public class Recebimento {

    private Integer idRecebimento;
    private LocalDateTime dataHoraChegada;
    private LocalDateTime dataHoraInicioConferencia;
    private LocalDateTime dataHoraFimConferencia;
    private String statusRecebimento;
    private Integer idNotaFiscal;
    private Integer idFuncionario;
    private Integer idMotorista;
    private Integer idVeiculo;

    public Recebimento() {
    }

    public Recebimento(Integer idRecebimento,
                       LocalDateTime dataHoraChegada,
                       LocalDateTime dataHoraInicioConferencia,
                       LocalDateTime dataHoraFimConferencia,
                       String statusRecebimento,
                       Integer idNotaFiscal,
                       Integer idFuncionario,
                       Integer idMotorista,
                       Integer idVeiculo) {

        this.idRecebimento = idRecebimento;
        this.dataHoraChegada = dataHoraChegada;
        this.dataHoraInicioConferencia = dataHoraInicioConferencia;
        this.dataHoraFimConferencia = dataHoraFimConferencia;
        this.statusRecebimento = statusRecebimento;
        this.idNotaFiscal = idNotaFiscal;
        this.idFuncionario = idFuncionario;
        this.idMotorista = idMotorista;
        this.idVeiculo = idVeiculo;
    }

    public Integer getIdRecebimento() {
        return idRecebimento;
    }

    public void setIdRecebimento(Integer idRecebimento) {
        this.idRecebimento = idRecebimento;
    }

    public LocalDateTime getDataHoraChegada() {
        return dataHoraChegada;
    }

    public void setDataHoraChegada(LocalDateTime dataHoraChegada) {
        this.dataHoraChegada = dataHoraChegada;
    }

    public LocalDateTime getDataHoraInicioConferencia() {
        return dataHoraInicioConferencia;
    }

    public void setDataHoraInicioConferencia(
            LocalDateTime dataHoraInicioConferencia) {
        this.dataHoraInicioConferencia = dataHoraInicioConferencia;
    }

    public LocalDateTime getDataHoraFimConferencia() {
        return dataHoraFimConferencia;
    }

    public void setDataHoraFimConferencia(
            LocalDateTime dataHoraFimConferencia) {
        this.dataHoraFimConferencia = dataHoraFimConferencia;
    }

    public String getStatusRecebimento() {
        return statusRecebimento;
    }

    public void setStatusRecebimento(String statusRecebimento) {
        this.statusRecebimento = statusRecebimento;
    }

    public Integer getIdNotaFiscal() {
        return idNotaFiscal;
    }

    public void setIdNotaFiscal(Integer idNotaFiscal) {
        this.idNotaFiscal = idNotaFiscal;
    }

    public Integer getIdFuncionario() {
        return idFuncionario;
    }

    public void setIdFuncionario(Integer idFuncionario) {
        this.idFuncionario = idFuncionario;
    }

    public Integer getIdMotorista() {
        return idMotorista;
    }

    public void setIdMotorista(Integer idMotorista) {
        this.idMotorista = idMotorista;
    }

    public Integer getIdVeiculo() {
        return idVeiculo;
    }

    public void setIdVeiculo(Integer idVeiculo) {
        this.idVeiculo = idVeiculo;
    }
}