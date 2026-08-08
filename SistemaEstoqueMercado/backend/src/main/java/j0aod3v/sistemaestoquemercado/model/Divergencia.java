package j0aod3v.sistemaestoquemercado.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "divergencias")
public class Divergencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idDivergencia;

    @Column(name = "tipo_divergencia")
    private String tipoDivergencia;

    @Column(name = "quantidade_divergente")
    private BigDecimal quantidadeDivergente;

    private String observacao;

    @Column(name = "id_item_recebimento")
    private Integer idItemRecebimento;

    public Divergencia() {}

    public Divergencia(Integer idDivergencia, String tipoDivergencia, BigDecimal quantidadeDivergente, String observacao, Integer idItemRecebimento) {
        this.idDivergencia = idDivergencia;
        this.tipoDivergencia = tipoDivergencia;
        this.quantidadeDivergente = quantidadeDivergente;
        this.observacao = observacao;
        this.idItemRecebimento = idItemRecebimento;
    }

    public Integer getIdDivergencia() { return idDivergencia; }
    public void setIdDivergencia(Integer idDivergencia) { this.idDivergencia = idDivergencia; }
    public String getTipoDivergencia() { return tipoDivergencia; }
    public void setTipoDivergencia(String tipoDivergencia) { this.tipoDivergencia = tipoDivergencia; }
    public BigDecimal getQuantidadeDivergente() { return quantidadeDivergente; }
    public void setQuantidadeDivergente(BigDecimal quantidadeDivergente) { this.quantidadeDivergente = quantidadeDivergente; }
    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) { this.observacao = observacao; }
    public Integer getIdItemRecebimento() { return idItemRecebimento; }
    public void setIdItemRecebimento(Integer idItemRecebimento) { this.idItemRecebimento = idItemRecebimento; }
}