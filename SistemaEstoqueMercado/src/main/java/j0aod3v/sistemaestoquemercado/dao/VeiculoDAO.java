package j0aod3v.sistemaestoquemercado.dao;

import j0aod3v.sistemaestoquemercado.database.Database;
import j0aod3v.sistemaestoquemercado.model.Veiculo;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class VeiculoDAO {

    public void inserir(Veiculo veiculo) throws SQLException {

        String sql = """
                INSERT INTO veiculo
                    (placa, tipo_veiculo, marca_modelo, transportadora)
                VALUES
                    (?, ?, ?, ?)
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt =
                     conn.prepareStatement(sql,
                             Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, veiculo.getPlaca());
            stmt.setString(2, veiculo.getTipoVeiculo());
            stmt.setString(3, veiculo.getMarcaModelo());
            stmt.setString(4, veiculo.getTransportadora());

            stmt.executeUpdate();

            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    veiculo.setIdVeiculo(rs.getInt(1));
                }
            }
        }
    }

    public Veiculo buscarPorId(int id) throws SQLException {

        String sql = """
                SELECT *
                FROM veiculo
                WHERE id_veiculo = ?
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

    public List<Veiculo> listarTodos() throws SQLException {

        String sql = """
                SELECT *
                FROM veiculo
                ORDER BY id_veiculo
                """;

        List<Veiculo> lista = new ArrayList<>();

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                lista.add(mapear(rs));
            }
        }

        return lista;
    }

    public void atualizar(Veiculo veiculo) throws SQLException {

        String sql = """
                UPDATE veiculo
                SET placa = ?,
                    tipo_veiculo = ?,
                    marca_modelo = ?,
                    transportadora = ?
                WHERE id_veiculo = ?
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, veiculo.getPlaca());
            stmt.setString(2, veiculo.getTipoVeiculo());
            stmt.setString(3, veiculo.getMarcaModelo());
            stmt.setString(4, veiculo.getTransportadora());
            stmt.setInt(5, veiculo.getIdVeiculo());

            stmt.executeUpdate();
        }
    }

    public void excluir(int id) throws SQLException {

        String sql = """
                DELETE FROM veiculo
                WHERE id_veiculo = ?
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            stmt.executeUpdate();
        }
    }

    private Veiculo mapear(ResultSet rs) throws SQLException {

        return new Veiculo(
                rs.getInt("id_veiculo"),
                rs.getString("placa"),
                rs.getString("tipo_veiculo"),
                rs.getString("marca_modelo"),
                rs.getString("transportadora")
        );
    }
}