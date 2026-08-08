package j0aod3v.sistemaestoquemercado.service;

import j0aod3v.sistemaestoquemercado.dao.VeiculoDAO;
import j0aod3v.sistemaestoquemercado.model.Veiculo;

import java.sql.SQLException;
import java.util.List;

public class VeiculoService {

    private final VeiculoDAO veiculoDAO;

    public VeiculoService() {
        this.veiculoDAO = new VeiculoDAO();
    }

    public void cadastrar(Veiculo veiculo) throws SQLException {
        validar(veiculo);
        veiculoDAO.inserir(veiculo);
    }

    public Veiculo buscarPorId(int id) throws SQLException {
        validarId(id);
        return veiculoDAO.buscarPorId(id);
    }

    public List<Veiculo> listarTodos() throws SQLException {
        return veiculoDAO.listarTodos();
    }

    public void atualizar(Veiculo veiculo) throws SQLException {
        validar(veiculo);
        validarId(veiculo.getIdVeiculo());
        veiculoDAO.atualizar(veiculo);
    }

    public void excluir(int id) throws SQLException {
        validarId(id);
        veiculoDAO.excluir(id);
    }

    private void validar(Veiculo veiculo) {
        if (veiculo == null) {
            throw new IllegalArgumentException("Veículo não pode ser nulo.");
        }

        if (veiculo.getPlaca() == null || veiculo.getPlaca().isBlank()) {
            throw new IllegalArgumentException("Placa é obrigatória.");
        }

        if (veiculo.getTipoVeiculo() == null ||
                veiculo.getTipoVeiculo().isBlank()) {
            throw new IllegalArgumentException("Tipo do veículo é obrigatório.");
        }
    }

    private void validarId(int id) {
        if (id <= 0) {
            throw new IllegalArgumentException("ID inválido.");
        }
    }
}