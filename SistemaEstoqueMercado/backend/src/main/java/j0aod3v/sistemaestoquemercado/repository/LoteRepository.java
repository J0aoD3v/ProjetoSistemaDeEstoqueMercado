package j0aod3v.sistemaestoquemercado.repository;

import j0aod3v.sistemaestoquemercado.model.Lote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LoteRepository extends JpaRepository<Lote, Integer> {
    List<Lote> findByIdProduto(Integer idProduto);
    Lote findByNumeroLote(String numeroLote);
}