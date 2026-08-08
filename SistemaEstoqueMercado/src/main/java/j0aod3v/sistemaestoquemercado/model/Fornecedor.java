package j0aod3v.sistemaestoquemercado.model;

public class Fornecedor {

    private Integer idFornecedor;
    private String cnpj;
    private String razaoSocial;
    private String nomeFantasia;

    public Fornecedor() {
    }

    public Fornecedor(Integer idFornecedor, String cnpj,
    String razaoSocial, String nomeFantasia) {
        this.idFornecedor = idFornecedor;
        this.cnpj = cnpj;
        this.razaoSocial = razaoSocial;
        this.nomeFantasia = nomeFantasia;
    }

    public Integer getIdFornecedor() {
        return idFornecedor;
    }

    public void setIdFornecedor(Integer idFornecedor) {
        this.idFornecedor = idFornecedor;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getRazaoSocial() {
        return razaoSocial;
    }

    public void setRazaoSocial(String razaoSocial) {
        this.razaoSocial = razaoSocial;
    }

    public String getNomeFantasia() {
        return nomeFantasia;
    }

    public void setNomeFantasia(String nomeFantasia) {
        this.nomeFantasia = nomeFantasia;
    }
}