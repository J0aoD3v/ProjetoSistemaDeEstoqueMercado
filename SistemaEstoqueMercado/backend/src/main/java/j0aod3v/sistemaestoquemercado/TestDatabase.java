package j0aod3v.sistemaestoquemercado;

import j0aod3v.sistemaestoquemercado.database.Database;
import java.sql.Connection;

public class TestDatabase {

    public static void main(String[] args) {

        System.out.println("Tentando conectar ao banco...");

        try (Connection connection = Database.conectar()) {

            System.out.println("================================");
            System.out.println("CONEXÃO REALIZADA COM SUCESSO!");
            System.out.println("================================");

            System.out.println("Banco: " + connection.getCatalog());
            System.out.println("Servidor: " + connection.getMetaData().getDatabaseProductName());
            System.out.println("Versão: " + connection.getMetaData().getDatabaseProductVersion());

        } catch (Exception e) {

            System.out.println("================================");
            System.out.println("ERRO AO CONECTAR!");
            System.out.println("================================");

            e.printStackTrace();
        }
    }
}