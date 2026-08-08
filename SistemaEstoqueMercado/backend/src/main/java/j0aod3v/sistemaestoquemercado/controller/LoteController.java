package j0aod3v.sistemaestoquemercado.controller;

import j0aod3v.sistemaestoquemercado.model.Lote;
import j0aod3v.sistemaestoquemercado.service.LoteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lotes")
@CrossOrigin(origins = "*")
public class LoteController {

    private final LoteService loteService;

    public LoteController(LoteService loteService) {
        this.loteService = loteService;
    }

    @GetMapping
    public ResponseEntity<List<Lote>> listarTodos() {
        return ResponseEntity.ok(loteService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lote> buscarPorId(@PathVariable int id) {
        return ResponseEntity.ok(loteService.buscarPorId(id));
    }

    @GetMapping("/produto/{idProduto}")
    public ResponseEntity<List<Lote>> listarPorProduto(@PathVariable int idProduto) {
        return ResponseEntity.ok(loteService.listarPorProduto(idProduto));
    }

    @PostMapping
    public ResponseEntity<Lote> cadastrar(@RequestBody Lote lote) {
        Lote novo = loteService.cadastrar(lote);
        return ResponseEntity.status(HttpStatus.CREATED).body(novo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lote> atualizar(@PathVariable int id, @RequestBody Lote lote) {
        lote.setIdLote(id);
        Lote atualizado = loteService.atualizar(lote);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable int id) {
        loteService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}