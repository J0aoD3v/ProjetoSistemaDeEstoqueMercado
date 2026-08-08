package j0aod3v.sistemaestoquemercado.repository;

import j0aod3v.sistemaestoquemercado.model.Motorista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MotoristaRepository extends JpaRepository<Motorista, Integer> {
    Motorista findByCpf(String cpf);
}