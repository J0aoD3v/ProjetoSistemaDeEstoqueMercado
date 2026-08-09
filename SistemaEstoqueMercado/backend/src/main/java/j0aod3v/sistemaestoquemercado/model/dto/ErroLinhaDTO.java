package j0aod3v.sistemaestoquemercado.model.dto;

public class ErroLinhaDTO {

    private long linha;
    private String mensagem;

    public ErroLinhaDTO() {}

    public ErroLinhaDTO(long linha, String mensagem) {
        this.linha = linha;
        this.mensagem = mensagem;
    }

    public long getLinha() { return linha; }
    public void setLinha(long linha) { this.linha = linha; }
    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }
}