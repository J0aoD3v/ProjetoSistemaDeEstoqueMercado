package j0aod3v.sistemaestoquemercado.repository;

import j0aod3v.sistemaestoquemercado.model.ItemRecebimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ItemRecebimentoRepository extends JpaRepository<ItemRecebimento, Integer> {
    List<ItemRecebimento> findByIdRecebimento(Integer idRecebimento);
}