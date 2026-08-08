package j0aod3v.sistemaestoquemercado.controller;

import j0aod3v.sistemaestoquemercado.model.NotaFiscal;
import j0aod3v.sistemaestoquemercado.service.NotaFiscalService;
import java.sql.SQLException;
import java.util.List;

public class NotaFiscalController {
    private final NotaFiscalService notaFiscalService;

    public NotaFiscalController() {
        this.notaFiscalService = new NotaFiscalService();
    }

    public void cadastrar(NotaFiscal notaFiscal) throws SQLException {
        notaFiscalService.cadastrar(notaFiscal);
    }

    public NotaFiscal buscarPorId(int id) throws SQLException {
        return notaFiscalService.buscarPorId(id);
    }

    public List<NotaFiscal> listarTodos() throws SQLException {
        return notaFiscalService.listarTodos();
    }

    public void atualizar(NotaFiscal notaFiscal) throws SQLException {
        notaFiscalService.atualizar(notaFiscal);
    }

    public void excluir(int id) throws SQLException {
        notaFiscalService.excluir(id);
    }
}