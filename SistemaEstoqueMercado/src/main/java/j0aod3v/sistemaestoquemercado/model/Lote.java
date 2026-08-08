package j0aod3v.sistemaestoquemercado.model;

import java.time.LocalDate;

public class Lote {

    private Integer idLote;
    private String numeroLote;
    private LocalDate dataFabricacao;
    private LocalDate dataValidade;
    private Integer idProduto;

    public Lote() {
    }

    public Lote(Integer idLote, String numeroLote,
                LocalDate dataFabricacao,
                LocalDate dataValidade,
                Integer idProduto) {
        this.idLote = idLote;
        this.numeroLote = numeroLote;
        this.dataFabricacao = dataFabricacao;
        this.dataValidade = dataValidade;
        this.idProduto = idProduto;
    }

    public Integer getIdLote() {
        return idLote;
    }

    public void setIdLote(Integer idLote) {
        this.idLote = idLote;
    }

    public String getNumeroLote() {
        return numeroLote;
    }

    public void setNumeroLote(String numeroLote) {
        this.numeroLote = numeroLote;
    }

    public LocalDate getDataFabricacao() {
        return dataFabricacao;
    }

    public void setDataFabricacao(LocalDate dataFabricacao) {
        this.dataFabricacao = dataFabricacao;
    }

    public LocalDate getDataValidade() {
        return dataValidade;
    }

    public void setDataValidade(LocalDate dataValidade) {
        this.dataValidade = dataValidade;
    }

    public Integer getIdProduto() {
        return idProduto;
    }

    public void setIdProduto(Integer idProduto) {
        this.idProduto = idProduto;
    }
}