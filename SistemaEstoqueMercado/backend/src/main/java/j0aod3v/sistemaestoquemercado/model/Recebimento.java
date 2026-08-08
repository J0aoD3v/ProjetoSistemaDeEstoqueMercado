package j0aod3v.sistemaestoquemercado.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recebimentos")
public class Recebimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idRecebimento;

    @Column(name = "data_hora_chegada")
    private LocalDateTime dataHoraChegada;

    @Column(name = "data_hora_inicio_conferencia")
    private LocalDateTime dataHoraInicioConferencia;

    @Column(name = "data_hora_fim_conferencia")
    private LocalDateTime dataHoraFimConferencia;

    @Column(name = "status_recebimento")
    private String statusRecebimento;

    @Column(name = "id_nota_fiscal")
    private Integer idNotaFiscal;

    @Column(name = "id_funcionario")
    private Integer idFuncionario;

    @Column(name = "id_motorista")
    private Integer idMotorista;

    @Column(name = "id_veiculo")
    private Integer idVeiculo;

    public Recebimento() {}

    public Recebimento(Integer idRecebimento, LocalDateTime dataHoraChegada, LocalDateTime dataHoraInicioConferencia, LocalDateTime dataHoraFimConferencia, String statusRecebimento, Integer idNotaFiscal, Integer idFuncionario, Integer idMotorista, Integer idVeiculo) {
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

    public Integer getIdRecebimento() { return idRecebimento; }
    public void setIdRecebimento(Integer idRecebimento) { this.idRecebimento = idRecebimento; }
    public LocalDateTime getDataHoraChegada() { return dataHoraChegada; }
    public void setDataHoraChegada(LocalDateTime dataHoraChegada) { this.dataHoraChegada = dataHoraChegada; }
    public LocalDateTime getDataHoraInicioConferencia() { return dataHoraInicioConferencia; }
    public void setDataHoraInicioConferencia(LocalDateTime dataHoraInicioConferencia) { this.dataHoraInicioConferencia = dataHoraInicioConferencia; }
    public LocalDateTime getDataHoraFimConferencia() { return dataHoraFimConferencia; }
    public void setDataHoraFimConferencia(LocalDateTime dataHoraFimConferencia) { this.dataHoraFimConferencia = dataHoraFimConferencia; }
    public String getStatusRecebimento() { return statusRecebimento; }
    public void setStatusRecebimento(String statusRecebimento) { this.statusRecebimento = statusRecebimento; }
    public Integer getIdNotaFiscal() { return idNotaFiscal; }
    public void setIdNotaFiscal(Integer idNotaFiscal) { this.idNotaFiscal = idNotaFiscal; }
    public Integer getIdFuncionario() { return idFuncionario; }
    public void setIdFuncionario(Integer idFuncionario) { this.idFuncionario = idFuncionario; }
    public Integer getIdMotorista() { return idMotorista; }
    public void setIdMotorista(Integer idMotorista) { this.idMotorista = idMotorista; }
    public Integer getIdVeiculo() { return idVeiculo; }
    public void setIdVeiculo(Integer idVeiculo) { this.idVeiculo = idVeiculo; }
}