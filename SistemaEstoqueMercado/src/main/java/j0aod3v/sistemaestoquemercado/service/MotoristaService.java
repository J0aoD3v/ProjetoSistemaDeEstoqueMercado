package j0aod3v.sistemaestoquemercado.service;

import j0aod3v.sistemaestoquemercado.dao.MotoristaDAO;
import j0aod3v.sistemaestoquemercado.model.Motorista;
import java.sql.SQLException;
import java.util.List;

public class MotoristaService {
    private final MotoristaDAO motoristaDAO;

    public MotoristaService() {
        this.motoristaDAO = new MotoristaDAO();
    }

    public void cadastrar(Motorista motorista) throws SQLException {
        validar(motorista);
        motoristaDAO.inserir(motorista);
    }

    public Motorista buscarPorId(int id) throws SQLException {
        validarId(id);
        return motoristaDAO.buscarPorId(id);
    }

    public List<Motorista> listarTodos() throws SQLException {
        return motoristaDAO.listarTodos();
    }

    public void atualizar(Motorista motorista) throws SQLException {
        validar(motorista);
        validarId(motorista.getIdMotorista());
        motoristaDAO.atualizar(motorista);
    }

    public void excluir(int id) throws SQLException {
        validarId(id);
        motoristaDAO.excluir(id);
    }

    private void validar(Motorista motorista) {
        if (motorista == null) {
            throw new IllegalArgumentException("Motorista não pode ser nulo.");
        }
        if (motorista.getCpf() == null || motorista.getCpf().isBlank()) {
            throw new IllegalArgumentException("CPF é obrigatório.");
        }
        if (motorista.getNome() == null || motorista.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }
        if (motorista.getCnh() == null || motorista.getCnh().isBlank()) {
            throw new IllegalArgumentException("CNH é obrigatória.");
        }
    }

    private void validarId(int id) {
        if (id <= 0) {
            throw new IllegalArgumentException("ID inválido.");
        }
    }
}