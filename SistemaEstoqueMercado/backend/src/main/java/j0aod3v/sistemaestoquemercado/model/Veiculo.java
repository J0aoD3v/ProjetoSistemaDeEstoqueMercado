package j0aod3v.sistemaestoquemercado.model;

import jakarta.persistence.*;

@Entity
@Table(name = "veiculos")
public class Veiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idVeiculo;

    private String placa;

    @Column(name = "tipo_veiculo")
    private String tipoVeiculo;

    @Column(name = "marca_modelo")
    private String marcaModelo;

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