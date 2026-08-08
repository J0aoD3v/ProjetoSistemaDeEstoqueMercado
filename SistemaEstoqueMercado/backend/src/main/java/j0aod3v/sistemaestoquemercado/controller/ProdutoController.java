package j0aod3v.sistemaestoquemercado.controller;

import j0aod3v.sistemaestoquemercado.model.Produto;
import j0aod3v.sistemaestoquemercado.service.ProdutoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "*")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @GetMapping
    public ResponseEntity<List<Produto>> listarTodos() {
        return ResponseEntity.ok(produtoService.listarTodos());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Produto>> buscarPorTermo(@RequestParam String termo) {
        List<Produto> todos = produtoService.listarTodos();
        String termoLower = termo.toLowerCase();
        List<Produto> filtrados = todos.stream()
                .filter(p -> p.getSku() != null && p.getSku().toLowerCase().contains(termoLower)
                        || p.getCodigoBarras() != null && p.getCodigoBarras().contains(termo)
                        || p.getDescricao() != null && p.getDescricao().toLowerCase().contains(termoLower))
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(filtrados);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable int id) {
        return ResponseEntity.ok(produtoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Produto> cadastrar(@RequestBody Produto produto) {
        Produto novo = produtoService.cadastrar(produto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizar(@PathVariable int id, @RequestBody Produto produto) {
        produto.setIdProduto(id);
        Produto atualizado = produtoService.atualizar(produto);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable int id) {
        produtoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}