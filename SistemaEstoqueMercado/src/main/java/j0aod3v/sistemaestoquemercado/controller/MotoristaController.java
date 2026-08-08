package j0aod3v.sistemaestoquemercado.controller;

import j0aod3v.sistemaestoquemercado.model.Motorista;
import j0aod3v.sistemaestoquemercado.service.MotoristaService;
import java.sql.SQLException;
import java.util.List;

public class MotoristaController {
    private final MotoristaService motoristaService;

    public MotoristaController() {
        this.motoristaService = new MotoristaService();
    }

    public void cadastrar(Motorista motorista) throws SQLException {
        motoristaService.cadastrar(motorista);
    }

    public Motorista buscarPorId(int id) throws SQLException {
        return motoristaService.buscarPorId(id);
    }

    public List<Motorista> listarTodos() throws SQLException {
        return motoristaService.listarTodos();
    }

    public void atualizar(Motorista motorista) throws SQLException {
        motoristaService.atualizar(motorista);
    }

    public void excluir(int id) throws SQLException {
        motoristaService.excluir(id);
    }
}