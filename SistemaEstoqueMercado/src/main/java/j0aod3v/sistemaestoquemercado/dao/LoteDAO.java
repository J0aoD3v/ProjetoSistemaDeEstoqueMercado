package j0aod3v.sistemaestoquemercado.dao;

import j0aod3v.sistemaestoquemercado.database.Database;
import j0aod3v.sistemaestoquemercado.model.Lote;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class LoteDAO {

    public void inserir(Lote lote) throws SQLException {

        String sql = """
                INSERT INTO lote
                    (numero_lote, data_fabricacao,
                     data_validade, id_produto)
                VALUES
                    (?, ?, ?, ?)
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt =
                     conn.prepareStatement(sql,
                             Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, lote.getNumeroLote());
            stmt.setObject(2, lote.getDataFabricacao());
            stmt.setObject(3, lote.getDataValidade());
            stmt.setInt(4, lote.getIdProduto());

            stmt.executeUpdate();

            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    lote.setIdLote(rs.getInt(1));
                }
            }
        }
    }

    public Lote buscarPorId(int id) throws SQLException {

        String sql = """
                SELECT *
                FROM lote
                WHERE id_lote = ?
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

    public List<Lote> listarTodos() throws SQLException {

        String sql = """
                SELECT *
                FROM lote
                ORDER BY id_lote
                """;

        List<Lote> lista = new ArrayList<>();

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                lista.add(mapear(rs));
            }
        }

        return lista;
    }

    public List<Lote> listarPorProduto(int idProduto) throws SQLException {

        String sql = """
                SELECT *
                FROM lote
                WHERE id_produto = ?
                ORDER BY data_validade
                """;

        List<Lote> lista = new ArrayList<>();

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, idProduto);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    lista.add(mapear(rs));
                }
            }
        }

        return lista;
    }

    public void atualizar(Lote lote) throws SQLException {

        String sql = """
                UPDATE lote
                SET numero_lote = ?,
                    data_fabricacao = ?,
                    data_validade = ?,
                    id_produto = ?
                WHERE id_lote = ?
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, lote.getNumeroLote());
            stmt.setObject(2, lote.getDataFabricacao());
            stmt.setObject(3, lote.getDataValidade());
            stmt.setInt(4, lote.getIdProduto());
            stmt.setInt(5, lote.getIdLote());

            stmt.executeUpdate();
        }
    }

    public void excluir(int id) throws SQLException {

        String sql = """
                DELETE FROM lote
                WHERE id_lote = ?
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            stmt.executeUpdate();
        }
    }

    private Lote mapear(ResultSet rs) throws SQLException {

        return new Lote(
                rs.getInt("id_lote"),
                rs.getString("numero_lote"),
                rs.getObject("data_fabricacao",
                        java.time.LocalDate.class),
                rs.getObject("data_validade",
                        java.time.LocalDate.class),
                rs.getInt("id_produto")
        );
    }
}