package j0aod3v.sistemaestoquemercado.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "funcionarios")
public class Funcionario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idFuncionario;

    @NotBlank
    @Pattern(regexp = "FUNC-[0-9]{3}", message = "Matrícula deve estar no formato FUNC-001")
    private String matricula;

    @NotBlank
    private String nome;

    @NotBlank
    private String cargo;

    public Funcionario() {}

    public Funcionario(Integer idFuncionario, String matricula, String nome, String cargo) {
        this.idFuncionario = idFuncionario;
        this.matricula = matricula;
        this.nome = nome;
        this.cargo = cargo;
    }

    public Integer getIdFuncionario() { return idFuncionario; }
    public void setIdFuncionario(Integer idFuncionario) { this.idFuncionario = idFuncionario; }
    public String getMatricula() { return matricula; }
    public void setMatricula(String matricula) { this.matricula = matricula; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getCargo() { return cargo; }
    public void setCargo(String cargo) { this.cargo = cargo; }
}