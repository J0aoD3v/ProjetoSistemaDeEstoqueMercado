package j0aod3v.sistemaestoquemercado.dao;

import j0aod3v.sistemaestoquemercado.database.Database;
import j0aod3v.sistemaestoquemercado.model.Localizacao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class LocalizacaoDAO {

    public void inserir(Localizacao localizacao) throws SQLException {

        String sql = """
                INSERT INTO localizacao
                    (codigo_posicao, tipo_armazenamento)
                VALUES
                    (?, ?)
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt =
                     conn.prepareStatement(sql,
                             Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, localizacao.getCodigoPosicao());
            stmt.setString(2, localizacao.getTipoArmazenamento());

            stmt.executeUpdate();

            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    localizacao.setIdLocalizacao(rs.getInt(1));
                }
            }
        }
    }

    public Localizacao buscarPorId(int id) throws SQLException {

        String sql = """
                SELECT *
                FROM localizacao
                WHERE id_localizacao = ?
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

    public List<Localizacao> listarTodos() throws SQLException {

        String sql = """
                SELECT *
                FROM localizacao
                ORDER BY id_localizacao
                """;

        List<Localizacao> lista = new ArrayList<>();

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                lista.add(mapear(rs));
            }
        }

        return lista;
    }

    public void atualizar(Localizacao localizacao) throws SQLException {

        String sql = """
                UPDATE localizacao
                SET codigo_posicao = ?,
                    tipo_armazenamento = ?
                WHERE id_localizacao = ?
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, localizacao.getCodigoPosicao());
            stmt.setString(2, localizacao.getTipoArmazenamento());
            stmt.setInt(3, localizacao.getIdLocalizacao());

            stmt.executeUpdate();
        }
    }

    public void excluir(int id) throws SQLException {

        String sql = """
                DELETE FROM localizacao
                WHERE id_localizacao = ?
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            stmt.executeUpdate();
        }
    }

    private Localizacao mapear(ResultSet rs) throws SQLException {

        return new Localizacao(
                rs.getInt("id_localizacao"),
                rs.getString("codigo_posicao"),
                rs.getString("tipo_armazenamento")
        );
    }
}