package j0aod3v.sistemaestoquemercado.repository;

import j0aod3v.sistemaestoquemercado.model.Divergencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DivergenciaRepository extends JpaRepository<Divergencia, Integer> {
    List<Divergencia> findByIdItemRecebimento(Integer idItemRecebimento);
}