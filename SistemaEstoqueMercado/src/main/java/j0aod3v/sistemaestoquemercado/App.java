package j0aod3v.sistemaestoquemercado;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.Parent;
import javafx.stage.Stage;

public class App extends Application {

    @Override
    public void start(Stage stage) throws Exception {

        FXMLLoader loader = new FXMLLoader(
                App.class.getResource(
                        "/j0aod3v/sistemaestoquemercado/fxml/ProdutoView.fxml"
                )
        );

        Parent root = loader.load();

        Scene scene = new Scene(root, 1000, 700);

        stage.setTitle("Sistema de Estoque");
        stage.setScene(scene);
        stage.setMinWidth(900);
        stage.setMinHeight(600);

        stage.show();
    }

    public static void main(String[] args) {
        launch();
    }
}
