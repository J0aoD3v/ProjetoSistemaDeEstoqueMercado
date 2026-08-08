package j0aod3v.sistemaestoquemercado.model;

import java.math.BigDecimal;
import java.time.LocalDate;

public class NotaFiscal {

    private Integer idNotaFiscal;
    private String numeroNf;
    private String serie;
    private LocalDate dataEmissao;
    private String chaveAcessoNfe;
    private BigDecimal valorTotal;
    private Integer idFornecedor;

    public NotaFiscal() {
    }

    public NotaFiscal(Integer idNotaFiscal, String numeroNf,
                      String serie, LocalDate dataEmissao,
                      String chaveAcessoNfe,
                      BigDecimal valorTotal,
                      Integer idFornecedor) {
        this.idNotaFiscal = idNotaFiscal;
        this.numeroNf = numeroNf;
        this.serie = serie;
        this.dataEmissao = dataEmissao;
        this.chaveAcessoNfe = chaveAcessoNfe;
        this.valorTotal = valorTotal;
        this.idFornecedor = idFornecedor;
    }

    public Integer getIdNotaFiscal() {
        return idNotaFiscal;
    }

    public void setIdNotaFiscal(Integer idNotaFiscal) {
        this.idNotaFiscal = idNotaFiscal;
    }

    public String getNumeroNf() {
        return numeroNf;
    }

    public void setNumeroNf(String numeroNf) {
        this.numeroNf = numeroNf;
    }

    public String getSerie() {
        return serie;
    }

    public void setSerie(String serie) {
        this.serie = serie;
    }

    public LocalDate getDataEmissao() {
        return dataEmissao;
    }

    public void setDataEmissao(LocalDate dataEmissao) {
        this.dataEmissao = dataEmissao;
    }

    public String getChaveAcessoNfe() {
        return chaveAcessoNfe;
    }

    public void setChaveAcessoNfe(String chaveAcessoNfe) {
        this.chaveAcessoNfe = chaveAcessoNfe;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    public Integer getIdFornecedor() {
        return idFornecedor;
    }

    public void setIdFornecedor(Integer idFornecedor) {
        this.idFornecedor = idFornecedor;
    }
}