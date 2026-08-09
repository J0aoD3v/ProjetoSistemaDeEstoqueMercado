package j0aod3v.sistemaestoquemercado.model.dto;

import java.util.List;

public class EntidadeMetaDTO {

    private String chave;
    private String rotulo;
    private String descricao;
    private long totalRegistros;
    private boolean permitirImportacao = true;
    private List<ColunaMetaDTO> colunas;

    public EntidadeMetaDTO() {}

    public EntidadeMetaDTO(String chave, String rotulo, String descricao, long totalRegistros, List<ColunaMetaDTO> colunas) {
        this.chave = chave;
        this.rotulo = rotulo;
        this.descricao = descricao;
        this.totalRegistros = totalRegistros;
        this.colunas = colunas;
    }

    public String getChave() { return chave; }
    public void setChave(String chave) { this.chave = chave; }
    public String getRotulo() { return rotulo; }
    public void setRotulo(String rotulo) { this.rotulo = rotulo; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public long getTotalRegistros() { return totalRegistros; }
    public void setTotalRegistros(long totalRegistros) { this.totalRegistros = totalRegistros; }
    public boolean isPermitirImportacao() { return permitirImportacao; }
    public void setPermitirImportacao(boolean permitirImportacao) { this.permitirImportacao = permitirImportacao; }
    public List<ColunaMetaDTO> getColunas() { return colunas; }
    public void setColunas(List<ColunaMetaDTO> colunas) { this.colunas = colunas; }
}