package j0aod3v.sistemaestoquemercado.controller;

import j0aod3v.sistemaestoquemercado.model.ItemRecebimento;
import j0aod3v.sistemaestoquemercado.service.ItemRecebimentoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/itens-recebimento")
@CrossOrigin(origins = "*")
public class ItemRecebimentoController {

    private final ItemRecebimentoService itemRecebimentoService;

    public ItemRecebimentoController(ItemRecebimentoService itemRecebimentoService) {
        this.itemRecebimentoService = itemRecebimentoService;
    }

    @GetMapping
    public ResponseEntity<List<ItemRecebimento>> listarTodos() {
        return ResponseEntity.ok(itemRecebimentoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemRecebimento> buscarPorId(@PathVariable int id) {
        return ResponseEntity.ok(itemRecebimentoService.buscarPorId(id));
    }

    @GetMapping("/recebimento/{idRecebimento}")
    public ResponseEntity<List<ItemRecebimento>> listarPorRecebimento(@PathVariable int idRecebimento) {
        return ResponseEntity.ok(itemRecebimentoService.listarPorRecebimento(idRecebimento));
    }

    @PostMapping
    public ResponseEntity<ItemRecebimento> cadastrar(@RequestBody ItemRecebimento item) {
        ItemRecebimento novo = itemRecebimentoService.cadastrar(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(novo);
    }

    @PostMapping("/calcular-divergencia")
    public ResponseEntity<BigDecimal> calcularDivergencia(@RequestBody ItemRecebimento item) {
        BigDecimal divergencia = itemRecebimentoService.calcularDivergencia(item);
        return ResponseEntity.ok(divergencia);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemRecebimento> atualizar(@PathVariable int id, @RequestBody ItemRecebimento item) {
        item.setIdItemRecebimento(id);
        ItemRecebimento atualizado = itemRecebimentoService.atualizar(item);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable int id) {
        itemRecebimentoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}