package j0aod3v.sistemaestoquemercado.model;

import jakarta.persistence.*;

@Entity
@Table(name = "localizacoes")
public class Localizacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idLocalizacao;

    @Column(name = "codigo_posicao")
    private String codigoPosicao;

    @Column(name = "tipo_armazenamento")
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