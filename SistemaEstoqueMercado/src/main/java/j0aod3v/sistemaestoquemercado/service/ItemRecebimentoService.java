package j0aod3v.sistemaestoquemercado.service;

import j0aod3v.sistemaestoquemercado.dao.ItemRecebimentoDAO;
import j0aod3v.sistemaestoquemercado.model.ItemRecebimento;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.List;

public class ItemRecebimentoService {
    private final ItemRecebimentoDAO itemRecebimentoDAO;

    public ItemRecebimentoService() {
        this.itemRecebimentoDAO = new ItemRecebimentoDAO();
    }

    public void cadastrar(ItemRecebimento item) throws SQLException {
        validar(item);
        itemRecebimentoDAO.inserir(item);
    }

    public ItemRecebimento buscarPorId(int id) throws SQLException {
        validarId(id);
        return itemRecebimentoDAO.buscarPorId(id);
    }

    public List<ItemRecebimento> listarTodos() throws SQLException {
        return itemRecebimentoDAO.listarTodos();
    }

    public List<ItemRecebimento> listarPorRecebimento(int idRecebimento) throws SQLException {
        validarId(idRecebimento);
        return itemRecebimentoDAO.listarPorRecebimento(idRecebimento);
    }

    public void atualizar(ItemRecebimento item) throws SQLException {
        validar(item);
        validarId(item.getIdItemRecebimento());
        itemRecebimentoDAO.atualizar(item);
    }

    public void excluir(int id) throws SQLException {
        validarId(id);
        itemRecebimentoDAO.excluir(id);
    }

    public BigDecimal calcularDivergencia(ItemRecebimento item) {
        if (item == null) {
            throw new IllegalArgumentException("Item de recebimento não pode ser nulo.");
        }
        if (item.getQuantidadeDeclarada() == null || item.getQuantidadeConferida() == null) {
            throw new IllegalArgumentException("As quantidades são obrigatórias.");
        }
        return item.getQuantidadeConferida().subtract(item.getQuantidadeDeclarada());
    }

    private void validar(ItemRecebimento item) {
        if (item == null) {
            throw new IllegalArgumentException("Item de recebimento não pode ser nulo.");
        }
        if (item.getQuantidadeDeclarada() == null || item.getQuantidadeDeclarada().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Quantidade declarada inválida.");
        }
        if (item.getQuantidadeConferida() == null || item.getQuantidadeConferida().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Quantidade conferida inválida.");
        }
        validarId(item.getIdRecebimento());
        validarId(item.getIdLote());
        validarId(item.getIdLocalizacao());
    }

    private void validarId(int id) {
        if (id <= 0) {
            throw new IllegalArgumentException("ID inválido.");
        }
    }
}