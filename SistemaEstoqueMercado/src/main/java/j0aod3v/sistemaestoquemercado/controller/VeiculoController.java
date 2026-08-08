package j0aod3v.sistemaestoquemercado.controller;

import j0aod3v.sistemaestoquemercado.model.Veiculo;
import j0aod3v.sistemaestoquemercado.service.VeiculoService;
import java.sql.SQLException;
import java.util.List;

public class VeiculoController {
    private final VeiculoService veiculoService;

    public VeiculoController() {
        this.veiculoService = new VeiculoService();
    }

    public void cadastrar(Veiculo veiculo) throws SQLException {
        veiculoService.cadastrar(veiculo);
    }

    public Veiculo buscarPorId(int id) throws SQLException {
        return veiculoService.buscarPorId(id);
    }

    public List<Veiculo> listarTodos() throws SQLException {
        return veiculoService.listarTodos();
    }

    public void atualizar(Veiculo veiculo) throws SQLException {
        veiculoService.atualizar(veiculo);
    }

    public void excluir(int id) throws SQLException {
        veiculoService.excluir(id);
    }
}