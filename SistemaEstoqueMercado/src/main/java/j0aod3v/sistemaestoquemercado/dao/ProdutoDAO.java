package j0aod3v.sistemaestoquemercado.dao;

import j0aod3v.sistemaestoquemercado.database.Database;
import j0aod3v.sistemaestoquemercado.model.Produto;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ProdutoDAO {

    public void inserir(Produto produto) throws SQLException {

        String sql = """
                INSERT INTO produto
                    (sku, codigo_barras, descricao,
                     unidade_medida, status_ativo)
                VALUES
                    (?, ?, ?, ?, ?)
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt =
                     conn.prepareStatement(sql,
                             Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, produto.getSku());
            stmt.setString(2, produto.getCodigoBarras());
            stmt.setString(3, produto.getDescricao());
            stmt.setString(4, produto.getUnidadeMedida());
            stmt.setBoolean(5, produto.getStatusAtivo());

            stmt.executeUpdate();

            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    produto.setIdProduto(rs.getInt(1));
                }
            }
        }
    }

    public Produto buscarPorId(int id) throws SQLException {

        String sql = """
                SELECT *
                FROM produto
                WHERE id_produto = ?
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

    public List<Produto> listarTodos() throws SQLException {

        String sql = """
                SELECT *
                FROM produto
                ORDER BY id_produto
                """;

        List<Produto> lista = new ArrayList<>();

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                lista.add(mapear(rs));
            }
        }

        return lista;
    }

    public List<Produto> listarAtivos() throws SQLException {

        String sql = """
                SELECT *
                FROM produto
                WHERE status_ativo = TRUE
                ORDER BY descricao
                """;

        List<Produto> lista = new ArrayList<>();

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                lista.add(mapear(rs));
            }
        }

        return lista;
    }

    public void atualizar(Produto produto) throws SQLException {

        String sql = """
                UPDATE produto
                SET sku = ?,
                    codigo_barras = ?,
                    descricao = ?,
                    unidade_medida = ?,
                    status_ativo = ?
                WHERE id_produto = ?
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, produto.getSku());
            stmt.setString(2, produto.getCodigoBarras());
            stmt.setString(3, produto.getDescricao());
            stmt.setString(4, produto.getUnidadeMedida());
            stmt.setBoolean(5, produto.getStatusAtivo());
            stmt.setInt(6, produto.getIdProduto());

            stmt.executeUpdate();
        }
    }

    public void excluir(int id) throws SQLException {

        String sql = """
                DELETE FROM produto
                WHERE id_produto = ?
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            stmt.executeUpdate();
        }
    }

    private Produto mapear(ResultSet rs) throws SQLException {

        return new Produto(
                rs.getInt("id_produto"),
                rs.getString("sku"),
                rs.getString("codigo_barras"),
                rs.getString("descricao"),
                rs.getString("unidade_medida"),
                rs.getBoolean("status_ativo")
        );
    }
}