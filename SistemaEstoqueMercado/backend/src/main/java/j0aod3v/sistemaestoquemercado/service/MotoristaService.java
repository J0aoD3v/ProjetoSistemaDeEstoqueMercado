package j0aod3v.sistemaestoquemercado.service;

import j0aod3v.sistemaestoquemercado.model.Motorista;
import j0aod3v.sistemaestoquemercado.repository.MotoristaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MotoristaService {

    private final MotoristaRepository motoristaRepository;

    public MotoristaService(MotoristaRepository motoristaRepository) {
        this.motoristaRepository = motoristaRepository;
    }

    public Motorista cadastrar(Motorista motorista) {
        validar(motorista);
        return motoristaRepository.save(motorista);
    }

    public Motorista buscarPorId(int id) {
        validarId(id);
        return motoristaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Motorista não encontrado para o ID: " + id));
    }

    public List<Motorista> listarTodos() {
        return motoristaRepository.findAll();
    }

    public Motorista atualizar(Motorista motorista) {
        validar(motorista);
        validarId(motorista.getIdMotorista());
        buscarPorId(motorista.getIdMotorista());
        return motoristaRepository.save(motorista);
    }

    public void excluir(int id) {
        validarId(id);
        motoristaRepository.deleteById(id);
    }

    private void validar(Motorista motorista) {
        if (motorista == null) {
            throw new IllegalArgumentException("Motorista não pode ser nulo.");
        }
        if (motorista.getCpf() == null || motorista.getCpf().isBlank()) {
            throw new IllegalArgumentException("CPF é obrigatório.");
        }
        if (motorista.getNome() == null || motorista.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }
        if (motorista.getCnh() == null || motorista.getCnh().isBlank()) {
            throw new IllegalArgumentException("CNH é obrigatória.");
        }
    }

    private void validarId(int id) {
        if (id <= 0) {
            throw new IllegalArgumentException("ID inválido.");
        }
    }
}