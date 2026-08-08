package j0aod3v.sistemaestoquemercado.service;

import j0aod3v.sistemaestoquemercado.dao.FornecedorDAO;
import j0aod3v.sistemaestoquemercado.model.Fornecedor;
import java.sql.SQLException;
import java.util.List;

public class FornecedorService {
    private final FornecedorDAO fornecedorDAO;

    public FornecedorService() {
        this.fornecedorDAO = new FornecedorDAO();
    }

    public void cadastrar(Fornecedor fornecedor) throws SQLException {
        validar(fornecedor);
        fornecedorDAO.inserir(fornecedor);
    }

    public Fornecedor buscarPorId(int id) throws SQLException {
        validarId(id);
        return fornecedorDAO.buscarPorId(id);
    }

    public List<Fornecedor> listarTodos() throws SQLException {
        return fornecedorDAO.listarTodos();
    }

    public void atualizar(Fornecedor fornecedor) throws SQLException {
        validar(fornecedor);
        validarId(fornecedor.getIdFornecedor());
        fornecedorDAO.atualizar(fornecedor);
    }

    public void excluir(int id) throws SQLException {
        validarId(id);
        fornecedorDAO.excluir(id);
    }

    private void validar(Fornecedor fornecedor) {
        if (fornecedor == null) {
            throw new IllegalArgumentException("Fornecedor não pode ser nulo.");
        }
        if (fornecedor.getCnpj() == null || fornecedor.getCnpj().isBlank()) {
            throw new IllegalArgumentException("CNPJ é obrigatório.");
        }
        if (fornecedor.getRazaoSocial() == null || fornecedor.getRazaoSocial().isBlank()) {
            throw new IllegalArgumentException("Razão social é obrigatória.");
        }
    }

    private void validarId(int id) {
        if (id <= 0) {
            throw new IllegalArgumentException("ID inválido.");
        }
    }
}