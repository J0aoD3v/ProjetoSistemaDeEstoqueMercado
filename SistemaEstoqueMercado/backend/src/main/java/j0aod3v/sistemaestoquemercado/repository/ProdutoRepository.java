package j0aod3v.sistemaestoquemercado.repository;

import j0aod3v.sistemaestoquemercado.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Integer> {
    // Exemplo de busca personalizada sem SQL:
    Produto findBySku(String sku);
    Produto findByCodigoBarras(String codigoBarras);
}