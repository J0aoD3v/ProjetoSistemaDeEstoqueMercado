package j0aod3v.sistemaestoquemercado.service;

import j0aod3v.sistemaestoquemercado.dao.ProdutoDAO;
import j0aod3v.sistemaestoquemercado.model.Produto;

import java.sql.SQLException;
import java.util.List;

public class ProdutoService {

    private final ProdutoDAO produtoDAO;

    public ProdutoService() {
        this.produtoDAO = new ProdutoDAO();
    }

    public void cadastrar(Produto produto) throws SQLException {

        validarProduto(produto);

        produtoDAO.inserir(produto);
    }

    public Produto buscarPorId(int id) throws SQLException {

        if (id <= 0) {
            throw new IllegalArgumentException(
                    "O ID do produto deve ser maior que zero."
            );
        }

        return produtoDAO.buscarPorId(id);
    }

    public List<Produto> listarTodos() throws SQLException {

        return produtoDAO.listarTodos();
    }

    public List<Produto> listarAtivos() throws SQLException {

        return produtoDAO.listarAtivos();
    }

    public void atualizar(Produto produto) throws SQLException {

        validarProduto(produto);

        if (produto.getIdProduto() <= 0) {
            throw new IllegalArgumentException(
                    "O produto precisa ter um ID para ser atualizado."
            );
        }

        produtoDAO.atualizar(produto);
    }

    public void excluir(int id) throws SQLException {

        if (id <= 0) {
            throw new IllegalArgumentException(
                    "O ID do produto deve ser maior que zero."
            );
        }

        produtoDAO.excluir(id);
    }

    private void validarProduto(Produto produto) {

        if (produto == null) {
            throw new IllegalArgumentException(
                    "O produto não pode ser nulo."
            );
        }

        if (produto.getSku() == null ||
                produto.getSku().isBlank()) {

            throw new IllegalArgumentException(
                    "O SKU é obrigatório."
            );
        }

        if (produto.getDescricao() == null ||
                produto.getDescricao().isBlank()) {

            throw new IllegalArgumentException(
                    "A descrição do produto é obrigatória."
            );
        }

        if (produto.getUnidadeMedida() == null ||
                produto.getUnidadeMedida().isBlank()) {

            throw new IllegalArgumentException(
                    "A unidade de medida é obrigatória."
            );
        }
    }
}