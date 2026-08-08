package j0aod3v.sistemaestoquemercado.service;

import j0aod3v.sistemaestoquemercado.dao.DivergenciaDAO;
import j0aod3v.sistemaestoquemercado.model.Divergencia;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.List;

public class DivergenciaService {
    private final DivergenciaDAO divergenciaDAO;

    public DivergenciaService() {
        this.divergenciaDAO = new DivergenciaDAO();
    }

    public void cadastrar(Divergencia divergencia) throws SQLException {
        validar(divergencia);
        divergenciaDAO.inserir(divergencia);
    }

    public Divergencia buscarPorId(int id) throws SQLException {
        validarId(id);
        return divergenciaDAO.buscarPorId(id);
    }

    public List<Divergencia> listarTodos() throws SQLException {
        return divergenciaDAO.listarTodos();
    }

    public List<Divergencia> listarPorItemRecebimento(int idItemRecebimento) throws SQLException {
        validarId(idItemRecebimento);
        return divergenciaDAO.listarPorItemRecebimento(idItemRecebimento);
    }

    public void atualizar(Divergencia divergencia) throws SQLException {
        validar(divergencia);
        validarId(divergencia.getIdDivergencia());
        divergenciaDAO.atualizar(divergencia);
    }

    public void excluir(int id) throws SQLException {
        validarId(id);
        divergenciaDAO.excluir(id);
    }

    private void validar(Divergencia divergencia) {
        if (divergencia == null) {
            throw new IllegalArgumentException("Divergência não pode ser nula.");
        }
        if (divergencia.getTipoDivergencia() == null || divergencia.getTipoDivergencia().isBlank()) {
            throw new IllegalArgumentException("Tipo da divergência é obrigatório.");
        }
        if (divergencia.getQuantidadeDivergente() == null) {
            throw new IllegalArgumentException("Quantidade divergente é obrigatória.");
        }
        if (divergencia.getQuantidadeDivergente().compareTo(BigDecimal.ZERO) == 0) {
            throw new IllegalArgumentException("A quantidade divergente não pode ser zero.");
        }
        validarId(divergencia.getIdItemRecebimento());
    }

    private void validarId(int id) {
        if (id <= 0) {
            throw new IllegalArgumentException("ID inválido.");
        }
    }
}