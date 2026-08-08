package j0aod3v.sistemaestoquemercado.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "localizacoes")
public class Localizacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idLocalizacao;

    @Column(name = "codigo_posicao")
    @NotBlank
    @Pattern(regexp = "[A-Z0-9]+-[0-9]{2}-[0-9]{2}", message = "Código da posição deve estar no formato A-01-02")
    private String codigoPosicao;

    @Column(name = "tipo_armazenamento")
    @NotBlank
    private String tipoArmazenamento;

    public Localizacao() {}

    public Localizacao(Integer idLocalizacao, String codigoPosicao, String tipoArmazenamento) {
        this.idLocalizacao = idLocalizacao;
        this.codigoPosicao = codigoPosicao;
        this.tipoArmazenamento = tipoArmazenamento;
    }

    public Integer getIdLocalizacao() { return idLocalizacao; }
    public void setIdLocalizacao(Integer idLocalizacao) { this.idLocalizacao = idLocalizacao; }
    public String getCodigoPosicao() { return codigoPosicao; }
    public void setCodigoPosicao(String codigoPosicao) { this.codigoPosicao = codigoPosicao; }
    public String getTipoArmazenamento() { return tipoArmazenamento; }
    public void setTipoArmazenamento(String tipoArmazenamento) { this.tipoArmazenamento = tipoArmazenamento; }
}