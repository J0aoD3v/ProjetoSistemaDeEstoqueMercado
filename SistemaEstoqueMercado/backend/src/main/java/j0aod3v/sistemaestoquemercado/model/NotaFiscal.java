package j0aod3v.sistemaestoquemercado.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "notas_fiscais")
public class NotaFiscal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idNotaFiscal;

    @Column(name = "numero_nf")
    private String numeroNf;

    private String serie;

    @Column(name = "data_emissao")
    private LocalDate dataEmissao;

    @Column(name = "chave_acesso_nfe")
    private String chaveAcessoNfe;

    @Column(name = "valor_total")
    private BigDecimal valorTotal;

    @Column(name = "id_fornecedor")
    private Integer idFornecedor;

    public NotaFiscal() {}

    public NotaFiscal(Integer idNotaFiscal, String numeroNf, String serie, LocalDate dataEmissao, String chaveAcessoNfe, BigDecimal valorTotal, Integer idFornecedor) {
        this.idNotaFiscal = idNotaFiscal;
        this.numeroNf = numeroNf;
        this.serie = serie;
        this.dataEmissao = dataEmissao;
        this.chaveAcessoNfe = chaveAcessoNfe;
        this.valorTotal = valorTotal;
        this.idFornecedor = idFornecedor;
    }

    public Integer getIdNotaFiscal() { return idNotaFiscal; }
    public void setIdNotaFiscal(Integer idNotaFiscal) { this.idNotaFiscal = idNotaFiscal; }
    public String getNumeroNf() { return numeroNf; }
    public void setNumeroNf(String numeroNf) { this.numeroNf = numeroNf; }
    public String getSerie() { return serie; }
    public void setSerie(String serie) { this.serie = serie; }
    public LocalDate getDataEmissao() { return dataEmissao; }
    public void setDataEmissao(LocalDate dataEmissao) { this.dataEmissao = dataEmissao; }
    public String getChaveAcessoNfe() { return chaveAcessoNfe; }
    public void setChaveAcessoNfe(String chaveAcessoNfe) { this.chaveAcessoNfe = chaveAcessoNfe; }
    public BigDecimal getValorTotal() { return valorTotal; }
    public void setValorTotal(BigDecimal valorTotal) { this.valorTotal = valorTotal; }
    public Integer getIdFornecedor() { return idFornecedor; }
    public void setIdFornecedor(Integer idFornecedor) { this.idFornecedor = idFornecedor; }
}