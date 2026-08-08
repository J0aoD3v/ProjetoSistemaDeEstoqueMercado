package j0aod3v.sistemaestoquemercado.model;

import java.math.BigDecimal;

public class Divergencia {

    private Integer idDivergencia;
    private String tipoDivergencia;
    private BigDecimal quantidadeDivergente;
    private String observacao;
    private Integer idItemRecebimento;

    public Divergencia() {
    }

    public Divergencia(Integer idDivergencia,
                       String tipoDivergencia,
                       BigDecimal quantidadeDivergente,
                       String observacao,
                       Integer idItemRecebimento) {

        this.idDivergencia = idDivergencia;
        this.tipoDivergencia = tipoDivergencia;
        this.quantidadeDivergente = quantidadeDivergente;
        this.observacao = observacao;
        this.idItemRecebimento = idItemRecebimento;
    }

    public Integer getIdDivergencia() {
        return idDivergencia;
    }

    public void setIdDivergencia(Integer idDivergencia) {
        this.idDivergencia = idDivergencia;
    }

    public String getTipoDivergencia() {
        return tipoDivergencia;
    }

    public void setTipoDivergencia(String tipoDivergencia) {
        this.tipoDivergencia = tipoDivergencia;
    }

    public BigDecimal getQuantidadeDivergente() {
        return quantidadeDivergente;
    }

    public void setQuantidadeDivergente(BigDecimal quantidadeDivergente) {
        this.quantidadeDivergente = quantidadeDivergente;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    public Integer getIdItemRecebimento() {
        return idItemRecebimento;
    }

    public void setIdItemRecebimento(Integer idItemRecebimento) {
        this.idItemRecebimento = idItemRecebimento;
    }
}