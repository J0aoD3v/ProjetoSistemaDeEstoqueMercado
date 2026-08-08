package j0aod3v.sistemaestoquemercado.controller;

import j0aod3v.sistemaestoquemercado.model.Lote;
import j0aod3v.sistemaestoquemercado.service.LoteService;

import java.sql.SQLException;
import java.util.List;

public class LoteController {

    private final LoteService loteService;

    public LoteController() {
        this.loteService = new LoteService();
    }

    public void cadastrar(Lote lote) throws SQLException {
        loteService.cadastrar(lote);
    }

    public Lote buscarPorId(int id) throws SQLException {
        return loteService.buscarPorId(id);
    }

    public List<Lote> listarTodos() throws SQLException {
        return loteService.listarTodos();
    }

    public List<Lote> listarPorProduto(int idProduto) throws SQLException {
        return loteService.listarPorProduto(idProduto);
    }

    public void atualizar(Lote lote) throws SQLException {
        loteService.atualizar(lote);
    }

    public void excluir(int id) throws SQLException {
        loteService.excluir(id);
    }
}