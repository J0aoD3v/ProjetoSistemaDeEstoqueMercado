package j0aod3v.sistemaestoquemercado.model.dto;

import java.util.List;

public class ResumoExportacaoDTO {

    private String chave;
    private String rotulo;
    private String formato;
    private long quantidade;
    private List<String> colunas;

    public ResumoExportacaoDTO() {}

    public ResumoExportacaoDTO(String chave, String rotulo, String formato, long quantidade, List<String> colunas) {
        this.chave = chave;
        this.rotulo = rotulo;
        this.formato = formato;
        this.quantidade = quantidade;
        this.colunas = colunas;
    }

    public String getChave() { return chave; }
    public void setChave(String chave) { this.chave = chave; }
    public String getRotulo() { return rotulo; }
    public void setRotulo(String rotulo) { this.rotulo = rotulo; }
    public String getFormato() { return formato; }
    public void setFormato(String formato) { this.formato = formato; }
    public long getQuantidade() { return quantidade; }
    public void setQuantidade(long quantidade) { this.quantidade = quantidade; }
    public List<String> getColunas() { return colunas; }
    public void setColunas(List<String> colunas) { this.colunas = colunas; }
}