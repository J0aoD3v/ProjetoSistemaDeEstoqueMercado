package j0aod3v.sistemaestoquemercado.controller;

import j0aod3v.sistemaestoquemercado.model.Localizacao;
import j0aod3v.sistemaestoquemercado.service.LocalizacaoService;
import java.sql.SQLException;
import java.util.List;

public class LocalizacaoController {
    private final LocalizacaoService localizacaoService;

    public LocalizacaoController() {
        this.localizacaoService = new LocalizacaoService();
    }

    public void cadastrar(Localizacao localizacao) throws SQLException {
        localizacaoService.cadastrar(localizacao);
    }

    public Localizacao buscarPorId(int id) throws SQLException {
        return localizacaoService.buscarPorId(id);
    }

    public List<Localizacao> listarTodos() throws SQLException {
        return localizacaoService.listarTodos();
    }

    public void atualizar(Localizacao localizacao) throws SQLException {
        localizacaoService.atualizar(localizacao);
    }

    public void excluir(int id) throws SQLException {
        localizacaoService.excluir(id);
    }
}