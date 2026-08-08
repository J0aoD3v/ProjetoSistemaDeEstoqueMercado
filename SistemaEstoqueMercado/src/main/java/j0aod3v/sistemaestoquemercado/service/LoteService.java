package j0aod3v.sistemaestoquemercado.service;

import j0aod3v.sistemaestoquemercado.dao.LoteDAO;
import j0aod3v.sistemaestoquemercado.model.Lote;
import java.sql.SQLException;
import java.util.List;

public class LoteService {
    private final LoteDAO loteDAO;

    public LoteService() {
        this.loteDAO = new LoteDAO();
    }

    public void cadastrar(Lote lote) throws SQLException {
        validar(lote);
        loteDAO.inserir(lote);
    }

    public Lote buscarPorId(int id) throws SQLException {
        validarId(id);
        return loteDAO.buscarPorId(id);
    }

    public List<Lote> listarTodos() throws SQLException {
        return loteDAO.listarTodos();
    }

    public List<Lote> listarPorProduto(int idProduto) throws SQLException {
        validarId(idProduto);
        return loteDAO.listarPorProduto(idProduto);
    }

    public void atualizar(Lote lote) throws SQLException {
        validar(lote);
        validarId(lote.getIdLote());
        loteDAO.atualizar(lote);
    }

    public void excluir(int id) throws SQLException {
        validarId(id);
        loteDAO.excluir(id);
    }

    private void validar(Lote lote) {
        if (lote == null) {
            throw new IllegalArgumentException("Lote não pode ser nulo.");
        }
        if (lote.getNumeroLote() == null || lote.getNumeroLote().isBlank()) {
            throw new IllegalArgumentException("Número do lote é obrigatório.");
        }
        validarId(lote.getIdProduto());
        if (lote.getDataFabricacao() == null) {
            throw new IllegalArgumentException("Data de fabricação é obrigatória.");
        }
        if (lote.getDataValidade() == null) {
            throw new IllegalArgumentException("Data de validade é obrigatória.");
        }
        if (lote.getDataValidade().isBefore(lote.getDataFabricacao())) {
            throw new IllegalArgumentException("Data de validade não pode ser anterior à fabricação.");
        }
    }

    private void validarId(int id) {
        if (id <= 0) {
            throw new IllegalArgumentException("ID inválido.");
        }
    }
}