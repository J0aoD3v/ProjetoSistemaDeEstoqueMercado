package j0aod3v.sistemaestoquemercado.controller;

import j0aod3v.sistemaestoquemercado.model.Divergencia;
import j0aod3v.sistemaestoquemercado.service.DivergenciaService;
import java.sql.SQLException;
import java.util.List;

public class DivergenciaController {
    private final DivergenciaService divergenciaService;

    public DivergenciaController() {
        this.divergenciaService = new DivergenciaService();
    }

    public void cadastrar(Divergencia divergencia) throws SQLException {
        divergenciaService.cadastrar(divergencia);
    }

    public Divergencia buscarPorId(int id) throws SQLException {
        return divergenciaService.buscarPorId(id);
    }

    public List<Divergencia> listarTodos() throws SQLException {
        return divergenciaService.listarTodos();
    }

    public List<Divergencia> listarPorItemRecebimento(int idItemRecebimento) throws SQLException {
        return divergenciaService.listarPorItemRecebimento(idItemRecebimento);
    }

    public void atualizar(Divergencia divergencia) throws SQLException {
        divergenciaService.atualizar(divergencia);
    }

    public void excluir(int id) throws SQLException {
        divergenciaService.excluir(id);
    }
}