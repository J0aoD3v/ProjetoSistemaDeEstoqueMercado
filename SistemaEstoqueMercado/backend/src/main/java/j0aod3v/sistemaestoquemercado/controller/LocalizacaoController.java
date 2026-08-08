package j0aod3v.sistemaestoquemercado.controller;

import j0aod3v.sistemaestoquemercado.model.Localizacao;
import j0aod3v.sistemaestoquemercado.service.LocalizacaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/localizacoes")
@CrossOrigin(origins = "*")
public class LocalizacaoController {

    private final LocalizacaoService localizacaoService;

    public LocalizacaoController(LocalizacaoService localizacaoService) {
        this.localizacaoService = localizacaoService;
    }

    @GetMapping
    public ResponseEntity<List<Localizacao>> listarTodos() {
        return ResponseEntity.ok(localizacaoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Localizacao> buscarPorId(@PathVariable int id) {
        return ResponseEntity.ok(localizacaoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Localizacao> cadastrar(@RequestBody Localizacao localizacao) {
        Localizacao nova = localizacaoService.cadastrar(localizacao);
        return ResponseEntity.status(HttpStatus.CREATED).body(nova);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Localizacao> atualizar(@PathVariable int id, @RequestBody Localizacao localizacao) {
        localizacao.setIdLocalizacao(id);
        Localizacao atualizada = localizacaoService.atualizar(localizacao);
        return ResponseEntity.ok(atualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable int id) {
        localizacaoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}