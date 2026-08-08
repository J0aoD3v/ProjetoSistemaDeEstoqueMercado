package j0aod3v.sistemaestoquemercado.service;

import j0aod3v.sistemaestoquemercado.model.Veiculo;
import j0aod3v.sistemaestoquemercado.repository.VeiculoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VeiculoService {

    private final VeiculoRepository veiculoRepository;

    public VeiculoService(VeiculoRepository veiculoRepository) {
        this.veiculoRepository = veiculoRepository;
    }

    public Veiculo cadastrar(Veiculo veiculo) {
        validar(veiculo);
        return veiculoRepository.save(veiculo);
    }

    public Veiculo buscarPorId(int id) {
        validarId(id);
        return veiculoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Veículo não encontrado para o ID: " + id));
    }

    public List<Veiculo> listarTodos() {
        return veiculoRepository.findAll();
    }

    public Veiculo atualizar(Veiculo veiculo) {
        validar(veiculo);
        validarId(veiculo.getIdVeiculo());
        buscarPorId(veiculo.getIdVeiculo());
        return veiculoRepository.save(veiculo);
    }

    public void excluir(int id) {
        validarId(id);
        veiculoRepository.deleteById(id);
    }

    private void validar(Veiculo veiculo) {
        if (veiculo == null) {
            throw new IllegalArgumentException("Veículo não pode ser nulo.");
        }
        if (veiculo.getPlaca() == null || veiculo.getPlaca().isBlank()) {
            throw new IllegalArgumentException("Placa do veículo é obrigatória.");
        }
    }

    private void validarId(int id) {
        if (id <= 0) {
            throw new IllegalArgumentException("ID inválido.");
        }
    }
}