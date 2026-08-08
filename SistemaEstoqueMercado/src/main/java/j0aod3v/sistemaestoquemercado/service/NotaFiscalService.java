package j0aod3v.sistemaestoquemercado.service;

import j0aod3v.sistemaestoquemercado.dao.NotaFiscalDAO;
import j0aod3v.sistemaestoquemercado.model.NotaFiscal;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.List;

public class NotaFiscalService {
    private final NotaFiscalDAO notaFiscalDAO;

    public NotaFiscalService() {
        this.notaFiscalDAO = new NotaFiscalDAO();
    }

    public void cadastrar(NotaFiscal nota) throws SQLException {
        validar(nota);
        notaFiscalDAO.inserir(nota);
    }

    public NotaFiscal buscarPorId(int id) throws SQLException {
        validarId(id);
        return notaFiscalDAO.buscarPorId(id);
    }

    public List<NotaFiscal> listarTodos() throws SQLException {
        return notaFiscalDAO.listarTodos();
    }

    public void atualizar(NotaFiscal nota) throws SQLException {
        validar(nota);
        validarId(nota.getIdNotaFiscal());
        notaFiscalDAO.atualizar(nota);
    }

    public void excluir(int id) throws SQLException {
        validarId(id);
        notaFiscalDAO.excluir(id);
    }

    private void validar(NotaFiscal nota) {
        if (nota == null) {
            throw new IllegalArgumentException("Nota fiscal não pode ser nula.");
        }
        if (nota.getNumeroNf() == null || nota.getNumeroNf().isBlank()) {
            throw new IllegalArgumentException("Número da NF é obrigatório.");
        }
        if (nota.getSerie() == null || nota.getSerie().isBlank()) {
            throw new IllegalArgumentException("Série é obrigatória.");
        }
        if (nota.getDataEmissao() == null) {
            throw new IllegalArgumentException("Data de emissão é obrigatória.");
        }
        if (nota.getValorTotal() == null || nota.getValorTotal().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Valor total deve ser maior ou igual a zero.");
        }
        validarId(nota.getIdFornecedor());
    }

    private void validarId(int id) {
        if (id <= 0) {
            throw new IllegalArgumentException("ID inválido.");
        }
    }
}