package j0aod3v.sistemaestoquemercado.dao;

import j0aod3v.sistemaestoquemercado.database.Database;
import j0aod3v.sistemaestoquemercado.model.ItemRecebimento;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ItemRecebimentoDAO {

    public void inserir(ItemRecebimento item) throws SQLException {

        String sql = """
                INSERT INTO item_recebimento
                    (quantidade_declarada,
                     quantidade_conferida,
                     id_recebimento,
                     id_lote,
                     id_localizacao)
                VALUES
                    (?, ?, ?, ?, ?)
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt =
                     conn.prepareStatement(sql,
                             Statement.RETURN_GENERATED_KEYS)) {

            stmt.setBigDecimal(1, item.getQuantidadeDeclarada());
            stmt.setBigDecimal(2, item.getQuantidadeConferida());
            stmt.setInt(3, item.getIdRecebimento());
            stmt.setInt(4, item.getIdLote());
            stmt.setInt(5, item.getIdLocalizacao());

            stmt.executeUpdate();

            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    item.setIdItemRecebimento(rs.getInt(1));
                }
            }
        }
    }

    public ItemRecebimento buscarPorId(int id) throws SQLException {

        String sql = """
                SELECT *
                FROM item_recebimento
                WHERE id_item_recebimento = ?
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

    public List<ItemRecebimento> listarTodos() throws SQLException {

        String sql = """
                SELECT *
                FROM item_recebimento
                ORDER BY id_item_recebimento
                """;

        List<ItemRecebimento> lista = new ArrayList<>();

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                lista.add(mapear(rs));
            }
        }

        return lista;
    }

    public List<ItemRecebimento> listarPorRecebimento(
            int idRecebimento) throws SQLException {

        String sql = """
                SELECT *
                FROM item_recebimento
                WHERE id_recebimento = ?
                ORDER BY id_item_recebimento
                """;

        List<ItemRecebimento> lista = new ArrayList<>();

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, idRecebimento);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    lista.add(mapear(rs));
                }
            }
        }

        return lista;
    }

    public void atualizar(ItemRecebimento item) throws SQLException {

        String sql = """
                UPDATE item_recebimento
                SET quantidade_declarada = ?,
                    quantidade_conferida = ?,
                    id_recebimento = ?,
                    id_lote = ?,
                    id_localizacao = ?
                WHERE id_item_recebimento = ?
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setBigDecimal(1, item.getQuantidadeDeclarada());
            stmt.setBigDecimal(2, item.getQuantidadeConferida());
            stmt.setInt(3, item.getIdRecebimento());
            stmt.setInt(4, item.getIdLote());
            stmt.setInt(5, item.getIdLocalizacao());
            stmt.setInt(6, item.getIdItemRecebimento());

            stmt.executeUpdate();
        }
    }

    public void excluir(int id) throws SQLException {

        String sql = """
                DELETE FROM item_recebimento
                WHERE id_item_recebimento = ?
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            stmt.executeUpdate();
        }
    }

    private ItemRecebimento mapear(ResultSet rs)
            throws SQLException {

        return new ItemRecebimento(
                rs.getInt("id_item_recebimento"),
                rs.getBigDecimal("quantidade_declarada"),
                rs.getBigDecimal("quantidade_conferida"),
                rs.getInt("id_recebimento"),
                rs.getInt("id_lote"),
                rs.getInt("id_localizacao")
        );
    }
}