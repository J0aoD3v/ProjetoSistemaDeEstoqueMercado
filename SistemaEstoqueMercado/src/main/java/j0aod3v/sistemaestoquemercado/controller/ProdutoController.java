package j0aod3v.sistemaestoquemercado.controller;

import j0aod3v.sistemaestoquemercado.model.Produto;
import j0aod3v.sistemaestoquemercado.service.ProdutoService;
import java.sql.SQLException;
import java.util.List;

public class ProdutoController {
    private final ProdutoService produtoService;

    public ProdutoController() {
        this.produtoService = new ProdutoService();
    }

    public void cadastrar(Produto produto) throws SQLException {
        produtoService.cadastrar(produto);
    }

    public Produto buscarPorId(int id) throws SQLException {
        return produtoService.buscarPorId(id);
    }

    public List<Produto> listarTodos() throws SQLException {
        return produtoService.listarTodos();
    }

    public List<Produto> listarAtivos() throws SQLException {
        return produtoService.listarAtivos();
    }

    public void atualizar(Produto produto) throws SQLException {
        produtoService.atualizar(produto);
    }

    public void excluir(int id) throws SQLException {
        produtoService.excluir(id);
    }
}