package j0aod3v.sistemaestoquemercado.model.dto;

import java.util.ArrayList;
import java.util.List;

public class ValidacaoImportacaoDTO {

    private long totalLinhas;
    private long registrosValidos;
    private long registrosComErro;
    private long registrosDuplicados;
    private boolean prontoParaImportar;
    private final List<ErroLinhaDTO> erros = new ArrayList<>();
    private final List<ErroLinhaDTO> duplicidades = new ArrayList<>();

    public ValidacaoImportacaoDTO() {}

    public long getTotalLinhas() { return totalLinhas; }
    public void setTotalLinhas(long totalLinhas) { this.totalLinhas = totalLinhas; }
    public long getRegistrosValidos() { return registrosValidos; }
    public void setRegistrosValidos(long registrosValidos) { this.registrosValidos = registrosValidos; }
    public long getRegistrosComErro() { return registrosComErro; }
    public void setRegistrosComErro(long registrosComErro) { this.registrosComErro = registrosComErro; }
    public long getRegistrosDuplicados() { return registrosDuplicados; }
    public void setRegistrosDuplicados(long registrosDuplicados) { this.registrosDuplicados = registrosDuplicados; }
    public boolean isProntoParaImportar() { return prontoParaImportar; }
    public void setProntoParaImportar(boolean prontoParaImportar) { this.prontoParaImportar = prontoParaImportar; }
    public List<ErroLinhaDTO> getErros() { return erros; }
    public List<ErroLinhaDTO> getDuplicidades() { return duplicidades; }
}