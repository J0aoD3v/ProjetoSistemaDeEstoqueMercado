package j0aod3v.sistemaestoquemercado.service;

import j0aod3v.sistemaestoquemercado.dao.FuncionarioDAO;
import j0aod3v.sistemaestoquemercado.model.Funcionario;
import java.sql.SQLException;
import java.util.List;

public class FuncionarioService {
    private final FuncionarioDAO funcionarioDAO;

    public FuncionarioService() {
        this.funcionarioDAO = new FuncionarioDAO();
    }

    public void cadastrar(Funcionario funcionario) throws SQLException {
        validar(funcionario);
        funcionarioDAO.inserir(funcionario);
    }

    public Funcionario buscarPorId(int id) throws SQLException {
        validarId(id);
        return funcionarioDAO.buscarPorId(id);
    }

    public List<Funcionario> listarTodos() throws SQLException {
        return funcionarioDAO.listarTodos();
    }

    public void atualizar(Funcionario funcionario) throws SQLException {
        validar(funcionario);
        validarId(funcionario.getIdFuncionario());
        funcionarioDAO.atualizar(funcionario);
    }

    public void excluir(int id) throws SQLException {
        validarId(id);
        funcionarioDAO.excluir(id);
    }

    private void validar(Funcionario funcionario) {
        if (funcionario == null) {
            throw new IllegalArgumentException("Funcionário não pode ser nulo.");
        }
        if (funcionario.getMatricula() == null || funcionario.getMatricula().isBlank()) {
            throw new IllegalArgumentException("Matrícula é obrigatória.");
        }
        if (funcionario.getNome() == null || funcionario.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }
        if (funcionario.getCargo() == null || funcionario.getCargo().isBlank()) {
            throw new IllegalArgumentException("Cargo é obrigatório.");
        }
    }

    private void validarId(int id) {
        if (id <= 0) {
            throw new IllegalArgumentException("ID inválido.");
        }
    }
}