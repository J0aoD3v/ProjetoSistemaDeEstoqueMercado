package j0aod3v.sistemaestoquemercado.controller;

import j0aod3v.sistemaestoquemercado.model.Motorista;
import j0aod3v.sistemaestoquemercado.service.MotoristaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/motoristas")
@CrossOrigin(origins = "*")
public class MotoristaController {

    private final MotoristaService motoristaService;

    public MotoristaController(MotoristaService motoristaService) {
        this.motoristaService = motoristaService;
    }

    @GetMapping
    public ResponseEntity<List<Motorista>> listarTodos() {
        return ResponseEntity.ok(motoristaService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Motorista> buscarPorId(@PathVariable int id) {
        return ResponseEntity.ok(motoristaService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Motorista> cadastrar(@RequestBody Motorista motorista) {
        Motorista novo = motoristaService.cadastrar(motorista);
        return ResponseEntity.status(HttpStatus.CREATED).body(novo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Motorista> atualizar(@PathVariable int id, @RequestBody Motorista motorista) {
        motorista.setIdMotorista(id);
        Motorista atualizado = motoristaService.atualizar(motorista);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable int id) {
        motoristaService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}