package j0aod3v.sistemaestoquemercado.service;

import j0aod3v.sistemaestoquemercado.model.Recebimento;
import j0aod3v.sistemaestoquemercado.repository.RecebimentoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecebimentoService {

    private final RecebimentoRepository recebimentoRepository;

    public RecebimentoService(RecebimentoRepository recebimentoRepository) {
        this.recebimentoRepository = recebimentoRepository;
    }

    public Recebimento cadastrar(Recebimento recebimento) {
        validar(recebimento);
        return recebimentoRepository.save(recebimento);
    }

    public Recebimento buscarPorId(int id) {
        validarId(id);
        return recebimentoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Recebimento não encontrado para o ID: " + id));
    }

    public List<Recebimento> listarTodos() {
        return recebimentoRepository.findAll();
    }

    public Recebimento atualizar(Recebimento recebimento) {
        validar(recebimento);
        validarId(recebimento.getIdRecebimento());
        buscarPorId(recebimento.getIdRecebimento());
        return recebimentoRepository.save(recebimento);
    }

    public void excluir(int id) {
        validarId(id);
        recebimentoRepository.deleteById(id);
    }

    private void validar(Recebimento recebimento) {
        if (recebimento == null) {
            throw new IllegalArgumentException("Recebimento não pode ser nulo.");
        }
    }

    private void validarId(int id) {
        if (id <= 0) {
            throw new IllegalArgumentException("ID inválido.");
        }
    }
}