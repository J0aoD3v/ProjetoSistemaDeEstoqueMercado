package j0aod3v.sistemaestoquemercado.dao;

import j0aod3v.sistemaestoquemercado.database.Database;
import j0aod3v.sistemaestoquemercado.model.Recebimento;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class RecebimentoDAO {

    public void inserir(Recebimento recebimento) throws SQLException {

        String sql = """
                INSERT INTO recebimento
                    (data_hora_chegada,
                     data_hora_inicio_conferencia,
                     data_hora_fim_conferencia,
                     status_recebimento,
                     id_nota_fiscal,
                     id_funcionario,
                     id_motorista,
                     id_veiculo)
                VALUES
                    (?, ?, ?, ?, ?, ?, ?, ?)
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt =
                     conn.prepareStatement(sql,
                             Statement.RETURN_GENERATED_KEYS)) {

            stmt.setObject(1, recebimento.getDataHoraChegada());
            stmt.setObject(2, recebimento.getDataHoraInicioConferencia());
            stmt.setObject(3, recebimento.getDataHoraFimConferencia());
            stmt.setString(4, recebimento.getStatusRecebimento());
            stmt.setInt(5, recebimento.getIdNotaFiscal());
            stmt.setInt(6, recebimento.getIdFuncionario());
            stmt.setInt(7, recebimento.getIdMotorista());
            stmt.setInt(8, recebimento.getIdVeiculo());

            stmt.executeUpdate();

            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    recebimento.setIdRecebimento(rs.getInt(1));
                }
            }
        }
    }

    public Recebimento buscarPorId(int id) throws SQLException {

        String sql = """
                SELECT *
                FROM recebimento
                WHERE id_recebimento = ?
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

    public List<Recebimento> listarTodos() throws SQLException {

        String sql = """
                SELECT *
                FROM recebimento
                ORDER BY id_recebimento
                """;

        List<Recebimento> lista = new ArrayList<>();

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                lista.add(mapear(rs));
            }
        }

        return lista;
    }

    public void atualizar(Recebimento recebimento) throws SQLException {

        String sql = """
                UPDATE recebimento
                SET data_hora_chegada = ?,
                    data_hora_inicio_conferencia = ?,
                    data_hora_fim_conferencia = ?,
                    status_recebimento = ?,
                    id_nota_fiscal = ?,
                    id_funcionario = ?,
                    id_motorista = ?,
                    id_veiculo = ?
                WHERE id_recebimento = ?
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setObject(1, recebimento.getDataHoraChegada());
            stmt.setObject(2, recebimento.getDataHoraInicioConferencia());
            stmt.setObject(3, recebimento.getDataHoraFimConferencia());
            stmt.setString(4, recebimento.getStatusRecebimento());
            stmt.setInt(5, recebimento.getIdNotaFiscal());
            stmt.setInt(6, recebimento.getIdFuncionario());
            stmt.setInt(7, recebimento.getIdMotorista());
            stmt.setInt(8, recebimento.getIdVeiculo());
            stmt.setInt(9, recebimento.getIdRecebimento());

            stmt.executeUpdate();
        }
    }

    public void excluir(int id) throws SQLException {

        String sql = """
                DELETE FROM recebimento
                WHERE id_recebimento = ?
                """;

        try (Connection conn = Database.conectar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            stmt.executeUpdate();
        }
    }

    private Recebimento mapear(ResultSet rs) throws SQLException {

        return new Recebimento(
                rs.getInt("id_recebimento"),
                rs.getObject("data_hora_chegada",
                        java.time.LocalDateTime.class),
                rs.getObject("data_hora_inicio_conferencia",
                        java.time.LocalDateTime.class),
                rs.getObject("data_hora_fim_conferencia",
                        java.time.LocalDateTime.class),
                rs.getString("status_recebimento"),
                rs.getInt("id_nota_fiscal"),
                rs.getInt("id_funcionario"),
                rs.getInt("id_motorista"),
                rs.getInt("id_veiculo")
        );
    }
}