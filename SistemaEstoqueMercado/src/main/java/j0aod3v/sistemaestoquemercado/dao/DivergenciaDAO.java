package j0aod3v.sistemaestoquemercado.dao;

import j0aod3v.sistemaestoquemercado.database.Database;
import j0aod3v.sistemaestoquemercado.model.Divergencia;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DivergenciaDAO {

    public void inserir(Divergencia divergencia)
            throws SQLException {

        String sql = """
                INSERT INTO divergencia
                    (tipo_divergencia,
                     quantidade_divergente,
                     observacao,
                     id_item_recebimento)
                VALUES
                    (?, ?, ?, ?)
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt =
                     conn.prepareStatement(sql,
                             Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, divergencia.getTipoDivergencia());
            stmt.setBigDecimal(
                    2,
                    divergencia.getQuantidadeDivergente()
            );
            stmt.setString(3, divergencia.getObservacao());
            stmt.setInt(4, divergencia.getIdItemRecebimento());

            stmt.executeUpdate();

            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    divergencia.setIdDivergencia(rs.getInt(1));
                }
            }
        }
    }

    public Divergencia buscarPorId(int id) throws SQLException {

        String sql = """
                SELECT *
                FROM divergencia
                WHERE id_divergencia = ?
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

    public List<Divergencia> listarTodos()
            throws SQLException {

        String sql = """
                SELECT *
                FROM divergencia
                ORDER BY id_divergencia
                """;

        List<Divergencia> lista = new ArrayList<>();

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                lista.add(mapear(rs));
            }
        }

        return lista;
    }

    public List<Divergencia> listarPorItemRecebimento(
            int idItemRecebimento) throws SQLException {

        String sql = """
                SELECT *
                FROM divergencia
                WHERE id_item_recebimento = ?
                ORDER BY id_divergencia
                """;

        List<Divergencia> lista = new ArrayList<>();

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, idItemRecebimento);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    lista.add(mapear(rs));
                }
            }
        }

        return lista;
    }

    public void atualizar(Divergencia divergencia)
            throws SQLException {

        String sql = """
                UPDATE divergencia
                SET tipo_divergencia = ?,
                    quantidade_divergente = ?,
                    observacao = ?,
                    id_item_recebimento = ?
                WHERE id_divergencia = ?
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(
                    1,
                    divergencia.getTipoDivergencia()
            );
            stmt.setBigDecimal(
                    2,
                    divergencia.getQuantidadeDivergente()
            );
            stmt.setString(
                    3,
                    divergencia.getObservacao()
            );
            stmt.setInt(
                    4,
                    divergencia.getIdItemRecebimento()
            );
            stmt.setInt(
                    5,
                    divergencia.getIdDivergencia()
            );

            stmt.executeUpdate();
        }
    }

    public void excluir(int id) throws SQLException {

        String sql = """
                DELETE FROM divergencia
                WHERE id_divergencia = ?
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            stmt.executeUpdate();
        }
    }

    private Divergencia mapear(ResultSet rs)
            throws SQLException {

        return new Divergencia(
                rs.getInt("id_divergencia"),
                rs.getString("tipo_divergencia"),
                rs.getBigDecimal("quantidade_divergente"),
                rs.getString("observacao"),
                rs.getInt("id_item_recebimento")
        );
    }
}