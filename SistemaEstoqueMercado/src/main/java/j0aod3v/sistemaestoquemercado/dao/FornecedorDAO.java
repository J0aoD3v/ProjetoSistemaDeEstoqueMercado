package j0aod3v.sistemaestoquemercado.dao;

import j0aod3v.sistemaestoquemercado.database.Database;
import j0aod3v.sistemaestoquemercado.model.Fornecedor;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class FornecedorDAO {

    public void inserir(Fornecedor fornecedor) throws SQLException {

        String sql = """
                INSERT INTO fornecedor
                    (cnpj, razao_social, nome_fantasia)
                VALUES
                    (?, ?, ?)
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt =
                     conn.prepareStatement(sql,
                             Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, fornecedor.getCnpj());
            stmt.setString(2, fornecedor.getRazaoSocial());
            stmt.setString(3, fornecedor.getNomeFantasia());

            stmt.executeUpdate();

            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    fornecedor.setIdFornecedor(rs.getInt(1));
                }
            }
        }
    }

    public Fornecedor buscarPorId(int id) throws SQLException {

        String sql = """
                SELECT *
                FROM fornecedor
                WHERE id_fornecedor = ?
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

    public List<Fornecedor> listarTodos() throws SQLException {

        String sql = """
                SELECT *
                FROM fornecedor
                ORDER BY id_fornecedor
                """;

        List<Fornecedor> fornecedores = new ArrayList<>();

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                fornecedores.add(mapear(rs));
            }
        }

        return fornecedores;
    }

    public void atualizar(Fornecedor fornecedor) throws SQLException {

        String sql = """
                UPDATE fornecedor
                SET cnpj = ?,
                    razao_social = ?,
                    nome_fantasia = ?
                WHERE id_fornecedor = ?
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, fornecedor.getCnpj());
            stmt.setString(2, fornecedor.getRazaoSocial());
            stmt.setString(3, fornecedor.getNomeFantasia());
            stmt.setInt(4, fornecedor.getIdFornecedor());

            stmt.executeUpdate();
        }
    }

    public void excluir(int id) throws SQLException {

        String sql = """
                DELETE FROM fornecedor
                WHERE id_fornecedor = ?
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            stmt.executeUpdate();
        }
    }

    private Fornecedor mapear(ResultSet rs) throws SQLException {

        return new Fornecedor(
                rs.getInt("id_fornecedor"),
                rs.getString("cnpj"),
                rs.getString("razao_social"),
                rs.getString("nome_fantasia")
        );
    }
}