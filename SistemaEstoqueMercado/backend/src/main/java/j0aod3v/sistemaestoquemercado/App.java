package j0aod3v.sistemaestoquemercado;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;

@SpringBootApplication
public class App {

    public static void main(String[] args) {
        // FORÇA O JAVA A USAR IPv6 (Solução para conexões Neon no Brasil)
        System.setProperty("java.net.preferIPv6Addresses", "true");

        File envFile = new File(".env");
        String dotenvDir = envFile.exists() ? "./" : "../";

        Dotenv dotenv = Dotenv.configure()
                .directory(dotenvDir)
                .ignoreIfMissing()
                .load();

        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });

        System.out.println("=========================================");
        System.out.println("CONFIGURAÇÃO LIDA DO .ENV:");
        System.out.println("HOST: " + System.getProperty("PGHOST"));
        System.out.println("BANCO: " + System.getProperty("PGDATABASE"));
        System.out.println("USUÁRIO: " + System.getProperty("PGUSER"));
        System.out.println("=========================================");

        SpringApplication.run(App.class, args);
    }
}