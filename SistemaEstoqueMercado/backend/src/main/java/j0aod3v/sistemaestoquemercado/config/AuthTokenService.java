package j0aod3v.sistemaestoquemercado.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class AuthTokenService {

    private final Duration validade;
    private final Map<String, Instant> tokensValidos = new ConcurrentHashMap<>();

    public AuthTokenService(@Value("${app.auth.token-ttl:720}") long ttlMinutos) {
        this.validade = Duration.ofMinutes(ttlMinutos);
    }

    public String gerarToken() {
        String token = UUID.randomUUID().toString();
        tokensValidos.put(token, Instant.now().plus(validade));
        return token;
    }

    public boolean validar(String token) {
        if (token == null || token.isBlank()) {
            return false;
        }
        Instant expiracao = tokensValidos.get(token);
        if (expiracao == null) {
            return false;
        }
        if (expiracao.isBefore(Instant.now())) {
            revogar(token);
            return false;
        }
        return true;
    }

    public void revogar(String token) {
        if (token != null) {
            tokensValidos.remove(token);
        }
    }

    public String extrairDoBearerToken(String autorizacao) {
        if (autorizacao == null || !autorizacao.startsWith("Bearer ")) {
            return null;
        }
        String token = autorizacao.substring(7).trim();
        return token.isEmpty() ? null : token;
    }
}