package j0aod3v.sistemaestoquemercado.model;

public class Funcionario {

    private Integer idFuncionario;
    private String matricula;
    private String nome;
    private String cargo;

    public Funcionario() {
    }

    public Funcionario(Integer idFuncionario, String matricula,
                       String nome, String cargo) {
        this.idFuncionario = idFuncionario;
        this.matricula = matricula;
        this.nome = nome;
        this.cargo = cargo;
    }

    public Integer getIdFuncionario() {
        return idFuncionario;
    }

    public void setIdFuncionario(Integer idFuncionario) {
        this.idFuncionario = idFuncionario;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }
}