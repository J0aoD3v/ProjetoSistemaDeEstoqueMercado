package j0aod3v.sistemaestoquemercado.controller;

import j0aod3v.sistemaestoquemercado.model.dto.EntidadeMetaDTO;
import j0aod3v.sistemaestoquemercado.model.dto.ResultadoImportacaoDTO;
import j0aod3v.sistemaestoquemercado.model.dto.ResumoExportacaoDTO;
import j0aod3v.sistemaestoquemercado.model.dto.ValidacaoImportacaoDTO;
import j0aod3v.sistemaestoquemercado.service.ImportExportService;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/dados")
@CrossOrigin(origins = "*")
public class ImportExportController {

    private final ImportExportService service;

    public ImportExportController(ImportExportService service) {
        this.service = service;
    }

    @GetMapping("/entidades")
    public List<EntidadeMetaDTO> entidades() {
        return service.entidades();
    }

    @GetMapping("/exportar/resumo")
    public ResumoExportacaoDTO resumoExportacao(@RequestParam String entidade) {
        return service.resumoExportacao(entidade);
    }

    @GetMapping("/exportar")
    public ResponseEntity<byte[]> exportar(@RequestParam String entidade) {
        String csv = service.exportar(entidade);
        String nomeArquivo = entidade + "_" + LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE) + ".csv";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("text", "csv", StandardCharsets.UTF_8));
        headers.setContentDisposition(
                ContentDisposition.attachment().filename(nomeArquivo, StandardCharsets.UTF_8).build());
        return new ResponseEntity<>(csv.getBytes(StandardCharsets.UTF_8), headers, HttpStatus.OK);
    }

    @PostMapping("/importar/validar")
    public ValidacaoImportacaoDTO validarImportacao(@RequestParam("entidade") String entidade,
                                                    @RequestParam("arquivo") MultipartFile arquivo) throws IOException {
        return service.validarImportacao(entidade, new String(arquivo.getBytes(), StandardCharsets.UTF_8));
    }

    @PostMapping("/importar")
    public ResultadoImportacaoDTO importar(@RequestParam("entidade") String entidade,
                                           @RequestParam("arquivo") MultipartFile arquivo) throws IOException {
        return service.importar(entidade, new String(arquivo.getBytes(), StandardCharsets.UTF_8));
    }
}