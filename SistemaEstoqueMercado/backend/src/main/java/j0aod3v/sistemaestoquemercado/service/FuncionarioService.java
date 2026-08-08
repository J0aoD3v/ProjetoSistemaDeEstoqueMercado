package j0aod3v.sistemaestoquemercado.service;

import j0aod3v.sistemaestoquemercado.model.Funcionario;
import j0aod3v.sistemaestoquemercado.repository.FuncionarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FuncionarioService {

    private final FuncionarioRepository funcionarioRepository;

    public FuncionarioService(FuncionarioRepository funcionarioRepository) {
        this.funcionarioRepository = funcionarioRepository;
    }

    public Funcionario cadastrar(Funcionario funcionario) {
        validar(funcionario);
        return funcionarioRepository.save(funcionario);
    }

    public Funcionario buscarPorId(int id) {
        validarId(id);
        return funcionarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Funcionário não encontrado para o ID: " + id));
    }

    public List<Funcionario> listarTodos() {
        return funcionarioRepository.findAll();
    }

    public Funcionario atualizar(Funcionario funcionario) {
        validar(funcionario);
        validarId(funcionario.getIdFuncionario());
        buscarPorId(funcionario.getIdFuncionario());
        return funcionarioRepository.save(funcionario);
    }

    public void excluir(int id) {
        validarId(id);
        funcionarioRepository.deleteById(id);
    }

    private void validar(Funcionario funcionario) {
        if (funcionario == null) {
            throw new IllegalArgumentException("Funcionário não pode ser nulo.");
        }
        if (funcionario.getMatricula() == null || funcionario.getMatricula().isBlank()) {
            throw new IllegalArgumentException("Matrícula é obrigatória.");
        }
        if (funcionario.getNome() == null || funcionario.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }
        if (funcionario.getCargo() == null || funcionario.getCargo().isBlank()) {
            throw new IllegalArgumentException("Cargo é obrigatório.");
        }
    }

    private void validarId(int id) {
        if (id <= 0) {
            throw new IllegalArgumentException("ID inválido.");
        }
    }
}