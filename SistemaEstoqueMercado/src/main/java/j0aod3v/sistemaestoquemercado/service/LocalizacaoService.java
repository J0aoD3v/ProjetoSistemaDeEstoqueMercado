package j0aod3v.sistemaestoquemercado.service;

import j0aod3v.sistemaestoquemercado.dao.LocalizacaoDAO;
import j0aod3v.sistemaestoquemercado.model.Localizacao;
import java.sql.SQLException;
import java.util.List;

public class LocalizacaoService {
    private final LocalizacaoDAO localizacaoDAO;

    public LocalizacaoService() {
        this.localizacaoDAO = new LocalizacaoDAO();
    }

    public void cadastrar(Localizacao localizacao) throws SQLException {
        validar(localizacao);
        localizacaoDAO.inserir(localizacao);
    }

    public Localizacao buscarPorId(int id) throws SQLException {
        validarId(id);
        return localizacaoDAO.buscarPorId(id);
    }

    public List<Localizacao> listarTodos() throws SQLException {
        return localizacaoDAO.listarTodos();
    }

    public void atualizar(Localizacao localizacao) throws SQLException {
        validar(localizacao);
        validarId(localizacao.getIdLocalizacao());
        localizacaoDAO.atualizar(localizacao);
    }

    public void excluir(int id) throws SQLException {
        validarId(id);
        localizacaoDAO.excluir(id);
    }

    private void validar(Localizacao localizacao) {
        if (localizacao == null) {
            throw new IllegalArgumentException("Localização não pode ser nula.");
        }
        if (localizacao.getCodigoPosicao() == null || localizacao.getCodigoPosicao().isBlank()) {
            throw new IllegalArgumentException("Código da posição é obrigatório.");
        }
        if (localizacao.getTipoArmazenamento() == null || localizacao.getTipoArmazenamento().isBlank()) {
            throw new IllegalArgumentException("Tipo de armazenamento é obrigatório.");
        }
    }

    private void validarId(int id) {
        if (id <= 0) {
            throw new IllegalArgumentException("ID inválido.");
        }
    }
}