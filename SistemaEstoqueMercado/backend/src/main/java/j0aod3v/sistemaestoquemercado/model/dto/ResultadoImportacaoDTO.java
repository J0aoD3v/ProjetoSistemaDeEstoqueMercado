package j0aod3v.sistemaestoquemercado.model.dto;

import java.util.ArrayList;
import java.util.List;

public class ResultadoImportacaoDTO {

    private long totalLinhas;
    private long importados;
    private long duplicadosIgnorados;
    private long errosRejeitados;
    private boolean sucesso;
    private String mensagem;
    private final List<ErroLinhaDTO> erros = new ArrayList<>();

    public ResultadoImportacaoDTO() {}

    public long getTotalLinhas() { return totalLinhas; }
    public void setTotalLinhas(long totalLinhas) { this.totalLinhas = totalLinhas; }
    public long getImportados() { return importados; }
    public void setImportados(long importados) { this.importados = importados; }
    public long getDuplicadosIgnorados() { return duplicadosIgnorados; }
    public void setDuplicadosIgnorados(long duplicadosIgnorados) { this.duplicadosIgnorados = duplicadosIgnorados; }
    public long getErrosRejeitados() { return errosRejeitados; }
    public void setErrosRejeitados(long errosRejeitados) { this.errosRejeitados = errosRejeitados; }
    public boolean isSucesso() { return sucesso; }
    public void setSucesso(boolean sucesso) { this.sucesso = sucesso; }
    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }
    public List<ErroLinhaDTO> getErros() { return erros; }
}