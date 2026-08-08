package j0aod3v.sistemaestoquemercado.service;

import j0aod3v.sistemaestoquemercado.dao.RecebimentoDAO;
import j0aod3v.sistemaestoquemercado.model.Recebimento;

import java.sql.SQLException;
import java.util.List;

public class RecebimentoService {

    private final RecebimentoDAO recebimentoDAO;

    public RecebimentoService() {
        this.recebimentoDAO = new RecebimentoDAO();
    }

    public void cadastrar(Recebimento recebimento) throws SQLException {
        validar(recebimento);
        recebimentoDAO.inserir(recebimento);
    }

    public Recebimento buscarPorId(int id) throws SQLException {
        validarId(id);
        return recebimentoDAO.buscarPorId(id);
    }

    public List<Recebimento> listarTodos() throws SQLException {
        return recebimentoDAO.listarTodos();
    }

    public void atualizar(Recebimento recebimento) throws SQLException {
        validar(recebimento);
        validarId(recebimento.getIdRecebimento());
        recebimentoDAO.atualizar(recebimento);
    }

    public void excluir(int id) throws SQLException {
        validarId(id);
        recebimentoDAO.excluir(id);
    }

    public void iniciarConferencia(Recebimento recebimento) {
        if (recebimento == null) {
            throw new IllegalArgumentException(
                    "Recebimento não pode ser nulo."
            );
        }

        if (recebimento.getDataHoraInicioConferencia() != null) {
            throw new IllegalArgumentException(
                    "A conferência já foi iniciada."
            );
        }

        recebimento.setDataHoraInicioConferencia(
                java.time.LocalDateTime.now()
        );

        recebimento.setStatusRecebimento("EM_CONFERENCIA");
    }

    public void finalizarConferencia(Recebimento recebimento) {
        if (recebimento == null) {
            throw new IllegalArgumentException(
                    "Recebimento não pode ser nulo."
            );
        }

        if (recebimento.getDataHoraInicioConferencia() == null) {
            throw new IllegalArgumentException(
                    "A conferência ainda não foi iniciada."
            );
        }

        if (recebimento.getDataHoraFimConferencia() != null) {
            throw new IllegalArgumentException(
                    "A conferência já foi finalizada."
            );
        }

        recebimento.setDataHoraFimConferencia(
                java.time.LocalDateTime.now()
        );

        recebimento.setStatusRecebimento("CONFERIDO");
    }

    private void validar(Recebimento recebimento) {
        if (recebimento == null) {
            throw new IllegalArgumentException(
                    "Recebimento não pode ser nulo."
            );
        }

        if (recebimento.getDataHoraChegada() == null) {
            throw new IllegalArgumentException(
                    "Data e hora de chegada são obrigatórias."
            );
        }

        if (recebimento.getStatusRecebimento() == null ||
                recebimento.getStatusRecebimento().isBlank()) {
            throw new IllegalArgumentException(
                    "Status do recebimento é obrigatório."
            );
        }

        validarId(recebimento.getIdNotaFiscal());
        validarId(recebimento.getIdFuncionario());
        validarId(recebimento.getIdMotorista());
        validarId(recebimento.getIdVeiculo());
    }

    private void validarId(int id) {
        if (id <= 0) {
            throw new IllegalArgumentException("ID inválido.");
        }
    }
}