package j0aod3v.sistemaestoquemercado.controller;

import j0aod3v.sistemaestoquemercado.model.Recebimento;
import j0aod3v.sistemaestoquemercado.service.RecebimentoService;
import java.sql.SQLException;
import java.util.List;

public class RecebimentoController {
    private final RecebimentoService recebimentoService;

    public RecebimentoController() {
        this.recebimentoService = new RecebimentoService();
    }

    public void cadastrar(Recebimento recebimento) throws SQLException {
        recebimentoService.cadastrar(recebimento);
    }

    public Recebimento buscarPorId(int id) throws SQLException {
        return recebimentoService.buscarPorId(id);
    }

    public List<Recebimento> listarTodos() throws SQLException {
        return recebimentoService.listarTodos();
    }

    public void atualizar(Recebimento recebimento) throws SQLException {
        recebimentoService.atualizar(recebimento);
    }

    public void excluir(int id) throws SQLException {
        recebimentoService.excluir(id);
    }

    public void iniciarConferencia(Recebimento recebimento) {
        recebimentoService.iniciarConferencia(recebimento);
    }

    public void finalizarConferencia(Recebimento recebimento) {
        recebimentoService.finalizarConferencia(recebimento);
    }
}