package j0aod3v.sistemaestoquemercado.model;

import java.math.BigDecimal;

public class ItemRecebimento {

    private Integer idItemRecebimento;
    private BigDecimal quantidadeDeclarada;
    private BigDecimal quantidadeConferida;
    private Integer idRecebimento;
    private Integer idLote;
    private Integer idLocalizacao;

    public ItemRecebimento() {
    }

    public ItemRecebimento(Integer idItemRecebimento,
                           BigDecimal quantidadeDeclarada,
                           BigDecimal quantidadeConferida,
                           Integer idRecebimento,
                           Integer idLote,
                           Integer idLocalizacao) {

        this.idItemRecebimento = idItemRecebimento;
        this.quantidadeDeclarada = quantidadeDeclarada;
        this.quantidadeConferida = quantidadeConferida;
        this.idRecebimento = idRecebimento;
        this.idLote = idLote;
        this.idLocalizacao = idLocalizacao;
    }

    public Integer getIdItemRecebimento() {
        return idItemRecebimento;
    }

    public void setIdItemRecebimento(Integer idItemRecebimento) {
        this.idItemRecebimento = idItemRecebimento;
    }

    public BigDecimal getQuantidadeDeclarada() {
        return quantidadeDeclarada;
    }

    public void setQuantidadeDeclarada(BigDecimal quantidadeDeclarada) {
        this.quantidadeDeclarada = quantidadeDeclarada;
    }

    public BigDecimal getQuantidadeConferida() {
        return quantidadeConferida;
    }

    public void setQuantidadeConferida(BigDecimal quantidadeConferida) {
        this.quantidadeConferida = quantidadeConferida;
    }

    public Integer getIdRecebimento() {
        return idRecebimento;
    }

    public void setIdRecebimento(Integer idRecebimento) {
        this.idRecebimento = idRecebimento;
    }

    public Integer getIdLote() {
        return idLote;
    }

    public void setIdLote(Integer idLote) {
        this.idLote = idLote;
    }

    public Integer getIdLocalizacao() {
        return idLocalizacao;
    }

    public void setIdLocalizacao(Integer idLocalizacao) {
        this.idLocalizacao = idLocalizacao;
    }
}