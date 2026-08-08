package j0aod3v.sistemaestoquemercado.model.dto;

import java.util.List;

public class DashboardDTO {
    private long totalProdutosAtivos;
    private long totalRecebimentosHoje;
    private long totalDivergenciasAbertas;
    private long totalFornecedoresAtivos;
    private List<AtividadeRecenteDTO> atividadesRecentes;

    public DashboardDTO() {}

    public DashboardDTO(long totalProdutosAtivos, long totalRecebimentosHoje, long totalDivergenciasAbertas, long totalFornecedoresAtivos, List<AtividadeRecenteDTO> atividadesRecentes) {
        this.totalProdutosAtivos = totalProdutosAtivos;
        this.totalRecebimentosHoje = totalRecebimentosHoje;
        this.totalDivergenciasAbertas = totalDivergenciasAbertas;
        this.totalFornecedoresAtivos = totalFornecedoresAtivos;
        this.atividadesRecentes = atividadesRecentes;
    }

    public long getTotalProdutosAtivos() { return totalProdutosAtivos; }
    public void setTotalProdutosAtivos(long totalProdutosAtivos) { this.totalProdutosAtivos = totalProdutosAtivos; }
    public long getTotalRecebimentosHoje() { return totalRecebimentosHoje; }
    public void setTotalRecebimentosHoje(long totalRecebimentosHoje) { this.totalRecebimentosHoje = totalRecebimentosHoje; }
    public long getTotalDivergenciasAbertas() { return totalDivergenciasAbertas; }
    public void setTotalDivergenciasAbertas(long totalDivergenciasAbertas) { this.totalDivergenciasAbertas = totalDivergenciasAbertas; }
    public long getTotalFornecedoresAtivos() { return totalFornecedoresAtivos; }
    public void setTotalFornecedoresAtivos(long totalFornecedoresAtivos) { this.totalFornecedoresAtivos = totalFornecedoresAtivos; }
    public List<AtividadeRecenteDTO> getAtividadesRecentes() { return atividadesRecentes; }
    public void setAtividadesRecentes(List<AtividadeRecenteDTO> atividadesRecentes) { this.atividadesRecentes = atividadesRecentes; }
}
