package j0aod3v.sistemaestoquemercado.service;

import j0aod3v.sistemaestoquemercado.model.Divergencia;
import j0aod3v.sistemaestoquemercado.repository.DivergenciaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class DivergenciaService {

    private final DivergenciaRepository divergenciaRepository;

    public DivergenciaService(DivergenciaRepository divergenciaRepository) {
        this.divergenciaRepository = divergenciaRepository;
    }

    public Divergencia cadastrar(Divergencia divergencia) {
        validar(divergencia);
        return divergenciaRepository.save(divergencia);
    }

    public Divergencia buscarPorId(int id) {
        validarId(id);
        return divergenciaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Divergência não encontrada para o ID: " + id));
    }

    public List<Divergencia> listarTodos() {
        return divergenciaRepository.findAll();
    }

    public List<Divergencia> listarPorItemRecebimento(int idItemRecebimento) {
        validarId(idItemRecebimento);
        return divergenciaRepository.findByIdItemRecebimento(idItemRecebimento);
    }

    public Divergencia atualizar(Divergencia divergencia) {
        validar(divergencia);
        validarId(divergencia.getIdDivergencia());
        buscarPorId(divergencia.getIdDivergencia()); // Garante que existe antes de atualizar
        return divergenciaRepository.save(divergencia);
    }

    public void excluir(int id) {
        validarId(id);
        divergenciaRepository.deleteById(id);
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