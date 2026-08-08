package j0aod3v.sistemaestoquemercado.database;

import io.github.cdimascio.dotenv.Dotenv;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {

    private static final Dotenv DOTENV = Dotenv.load();

    private static final String HOST = DOTENV.get("PGHOST");
    private static final String PORT = DOTENV.get("PGPORT", "5432");
    private static final String DATABASE = DOTENV.get("PGDATABASE");
    private static final String USER = DOTENV.get("PGUSER");
    private static final String PASSWORD = DOTENV.get("PGPASSWORD");

    private static final String URL =
            "jdbc:postgresql://" +
            HOST + ":" +
            PORT + "/" +
            DATABASE +
            "?sslmode=require";

    public static Connection conectar() throws SQLException {

        if (HOST == null ||
            DATABASE == null ||
            USER == null ||
            PASSWORD == null) {

            throw new SQLException(
                "Configuração do banco incompleta no arquivo .env"
            );
        }

        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            throw new SQLException(
                "Driver JDBC do PostgreSQL não encontrado.",
                e
            );
        }

        return DriverManager.getConnection(
            URL,
            USER,
            PASSWORD
        );
    }
}