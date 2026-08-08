package j0aod3v.sistemaestoquemercado.service;

import j0aod3v.sistemaestoquemercado.model.Lote;
import j0aod3v.sistemaestoquemercado.repository.LoteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoteService {

    private final LoteRepository loteRepository;

    public LoteService(LoteRepository loteRepository) {
        this.loteRepository = loteRepository;
    }

    public Lote cadastrar(Lote lote) {
        validar(lote);
        Lote existente = loteRepository.findByNumeroLote(lote.getNumeroLote());
        if (existente != null) {
            throw new IllegalArgumentException("Número do lote já cadastrado: " + lote.getNumeroLote());
        }
        return loteRepository.save(lote);
    }

    public Lote buscarPorId(int id) {
        validarId(id);
        return loteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Lote não encontrado para o ID: " + id));
    }

    public List<Lote> listarTodos() {
        return loteRepository.findAll();
    }

    public List<Lote> listarPorProduto(int idProduto) {
        validarId(idProduto);
        return loteRepository.findByIdProduto(idProduto);
    }

    public Lote atualizar(Lote lote) {
        validar(lote);
        validarId(lote.getIdLote());
        Lote existente = loteRepository.findByNumeroLote(lote.getNumeroLote());
        if (existente != null && !existente.getIdLote().equals(lote.getIdLote())) {
            throw new IllegalArgumentException("Número do lote já cadastrado: " + lote.getNumeroLote());
        }
        buscarPorId(lote.getIdLote());
        return loteRepository.save(lote);
    }

    public void excluir(int id) {
        validarId(id);
        loteRepository.deleteById(id);
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