package j0aod3v.sistemaestoquemercado.repository;

import j0aod3v.sistemaestoquemercado.model.Veiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VeiculoRepository extends JpaRepository<Veiculo, Integer> {
    Veiculo findByPlaca(String placa);
}