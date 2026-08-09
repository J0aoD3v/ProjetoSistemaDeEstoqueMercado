package j0aod3v.sistemaestoquemercado.controller;

import j0aod3v.sistemaestoquemercado.config.AuthTokenService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthTokenService tokenService;
    private final String usuarioAdmin;
    private final String senhaAdmin;

    public AuthController(
            AuthTokenService tokenService,
            @Value("${app.auth.usuario:admin}") String usuarioAdmin,
            @Value("${app.auth.senha:admin}") String senhaAdmin) {
        this.tokenService = tokenService;
        this.usuarioAdmin = usuarioAdmin;
        this.senhaAdmin = senhaAdmin;
    }

    public record LoginRequest(String usuario, String senha) {
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody(required = false) LoginRequest requisicao) {
        boolean credenciaisValidas = requisicao != null
                && usuarioAdmin.equals(requisicao.usuario())
                && senhaAdmin.equals(requisicao.senha());

        if (!credenciaisValidas) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("mensagem", "Usuário ou senha inválidos."));
        }

        return ResponseEntity.ok(Map.of("token", tokenService.gerarToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(
            @RequestHeader(value = "Authorization", required = false) String autorizacao) {
        tokenService.revogar(tokenService.extrairDoBearerToken(autorizacao));
        return ResponseEntity.ok(Map.of("mensagem", "Sessão encerrada."));
    }
}