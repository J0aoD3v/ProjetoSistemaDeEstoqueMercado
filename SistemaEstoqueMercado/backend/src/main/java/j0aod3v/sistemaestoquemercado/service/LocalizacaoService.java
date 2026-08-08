package j0aod3v.sistemaestoquemercado.service;

import j0aod3v.sistemaestoquemercado.model.Localizacao;
import j0aod3v.sistemaestoquemercado.repository.LocalizacaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocalizacaoService {

    private final LocalizacaoRepository localizacaoRepository;

    public LocalizacaoService(LocalizacaoRepository localizacaoRepository) {
        this.localizacaoRepository = localizacaoRepository;
    }

    public Localizacao cadastrar(Localizacao localizacao) {
        validar(localizacao);
        return localizacaoRepository.save(localizacao);
    }

    public Localizacao buscarPorId(int id) {
        validarId(id);
        return localizacaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Localização não encontrada para o ID: " + id));
    }

    public List<Localizacao> listarTodos() {
        return localizacaoRepository.findAll();
    }

    public Localizacao atualizar(Localizacao localizacao) {
        validar(localizacao);
        validarId(localizacao.getIdLocalizacao());
        buscarPorId(localizacao.getIdLocalizacao());
        return localizacaoRepository.save(localizacao);
    }

    public void excluir(int id) {
        validarId(id);
        localizacaoRepository.deleteById(id);
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