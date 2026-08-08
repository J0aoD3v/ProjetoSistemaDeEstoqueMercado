package j0aod3v.sistemaestoquemercado.service;

import j0aod3v.sistemaestoquemercado.model.ItemRecebimento;
import j0aod3v.sistemaestoquemercado.repository.ItemRecebimentoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ItemRecebimentoService {

    private final ItemRecebimentoRepository itemRecebimentoRepository;

    public ItemRecebimentoService(ItemRecebimentoRepository itemRecebimentoRepository) {
        this.itemRecebimentoRepository = itemRecebimentoRepository;
    }

    public ItemRecebimento cadastrar(ItemRecebimento item) {
        validar(item);
        return itemRecebimentoRepository.save(item);
    }

    public ItemRecebimento buscarPorId(int id) {
        validarId(id);
        return itemRecebimentoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Item de recebimento não encontrado para o ID: " + id));
    }

    public List<ItemRecebimento> listarTodos() {
        return itemRecebimentoRepository.findAll();
    }

    public List<ItemRecebimento> listarPorRecebimento(int idRecebimento) {
        validarId(idRecebimento);
        return itemRecebimentoRepository.findByIdRecebimento(idRecebimento);
    }

    public ItemRecebimento atualizar(ItemRecebimento item) {
        validar(item);
        validarId(item.getIdItemRecebimento());
        buscarPorId(item.getIdItemRecebimento());
        return itemRecebimentoRepository.save(item);
    }

    public void excluir(int id) {
        validarId(id);
        itemRecebimentoRepository.deleteById(id);
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