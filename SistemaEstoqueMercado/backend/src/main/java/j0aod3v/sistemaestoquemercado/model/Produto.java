package j0aod3v.sistemaestoquemercado.model;

import jakarta.persistence.*;

@Entity
@Table(name = "produtos")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idProduto;

    private String sku;
    
    @Column(name = "codigo_barras")
    private String codigoBarras;

    private String descricao;

    @Column(name = "unidade_medida")
    private String unidadeMedida;

    @Column(name = "status_ativo")
    private Boolean statusAtivo;

    public Produto() {}

    public Produto(Integer idProduto, String sku, String codigoBarras, String descricao, String unidadeMedida, Boolean statusAtivo) {
        this.idProduto = idProduto;
        this.sku = sku;
        this.codigoBarras = codigoBarras;
        this.descricao = descricao;
        this.unidadeMedida = unidadeMedida;
        this.statusAtivo = statusAtivo;
    }

    public Integer getIdProduto() { return idProduto; }
    public void setIdProduto(Integer idProduto) { this.idProduto = idProduto; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public String getCodigoBarras() { return codigoBarras; }
    public void setCodigoBarras(String codigoBarras) { this.codigoBarras = codigoBarras; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public String getUnidadeMedida() { return unidadeMedida; }
    public void setUnidadeMedida(String unidadeMedida) { this.unidadeMedida = unidadeMedida; }
    public Boolean getStatusAtivo() { return statusAtivo; }
    public void setStatusAtivo(Boolean statusAtivo) { this.statusAtivo = statusAtivo; }
}