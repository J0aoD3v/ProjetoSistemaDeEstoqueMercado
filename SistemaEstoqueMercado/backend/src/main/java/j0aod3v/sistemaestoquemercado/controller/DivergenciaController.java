package j0aod3v.sistemaestoquemercado.controller;

import j0aod3v.sistemaestoquemercado.model.Divergencia;
import j0aod3v.sistemaestoquemercado.service.DivergenciaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/divergencias")
@CrossOrigin(origins = "*")
public class DivergenciaController {

    private final DivergenciaService divergenciaService;

    public DivergenciaController(DivergenciaService divergenciaService) {
        this.divergenciaService = divergenciaService;
    }

    @GetMapping
    public ResponseEntity<List<Divergencia>> listarTodos() {
        return ResponseEntity.ok(divergenciaService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Divergencia> buscarPorId(@PathVariable int id) {
        return ResponseEntity.ok(divergenciaService.buscarPorId(id));
    }

    @GetMapping("/item/{idItemRecebimento}")
    public ResponseEntity<List<Divergencia>> listarPorItemRecebimento(@PathVariable int idItemRecebimento) {
        return ResponseEntity.ok(divergenciaService.listarPorItemRecebimento(idItemRecebimento));
    }

    @PostMapping
    public ResponseEntity<Divergencia> cadastrar(@RequestBody Divergencia divergencia) {
        Divergencia nova = divergenciaService.cadastrar(divergencia);
        return ResponseEntity.status(HttpStatus.CREATED).body(nova);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Divergencia> atualizar(@PathVariable int id, @RequestBody Divergencia divergencia) {
        divergencia.setIdDivergencia(id);
        Divergencia atualizada = divergenciaService.atualizar(divergencia);
        return ResponseEntity.ok(atualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable int id) {
        divergenciaService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}