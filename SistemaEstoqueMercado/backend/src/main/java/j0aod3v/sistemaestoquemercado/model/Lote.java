package j0aod3v.sistemaestoquemercado.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;

@Entity
@Table(name = "lotes")
public class Lote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idLote;

    @Column(name = "numero_lote")
    @NotBlank
    @Pattern(regexp = "[A-Z0-9\\-]+", message = "Número do lote deve conter apenas letras maiúsculas, números e hífen")
    private String numeroLote;

    @Column(name = "data_fabricacao")
    @NotNull
    private LocalDate dataFabricacao;

    @Column(name = "data_validade")
    @NotNull
    private LocalDate dataValidade;

    @Column(name = "id_produto")
    @NotNull
    private Integer idProduto;

    public Lote() {}

    public Lote(Integer idLote, String numeroLote, LocalDate dataFabricacao, LocalDate dataValidade, Integer idProduto) {
        this.idLote = idLote;
        this.numeroLote = numeroLote;
        this.dataFabricacao = dataFabricacao;
        this.dataValidade = dataValidade;
        this.idProduto = idProduto;
    }

    public Integer getIdLote() { return idLote; }
    public void setIdLote(Integer idLote) { this.idLote = idLote; }
    public String getNumeroLote() { return numeroLote; }
    public void setNumeroLote(String numeroLote) { this.numeroLote = numeroLote; }
    public LocalDate getDataFabricacao() { return dataFabricacao; }
    public void setDataFabricacao(LocalDate dataFabricacao) { this.dataFabricacao = dataFabricacao; }
    public LocalDate getDataValidade() { return dataValidade; }
    public void setDataValidade(LocalDate dataValidade) { this.dataValidade = dataValidade; }
    public Integer getIdProduto() { return idProduto; }
    public void setIdProduto(Integer idProduto) { this.idProduto = idProduto; }
}