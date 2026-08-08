package j0aod3v.sistemaestoquemercado;

import j0aod3v.sistemaestoquemercado.dao.ProdutoDAO;
import j0aod3v.sistemaestoquemercado.model.Produto;

public class TestDAO {

    public static void main(String[] args) {

        System.out.println("================================");
        System.out.println("      TESTE DO PRODUTO DAO");
        System.out.println("================================");

        ProdutoDAO produtoDAO = new ProdutoDAO();

        try {

            // ========================================
            // 1. CRIAR PRODUTO
            // ========================================

            Produto produto = new Produto(
                    0,
                    "SKU-TESTE-001",
                    "7890000000011",
                    "Produto de teste do sistema",
                    "UN",
                    true
            );

            System.out.println("\n[1] Inserindo produto...");

            produtoDAO.inserir(produto);

            System.out.println("Produto inserido com sucesso!");
            System.out.println("ID gerado: " + produto.getIdProduto());


            // ========================================
            // 2. BUSCAR PRODUTO PELO ID
            // ========================================

            System.out.println("\n[2] Buscando produto pelo ID...");

            Produto encontrado =
                    produtoDAO.buscarPorId(produto.getIdProduto());

            if (encontrado != null) {

                System.out.println("Produto encontrado!");
                System.out.println("--------------------------------");
                System.out.println("ID: " + encontrado.getIdProduto());
                System.out.println("SKU: " + encontrado.getSku());
                System.out.println("Código de barras: "
                        + encontrado.getCodigoBarras());
                System.out.println("Descrição: "
                        + encontrado.getDescricao());
                System.out.println("Unidade: "
                        + encontrado.getUnidadeMedida());
                System.out.println("Ativo: "
                        + encontrado.getStatusAtivo());

            } else {

                System.out.println("Produto não encontrado!");
            }


            // ========================================
            // 3. LISTAR PRODUTOS
            // ========================================

            System.out.println("\n[3] Listando produtos...");

            var produtos = produtoDAO.listarTodos();

            System.out.println("Quantidade encontrada: "
                    + produtos.size());

            for (Produto p : produtos) {

                System.out.println(
                        p.getIdProduto()
                        + " | "
                        + p.getSku()
                        + " | "
                        + p.getDescricao()
                );
            }


            // ========================================
            // 4. ATUALIZAR PRODUTO
            // ========================================

            System.out.println("\n[4] Atualizando produto...");

            encontrado.setDescricao(
                    "Produto de teste atualizado"
            );

            produtoDAO.atualizar(encontrado);

            System.out.println("Produto atualizado!");


            // ========================================
            // 5. CONFIRMAR ATUALIZAÇÃO
            // ========================================

            System.out.println("\n[5] Confirmando atualização...");

            Produto atualizado =
                    produtoDAO.buscarPorId(
                            encontrado.getIdProduto()
                    );

            System.out.println(
                    "Nova descrição: "
                    + atualizado.getDescricao()
            );


            // ========================================
            // 6. EXCLUIR PRODUTO
            // ========================================

            System.out.println("\n[6] Excluindo produto de teste...");

            produtoDAO.excluir(
                    atualizado.getIdProduto()
            );

            System.out.println("Produto excluído!");


            // ========================================
            // 7. CONFIRMAR EXCLUSÃO
            // ========================================

            System.out.println("\n[7] Confirmando exclusão...");

            Produto removido =
                    produtoDAO.buscarPorId(
                            atualizado.getIdProduto()
                    );

            if (removido == null) {

                System.out.println(
                        "Produto não existe mais no banco."
                );

            } else {

                System.out.println(
                        "ATENÇÃO: produto ainda existe!"
                );
            }


            // ========================================
            // FINAL
            // ========================================

            System.out.println("\n================================");
            System.out.println("       TESTE CONCLUÍDO!");
            System.out.println("================================");

        } catch (Exception e) {

            System.out.println("\n================================");
            System.out.println("          ERRO NO TESTE");
            System.out.println("================================");

            e.printStackTrace();
        }
    }
}
