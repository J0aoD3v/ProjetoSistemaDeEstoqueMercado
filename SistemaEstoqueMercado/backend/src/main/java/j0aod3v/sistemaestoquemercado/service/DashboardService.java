package j0aod3v.sistemaestoquemercado.service;

import j0aod3v.sistemaestoquemercado.model.Divergencia;
import j0aod3v.sistemaestoquemercado.model.Recebimento;
import j0aod3v.sistemaestoquemercado.model.dto.AtividadeRecenteDTO;
import j0aod3v.sistemaestoquemercado.model.dto.DashboardDTO;
import j0aod3v.sistemaestoquemercado.repository.DivergenciaRepository;
import j0aod3v.sistemaestoquemercado.repository.FornecedorRepository;
import j0aod3v.sistemaestoquemercado.repository.ProdutoRepository;
import j0aod3v.sistemaestoquemercado.repository.RecebimentoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final ProdutoRepository produtoRepository;
    private final RecebimentoRepository recebimentoRepository;
    private final DivergenciaRepository divergenciaRepository;
    private final FornecedorRepository fornecedorRepository;

    public DashboardService(ProdutoRepository produtoRepository, RecebimentoRepository recebimentoRepository, DivergenciaRepository divergenciaRepository, FornecedorRepository fornecedorRepository) {
        this.produtoRepository = produtoRepository;
        this.recebimentoRepository = recebimentoRepository;
        this.divergenciaRepository = divergenciaRepository;
        this.fornecedorRepository = fornecedorRepository;
    }

    public DashboardDTO obterDadosDashboard() {
        long totalProdutosAtivos = produtoRepository.countByStatusAtivoTrue();
        long totalFornecedoresAtivos = fornecedorRepository.count();

        LocalDateTime inicioDoDia = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime fimDoDia = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59).withNano(999999999);
        long totalRecebimentosHoje = recebimentoRepository.countByDataHoraChegadaBetween(inicioDoDia, fimDoDia);

        long totalDivergenciasAbertas = divergenciaRepository.count();

        List<AtividadeRecenteDTO> atividadesRecentes = recebimentoRepository.findTop5ByOrderByDataHoraChegadaDesc()
                .stream()
                .map(this::converterParaAtividadeRecente)
                .collect(Collectors.toList());

        return new DashboardDTO(totalProdutosAtivos, totalRecebimentosHoje, totalDivergenciasAbertas, totalFornecedoresAtivos, atividadesRecentes);
    }

    private AtividadeRecenteDTO converterParaAtividadeRecente(Recebimento recebimento) {
        String titulo = "Recebimento #" + recebimento.getIdRecebimento();
        String dataHora = recebimento.getDataHoraChegada() != null
                ? recebimento.getDataHoraChegada().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                : "Sem data";
        String status = recebimento.getStatusRecebimento() != null ? recebimento.getStatusRecebimento() : "Desconhecido";
        String corStatus = mapearCorStatus(status);

        return new AtividadeRecenteDTO(recebimento.getIdRecebimento(), "recebimento", titulo, dataHora, status, corStatus);
    }

    private String mapearCorStatus(String status) {
        if (status == null) return "text-muted";
        String lower = status.toLowerCase();
        if (lower.contains("concluído") || lower.contains("concluido")) return "text-accent";
        if (lower.contains("análise") || lower.contains("analise") || lower.contains("andamento")) return "text-warning";
        if (lower.contains("agendado")) return "text-blue-500";
        if (lower.contains("pendente")) return "text-warning";
        return "text-muted";
    }
}
