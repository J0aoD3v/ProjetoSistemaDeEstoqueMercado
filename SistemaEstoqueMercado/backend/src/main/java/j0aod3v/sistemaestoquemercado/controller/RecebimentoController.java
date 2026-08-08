package j0aod3v.sistemaestoquemercado.controller;

import j0aod3v.sistemaestoquemercado.model.Recebimento;
import j0aod3v.sistemaestoquemercado.service.RecebimentoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recebimentos")
@CrossOrigin(origins = "*")
public class RecebimentoController {

    private final RecebimentoService recebimentoService;

    public RecebimentoController(RecebimentoService recebimentoService) {
        this.recebimentoService = recebimentoService;
    }

    @GetMapping
    public ResponseEntity<List<Recebimento>> listarTodos() {
        return ResponseEntity.ok(recebimentoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recebimento> buscarPorId(@PathVariable int id) {
        return ResponseEntity.ok(recebimentoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Recebimento> cadastrar(@RequestBody Recebimento recebimento) {
        Recebimento novo = recebimentoService.cadastrar(recebimento);
        return ResponseEntity.status(HttpStatus.CREATED).body(novo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Recebimento> atualizar(@PathVariable int id, @RequestBody Recebimento recebimento) {
        recebimento.setIdRecebimento(id);
        Recebimento atualizado = recebimentoService.atualizar(recebimento);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable int id) {
        recebimentoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}