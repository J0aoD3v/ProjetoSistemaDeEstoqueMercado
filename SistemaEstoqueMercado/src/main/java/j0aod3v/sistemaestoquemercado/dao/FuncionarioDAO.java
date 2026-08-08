package j0aod3v.sistemaestoquemercado.dao;

import j0aod3v.sistemaestoquemercado.database.Database;
import j0aod3v.sistemaestoquemercado.model.Funcionario;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class FuncionarioDAO {

    public void inserir(Funcionario funcionario) throws SQLException {

        String sql = """
                INSERT INTO funcionario
                    (matricula, nome, cargo)
                VALUES
                    (?, ?, ?)
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt =
                     conn.prepareStatement(sql,
                             Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, funcionario.getMatricula());
            stmt.setString(2, funcionario.getNome());
            stmt.setString(3, funcionario.getCargo());

            stmt.executeUpdate();

            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    funcionario.setIdFuncionario(rs.getInt(1));
                }
            }
        }
    }

    public Funcionario buscarPorId(int id) throws SQLException {

        String sql = """
                SELECT *
                FROM funcionario
                WHERE id_funcionario = ?
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

    public List<Funcionario> listarTodos() throws SQLException {

        String sql = """
                SELECT *
                FROM funcionario
                ORDER BY id_funcionario
                """;

        List<Funcionario> lista = new ArrayList<>();

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                lista.add(mapear(rs));
            }
        }

        return lista;
    }

    public void atualizar(Funcionario funcionario) throws SQLException {

        String sql = """
                UPDATE funcionario
                SET matricula = ?,
                    nome = ?,
                    cargo = ?
                WHERE id_funcionario = ?
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, funcionario.getMatricula());
            stmt.setString(2, funcionario.getNome());
            stmt.setString(3, funcionario.getCargo());
            stmt.setInt(4, funcionario.getIdFuncionario());

            stmt.executeUpdate();
        }
    }

    public void excluir(int id) throws SQLException {

        String sql = """
                DELETE FROM funcionario
                WHERE id_funcionario = ?
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            stmt.executeUpdate();
        }
    }

    private Funcionario mapear(ResultSet rs) throws SQLException {

        return new Funcionario(
                rs.getInt("id_funcionario"),
                rs.getString("matricula"),
                rs.getString("nome"),
                rs.getString("cargo")
        );
    }
}