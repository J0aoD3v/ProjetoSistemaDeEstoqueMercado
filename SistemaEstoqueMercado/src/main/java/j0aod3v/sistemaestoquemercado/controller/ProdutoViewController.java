package j0aod3v.sistemaestoquemercado.controller;

import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.control.Alert;
import javafx.scene.control.CheckBox;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.TextField;
import javafx.beans.property.SimpleIntegerProperty;
import javafx.beans.property.SimpleStringProperty;

import j0aod3v.sistemaestoquemercado.model.Produto;

public class ProdutoViewController {

    @FXML
    private TextField txtSku;

    @FXML
    private TextField txtCodigoBarras;

    @FXML
    private TextField txtDescricao;

    @FXML
    private TextField txtUnidadeMedida;

    @FXML
    private CheckBox chkAtivo;

    @FXML
    private TableView<Produto> tabelaProdutos;

    @FXML
    private TableColumn<Produto, Number> colunaId;

    @FXML
    private TableColumn<Produto, String> colunaSku;

    @FXML
    private TableColumn<Produto, String> colunaCodigoBarras;

    @FXML
    private TableColumn<Produto, String> colunaDescricao;

    @FXML
    private TableColumn<Produto, String> colunaUnidade;

    private final ProdutoController produtoController;

    private final ObservableList<Produto> produtos =
            FXCollections.observableArrayList();

    public ProdutoViewController() {
        this.produtoController = new ProdutoController();
    }

    @FXML
    public void initialize() {

        colunaId.setCellValueFactory(
                cellData -> new SimpleIntegerProperty(
                        cellData.getValue().getIdProduto()
                )
        );

        colunaSku.setCellValueFactory(
                cellData -> new SimpleStringProperty(
                        cellData.getValue().getSku()
                )
        );

        colunaCodigoBarras.setCellValueFactory(
                cellData -> new SimpleStringProperty(
                        cellData.getValue().getCodigoBarras()
                )
        );

        colunaDescricao.setCellValueFactory(
                cellData -> new SimpleStringProperty(
                        cellData.getValue().getDescricao()
                )
        );

        colunaUnidade.setCellValueFactory(
                cellData -> new SimpleStringProperty(
                        cellData.getValue().getUnidadeMedida()
                )
        );

        tabelaProdutos.setItems(produtos);

        chkAtivo.setSelected(true);

        carregarProdutos();
    }

    @FXML
    private void cadastrarProduto() {

        try {

            Produto produto = new Produto(
                    0,
                    txtSku.getText().trim(),
                    txtCodigoBarras.getText().trim(),
                    txtDescricao.getText().trim(),
                    txtUnidadeMedida.getText().trim(),
                    chkAtivo.isSelected()
            );

            produtoController.cadastrar(produto);

            mostrarMensagem(
                    Alert.AlertType.INFORMATION,
                    "Sucesso",
                    "Produto cadastrado com sucesso."
            );

            limparCampos();

            carregarProdutos();

        } catch (Exception e) {

            mostrarMensagem(
                    Alert.AlertType.ERROR,
                    "Erro",
                    e.getMessage()
            );
        }
    }

    @FXML
    private void limparCampos() {

        txtSku.clear();
        txtCodigoBarras.clear();
        txtDescricao.clear();
        txtUnidadeMedida.clear();

        chkAtivo.setSelected(true);

        txtSku.requestFocus();
    }

    private void carregarProdutos() {

        try {

            produtos.clear();

            produtos.addAll(
                    produtoController.listarTodos()
            );

        } catch (Exception e) {

            mostrarMensagem(
                    Alert.AlertType.ERROR,
                    "Erro",
                    "Não foi possível carregar os produtos.\n\n"
                            + e.getMessage()
            );
        }
    }

    private void mostrarMensagem(
            Alert.AlertType tipo,
            String titulo,
            String mensagem) {

        Alert alert = new Alert(tipo);

        alert.setTitle(titulo);
        alert.setHeaderText(null);
        alert.setContentText(mensagem);

        alert.showAndWait();
    }
}