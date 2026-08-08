package j0aod3v.sistemaestoquemercado.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "motoristas")
public class Motorista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idMotorista;

    @NotBlank
    @Pattern(regexp = "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}", message = "CPF deve estar no formato 000.000.000-00")
    private String cpf;

    @NotBlank
    private String nome;

    @NotBlank
    private String cnh;

    public Motorista() {}

    public Motorista(Integer idMotorista, String cpf, String nome, String cnh) {
        this.idMotorista = idMotorista;
        this.cpf = cpf;
        this.nome = nome;
        this.cnh = cnh;
    }

    public Integer getIdMotorista() { return idMotorista; }
    public void setIdMotorista(Integer idMotorista) { this.idMotorista = idMotorista; }
    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getCnh() { return cnh; }
    public void setCnh(String cnh) { this.cnh = cnh; }
}