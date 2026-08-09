package j0aod3v.sistemaestoquemercado.model.dto;

public class ColunaMetaDTO {

    private String coluna;
    private String rotulo;
    private String tipo;
    private boolean obrigatorio;
    private String exemplo;
    private String descricao;

    public ColunaMetaDTO() {}

    public ColunaMetaDTO(String coluna, String rotulo, String tipo, boolean obrigatorio, String exemplo, String descricao) {
        this.coluna = coluna;
        this.rotulo = rotulo;
        this.tipo = tipo;
        this.obrigatorio = obrigatorio;
        this.exemplo = exemplo;
        this.descricao = descricao;
    }

    public String getColuna() { return coluna; }
    public void setColuna(String coluna) { this.coluna = coluna; }
    public String getRotulo() { return rotulo; }
    public void setRotulo(String rotulo) { this.rotulo = rotulo; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public boolean isObrigatorio() { return obrigatorio; }
    public void setObrigatorio(boolean obrigatorio) { this.obrigatorio = obrigatorio; }
    public String getExemplo() { return exemplo; }
    public void setExemplo(String exemplo) { this.exemplo = exemplo; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
}