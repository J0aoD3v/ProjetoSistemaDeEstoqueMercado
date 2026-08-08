package j0aod3v.sistemaestoquemercado.controller;

import j0aod3v.sistemaestoquemercado.model.Fornecedor;
import j0aod3v.sistemaestoquemercado.service.FornecedorService;
import java.sql.SQLException;
import java.util.List;

public class FornecedorController {
    private final FornecedorService fornecedorService;

    public FornecedorController() {
        this.fornecedorService = new FornecedorService();
    }

    public void cadastrar(Fornecedor fornecedor) throws SQLException {
        fornecedorService.cadastrar(fornecedor);
    }

    public Fornecedor buscarPorId(int id) throws SQLException {
        return fornecedorService.buscarPorId(id);
    }

    public List<Fornecedor> listarTodos() throws SQLException {
        return fornecedorService.listarTodos();
    }

    public void atualizar(Fornecedor fornecedor) throws SQLException {
        fornecedorService.atualizar(fornecedor);
    }

    public void excluir(int id) throws SQLException {
        fornecedorService.excluir(id);
    }
}