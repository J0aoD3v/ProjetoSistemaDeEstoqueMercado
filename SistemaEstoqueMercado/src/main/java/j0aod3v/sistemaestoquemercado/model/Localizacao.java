package j0aod3v.sistemaestoquemercado.model;

public class Localizacao {

    private Integer idLocalizacao;
    private String codigoPosicao;
    private String tipoArmazenamento;

    public Localizacao() {
    }

    public Localizacao(Integer idLocalizacao,
                       String codigoPosicao,
                       String tipoArmazenamento) {
        this.idLocalizacao = idLocalizacao;
        this.codigoPosicao = codigoPosicao;
        this.tipoArmazenamento = tipoArmazenamento;
    }

    public Integer getIdLocalizacao() {
        return idLocalizacao;
    }

    public void setIdLocalizacao(Integer idLocalizacao) {
        this.idLocalizacao = idLocalizacao;
    }

    public String getCodigoPosicao() {
        return codigoPosicao;
    }

    public void setCodigoPosicao(String codigoPosicao) {
        this.codigoPosicao = codigoPosicao;
    }

    public String getTipoArmazenamento() {
        return tipoArmazenamento;
    }

    public void setTipoArmazenamento(String tipoArmazenamento) {
        this.tipoArmazenamento = tipoArmazenamento;
    }
}