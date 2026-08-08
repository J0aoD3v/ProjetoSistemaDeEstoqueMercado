package j0aod3v.sistemaestoquemercado.controller;

import j0aod3v.sistemaestoquemercado.model.NotaFiscal;
import j0aod3v.sistemaestoquemercado.service.NotaFiscalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notas-fiscais")
@CrossOrigin(origins = "*")
public class NotaFiscalController {

    private final NotaFiscalService notaFiscalService;

    public NotaFiscalController(NotaFiscalService notaFiscalService) {
        this.notaFiscalService = notaFiscalService;
    }

    @GetMapping
    public ResponseEntity<List<NotaFiscal>> listarTodos() {
        return ResponseEntity.ok(notaFiscalService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotaFiscal> buscarPorId(@PathVariable int id) {
        return ResponseEntity.ok(notaFiscalService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<NotaFiscal> cadastrar(@RequestBody NotaFiscal nota) {
        NotaFiscal nova = notaFiscalService.cadastrar(nota);
        return ResponseEntity.status(HttpStatus.CREATED).body(nova);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NotaFiscal> atualizar(@PathVariable int id, @RequestBody NotaFiscal nota) {
        nota.setIdNotaFiscal(id);
        NotaFiscal atualizada = notaFiscalService.atualizar(nota);
        return ResponseEntity.ok(atualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable int id) {
        notaFiscalService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}