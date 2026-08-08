package j0aod3v.sistemaestoquemercado.service;

import j0aod3v.sistemaestoquemercado.model.Fornecedor;
import j0aod3v.sistemaestoquemercado.repository.FornecedorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FornecedorService {

    private final FornecedorRepository fornecedorRepository;

    public FornecedorService(FornecedorRepository fornecedorRepository) {
        this.fornecedorRepository = fornecedorRepository;
    }

    public Fornecedor cadastrar(Fornecedor fornecedor) {
        validar(fornecedor);
        Fornecedor existente = fornecedorRepository.findByCnpj(fornecedor.getCnpj());
        if (existente != null) {
            throw new IllegalArgumentException("CNPJ já cadastrado: " + fornecedor.getCnpj());
        }
        return fornecedorRepository.save(fornecedor);
    }

    public Fornecedor buscarPorId(int id) {
        validarId(id);
        return fornecedorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Fornecedor não encontrado para o ID: " + id));
    }

    public List<Fornecedor> listarTodos() {
        return fornecedorRepository.findAll();
    }

    public Fornecedor atualizar(Fornecedor fornecedor) {
        validar(fornecedor);
        validarId(fornecedor.getIdFornecedor());
        Fornecedor existente = fornecedorRepository.findByCnpj(fornecedor.getCnpj());
        if (existente != null && !existente.getIdFornecedor().equals(fornecedor.getIdFornecedor())) {
            throw new IllegalArgumentException("CNPJ já cadastrado: " + fornecedor.getCnpj());
        }
        buscarPorId(fornecedor.getIdFornecedor());
        return fornecedorRepository.save(fornecedor);
    }

    public void excluir(int id) {
        validarId(id);
        fornecedorRepository.deleteById(id);
    }

    private void validar(Fornecedor fornecedor) {
        if (fornecedor == null) {
            throw new IllegalArgumentException("Fornecedor não pode ser nulo.");
        }
        if (fornecedor.getCnpj() == null || fornecedor.getCnpj().isBlank()) {
            throw new IllegalArgumentException("CNPJ é obrigatório.");
        }
        if (fornecedor.getRazaoSocial() == null || fornecedor.getRazaoSocial().isBlank()) {
            throw new IllegalArgumentException("Razão social é obrigatória.");
        }
    }

    private void validarId(int id) {
        if (id <= 0) {
            throw new IllegalArgumentException("ID inválido.");
        }
    }
}