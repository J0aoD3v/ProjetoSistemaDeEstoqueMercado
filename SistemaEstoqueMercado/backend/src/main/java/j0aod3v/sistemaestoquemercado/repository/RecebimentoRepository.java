package j0aod3v.sistemaestoquemercado.repository;

import j0aod3v.sistemaestoquemercado.model.Recebimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RecebimentoRepository extends JpaRepository<Recebimento, Integer> {
    List<Recebimento> findByStatusRecebimento(String statusRecebimento);
}