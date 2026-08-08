package j0aod3v.sistemaestoquemercado.dao;

import j0aod3v.sistemaestoquemercado.database.Database;
import j0aod3v.sistemaestoquemercado.model.Motorista;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MotoristaDAO {

    public void inserir(Motorista motorista) throws SQLException {

        String sql = """
                INSERT INTO motorista
                    (cpf, nome, cnh)
                VALUES
                    (?, ?, ?)
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt =
                     conn.prepareStatement(sql,
                             Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, motorista.getCpf());
            stmt.setString(2, motorista.getNome());
            stmt.setString(3, motorista.getCnh());

            stmt.executeUpdate();

            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    motorista.setIdMotorista(rs.getInt(1));
                }
            }
        }
    }

    public Motorista buscarPorId(int id) throws SQLException {

        String sql = """
                SELECT *
                FROM motorista
                WHERE id_motorista = ?
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapear(rs);
                }
            }
        }

        return null;
    }

    public List<Motorista> listarTodos() throws SQLException {

        String sql = """
                SELECT *
                FROM motorista
                ORDER BY id_motorista
                """;

        List<Motorista> lista = new ArrayList<>();

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                lista.add(mapear(rs));
            }
        }

        return lista;
    }

    public void atualizar(Motorista motorista) throws SQLException {

        String sql = """
                UPDATE motorista
                SET cpf = ?,
                    nome = ?,
                    cnh = ?
                WHERE id_motorista = ?
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, motorista.getCpf());
            stmt.setString(2, motorista.getNome());
            stmt.setString(3, motorista.getCnh());
            stmt.setInt(4, motorista.getIdMotorista());

            stmt.executeUpdate();
        }
    }

    public void excluir(int id) throws SQLException {

        String sql = """
                DELETE FROM motorista
                WHERE id_motorista = ?
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            stmt.executeUpdate();
        }
    }

    private Motorista mapear(ResultSet rs) throws SQLException {

        return new Motorista(
                rs.getInt("id_motorista"),
                rs.getString("cpf"),
                rs.getString("nome"),
                rs.getString("cnh")
        );
    }
}