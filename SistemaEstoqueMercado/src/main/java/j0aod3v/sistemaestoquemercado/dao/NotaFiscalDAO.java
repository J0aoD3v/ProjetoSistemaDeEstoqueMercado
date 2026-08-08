package j0aod3v.sistemaestoquemercado.dao;

import j0aod3v.sistemaestoquemercado.database.Database;
import j0aod3v.sistemaestoquemercado.model.NotaFiscal;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class NotaFiscalDAO {

    public void inserir(NotaFiscal nota) throws SQLException {

        String sql = """
                INSERT INTO nota_fiscal
                    (numero_nf, serie, data_emissao,
                     chave_acesso_nfe, valor_total,
                     id_fornecedor)
                VALUES
                    (?, ?, ?, ?, ?, ?)
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt =
                     conn.prepareStatement(sql,
                             Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, nota.getNumeroNf());
            stmt.setString(2, nota.getSerie());
            stmt.setObject(3, nota.getDataEmissao());
            stmt.setString(4, nota.getChaveAcessoNfe());
            stmt.setBigDecimal(5, nota.getValorTotal());
            stmt.setInt(6, nota.getIdFornecedor());

            stmt.executeUpdate();

            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    nota.setIdNotaFiscal(rs.getInt(1));
                }
            }
        }
    }

    public NotaFiscal buscarPorId(int id) throws SQLException {

        String sql = """
                SELECT *
                FROM nota_fiscal
                WHERE id_nota_fiscal = ?
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

    public List<NotaFiscal> listarTodos() throws SQLException {

        String sql = """
                SELECT *
                FROM nota_fiscal
                ORDER BY id_nota_fiscal
                """;

        List<NotaFiscal> lista = new ArrayList<>();

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                lista.add(mapear(rs));
            }
        }

        return lista;
    }

    public void atualizar(NotaFiscal nota) throws SQLException {

        String sql = """
                UPDATE nota_fiscal
                SET numero_nf = ?,
                    serie = ?,
                    data_emissao = ?,
                    chave_acesso_nfe = ?,
                    valor_total = ?,
                    id_fornecedor = ?
                WHERE id_nota_fiscal = ?
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, nota.getNumeroNf());
            stmt.setString(2, nota.getSerie());
            stmt.setObject(3, nota.getDataEmissao());
            stmt.setString(4, nota.getChaveAcessoNfe());
            stmt.setBigDecimal(5, nota.getValorTotal());
            stmt.setInt(6, nota.getIdFornecedor());
            stmt.setInt(7, nota.getIdNotaFiscal());

            stmt.executeUpdate();
        }
    }

    public void excluir(int id) throws SQLException {

        String sql = """
                DELETE FROM nota_fiscal
                WHERE id_nota_fiscal = ?
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            stmt.executeUpdate();
        }
    }

    private NotaFiscal mapear(ResultSet rs) throws SQLException {

        return new NotaFiscal(
                rs.getInt("id_nota_fiscal"),
                rs.getString("numero_nf"),
                rs.getString("serie"),
                rs.getObject("data_emissao",
                        java.time.LocalDate.class),
                rs.getString("chave_acesso_nfe"),
                rs.getBigDecimal("valor_total"),
                rs.getInt("id_fornecedor")
        );
    }
}