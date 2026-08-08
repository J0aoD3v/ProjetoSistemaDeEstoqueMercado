package j0aod3v.sistemaestoquemercado.model;

public class Motorista {

    private Integer idMotorista;
    private String cpf;
    private String nome;
    private String cnh;

    public Motorista() {
    }

    public Motorista(Integer idMotorista, String cpf,
                     String nome, String cnh) {
        this.idMotorista = idMotorista;
        this.cpf = cpf;
        this.nome = nome;
        this.cnh = cnh;
    }

    public Integer getIdMotorista() {
        return idMotorista;
    }

    public void setIdMotorista(Integer idMotorista) {
        this.idMotorista = idMotorista;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCnh() {
        return cnh;
    }

    public void setCnh(String cnh) {
        this.cnh = cnh;
    }
}