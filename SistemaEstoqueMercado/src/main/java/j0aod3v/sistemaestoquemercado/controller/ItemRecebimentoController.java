package j0aod3v.sistemaestoquemercado.controller;

import j0aod3v.sistemaestoquemercado.model.ItemRecebimento;
import j0aod3v.sistemaestoquemercado.service.ItemRecebimentoService;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.List;

public class ItemRecebimentoController {
    private final ItemRecebimentoService itemRecebimentoService;

    public ItemRecebimentoController() {
        this.itemRecebimentoService = new ItemRecebimentoService();
    }

    public void cadastrar(ItemRecebimento item) throws SQLException {
        itemRecebimentoService.cadastrar(item);
    }

    public ItemRecebimento buscarPorId(int id) throws SQLException {
        return itemRecebimentoService.buscarPorId(id);
    }

    public List<ItemRecebimento> listarTodos() throws SQLException {
        return itemRecebimentoService.listarTodos();
    }

    public List<ItemRecebimento> listarPorRecebimento(int idRecebimento) throws SQLException {
        return itemRecebimentoService.listarPorRecebimento(idRecebimento);
    }

    public void atualizar(ItemRecebimento item) throws SQLException {
        itemRecebimentoService.atualizar(item);
    }

    public void excluir(int id) throws SQLException {
        itemRecebimentoService.excluir(id);
    }

    public BigDecimal calcularDivergencia(ItemRecebimento item) {
        return itemRecebimentoService.calcularDivergencia(item);
    }
}