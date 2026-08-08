package j0aod3v.sistemaestoquemercado.service;

import j0aod3v.sistemaestoquemercado.model.Produto;
import j0aod3v.sistemaestoquemercado.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public Produto cadastrar(Produto produto) {
        validar(produto);
        Produto existenteSku = produtoRepository.findBySku(produto.getSku());
        if (existenteSku != null) {
            throw new IllegalArgumentException("SKU já cadastrado: " + produto.getSku());
        }
        Produto existenteCodigo = produtoRepository.findByCodigoBarras(produto.getCodigoBarras());
        if (existenteCodigo != null) {
            throw new IllegalArgumentException("Código de barras já cadastrado: " + produto.getCodigoBarras());
        }
        return produtoRepository.save(produto);
    }

    public Produto buscarPorId(int id) {
        validarId(id);
        return produtoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado para o ID: " + id));
    }

    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    public Produto atualizar(Produto produto) {
        validar(produto);
        validarId(produto.getIdProduto());
        Produto existenteSku = produtoRepository.findBySku(produto.getSku());
        if (existenteSku != null && !existenteSku.getIdProduto().equals(produto.getIdProduto())) {
            throw new IllegalArgumentException("SKU já cadastrado: " + produto.getSku());
        }
        Produto existenteCodigo = produtoRepository.findByCodigoBarras(produto.getCodigoBarras());
        if (existenteCodigo != null && !existenteCodigo.getIdProduto().equals(produto.getIdProduto())) {
            throw new IllegalArgumentException("Código de barras já cadastrado: " + produto.getCodigoBarras());
        }
        buscarPorId(produto.getIdProduto());
        return produtoRepository.save(produto);
    }

    public void excluir(int id) {
        validarId(id);
        produtoRepository.deleteById(id);
    }

    private void validar(Produto produto) {
        if (produto == null) {
            throw new IllegalArgumentException("Produto não pode ser nulo.");
        }
        if (produto.getDescricao() == null || produto.getDescricao().isBlank()) {
            throw new IllegalArgumentException("Descrição do produto é obrigatória.");
        }
    }

    private void validarId(int id) {
        if (id <= 0) {
            throw new IllegalArgumentException("ID inválido.");
        }
    }
}