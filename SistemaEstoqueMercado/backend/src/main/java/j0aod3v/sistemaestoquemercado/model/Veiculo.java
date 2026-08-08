package j0aod3v.sistemaestoquemercado.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "veiculos")
public class Veiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idVeiculo;

    @NotBlank
    @Pattern(regexp = "[A-Z]{3}-[0-9]{4}|[A-Z]{3}[0-9][A-Z][0-9]{2}", message = "Placa deve estar no formato ABC-1234 ou ABC1D23")
    private String placa;

    @Column(name = "tipo_veiculo")
    @NotBlank
    private String tipoVeiculo;

    @Column(name = "marca_modelo")
    @NotBlank
    private String marcaModelo;

    @NotBlank
    private String transportadora;

    public Veiculo() {}

    public Veiculo(Integer idVeiculo, String placa, String tipoVeiculo, String marcaModelo, String transportadora) {
        this.idVeiculo = idVeiculo;
        this.placa = placa;
        this.tipoVeiculo = tipoVeiculo;
        this.marcaModelo = marcaModelo;
        this.transportadora = transportadora;
    }

    public Integer getIdVeiculo() { return idVeiculo; }
    public void setIdVeiculo(Integer idVeiculo) { this.idVeiculo = idVeiculo; }
    public String getPlaca() { return placa; }
    public void setPlaca(String placa) { this.placa = placa; }
    public String getTipoVeiculo() { return tipoVeiculo; }
    public void setTipoVeiculo(String tipoVeiculo) { this.tipoVeiculo = tipoVeiculo; }
    public String getMarcaModelo() { return marcaModelo; }
    public void setMarcaModelo(String marcaModelo) { this.marcaModelo = marcaModelo; }
    public String getTransportadora() { return transportadora; }
    public void setTransportadora(String transportadora) { this.transportadora = transportadora; }
}