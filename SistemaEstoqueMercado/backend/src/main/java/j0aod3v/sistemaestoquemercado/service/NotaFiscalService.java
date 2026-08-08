package j0aod3v.sistemaestoquemercado.service;

import j0aod3v.sistemaestoquemercado.model.NotaFiscal;
import j0aod3v.sistemaestoquemercado.repository.NotaFiscalRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class NotaFiscalService {

    private final NotaFiscalRepository notaFiscalRepository;

    public NotaFiscalService(NotaFiscalRepository notaFiscalRepository) {
        this.notaFiscalRepository = notaFiscalRepository;
    }

    public NotaFiscal cadastrar(NotaFiscal nota) {
        validar(nota);
        return notaFiscalRepository.save(nota);
    }

    public NotaFiscal buscarPorId(int id) {
        validarId(id);
        return notaFiscalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Nota fiscal não encontrada para o ID: " + id));
    }

    public List<NotaFiscal> listarTodos() {
        return notaFiscalRepository.findAll();
    }

    public NotaFiscal atualizar(NotaFiscal nota) {
        validar(nota);
        validarId(nota.getIdNotaFiscal());
        buscarPorId(nota.getIdNotaFiscal());
        return notaFiscalRepository.save(nota);
    }

    public void excluir(int id) {
        validarId(id);
        notaFiscalRepository.deleteById(id);
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