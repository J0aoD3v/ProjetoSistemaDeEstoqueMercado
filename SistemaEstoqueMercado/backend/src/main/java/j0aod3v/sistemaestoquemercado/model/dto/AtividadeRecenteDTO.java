package j0aod3v.sistemaestoquemercado.model.dto;

public class AtividadeRecenteDTO {
    private Integer id;
    private String tipo;
    private String titulo;
    private String dataHora;
    private String status;
    private String corStatus;

    public AtividadeRecenteDTO() {}

    public AtividadeRecenteDTO(Integer id, String tipo, String titulo, String dataHora, String status, String corStatus) {
        this.id = id;
        this.tipo = tipo;
        this.titulo = titulo;
        this.dataHora = dataHora;
        this.status = status;
        this.corStatus = corStatus;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDataHora() { return dataHora; }
    public void setDataHora(String dataHora) { this.dataHora = dataHora; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCorStatus() { return corStatus; }
    public void setCorStatus(String corStatus) { this.corStatus = corStatus; }
}
