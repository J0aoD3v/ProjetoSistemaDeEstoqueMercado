package j0aod3v.sistemaestoquemercado.controller;

import j0aod3v.sistemaestoquemercado.model.Funcionario;
import j0aod3v.sistemaestoquemercado.service.FuncionarioService;

import java.sql.SQLException;
import java.util.List;

public class FuncionarioController {

    private final FuncionarioService funcionarioService;

    public FuncionarioController() {
        this.funcionarioService = new FuncionarioService();
    }

    public void cadastrar(Funcionario funcionario) throws SQLException {
        funcionarioService.cadastrar(funcionario);
    }

    public Funcionario buscarPorId(int id) throws SQLException {
        return funcionarioService.buscarPorId(id);
    }

    public List<Funcionario> listarTodos() throws SQLException {
        return funcionarioService.listarTodos();
    }

    public void atualizar(Funcionario funcionario) throws SQLException {
        funcionarioService.atualizar(funcionario);
    }

    public void excluir(int id) throws SQLException {
        funcionarioService.excluir(id);
    }
}