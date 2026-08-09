package j0aod3v.sistemaestoquemercado.service;

import j0aod3v.sistemaestoquemercado.model.*;
import j0aod3v.sistemaestoquemercado.model.dto.*;
import j0aod3v.sistemaestoquemercado.repository.*;
import j0aod3v.sistemaestoquemercado.util.CsvUtil;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;

@Service
public class ImportExportService {

    private final ProdutoRepository produtoRepository;
    private final FornecedorRepository fornecedorRepository;
    private final FuncionarioRepository funcionarioRepository;
    private final MotoristaRepository motoristaRepository;
    private final VeiculoRepository veiculoRepository;
    private final LocalizacaoRepository localizacaoRepository;
    private final NotaFiscalRepository notaFiscalRepository;
    private final LoteRepository loteRepository;
    private final RecebimentoRepository recebimentoRepository;
    private final ItemRecebimentoRepository itemRecebimentoRepository;
    private final DivergenciaRepository divergenciaRepository;

    public ImportExportService(ProdutoRepository produtoRepository, FornecedorRepository fornecedorRepository,
                               FuncionarioRepository funcionarioRepository, MotoristaRepository motoristaRepository,
                               VeiculoRepository veiculoRepository, LocalizacaoRepository localizacaoRepository,
                               NotaFiscalRepository notaFiscalRepository, LoteRepository loteRepository,
                               RecebimentoRepository recebimentoRepository, ItemRecebimentoRepository itemRecebimentoRepository,
                               DivergenciaRepository divergenciaRepository) {
        this.produtoRepository = produtoRepository;
        this.fornecedorRepository = fornecedorRepository;
        this.funcionarioRepository = funcionarioRepository;
        this.motoristaRepository = motoristaRepository;
        this.veiculoRepository = veiculoRepository;
        this.localizacaoRepository = localizacaoRepository;
        this.notaFiscalRepository = notaFiscalRepository;
        this.loteRepository = loteRepository;
        this.recebimentoRepository = recebimentoRepository;
        this.itemRecebimentoRepository = itemRecebimentoRepository;
        this.divergenciaRepository = divergenciaRepository;
    }

    private static final Map<String, String> ROTULOS = Map.ofEntries(
            Map.entry("produtos", "Produtos"),
            Map.entry("fornecedores", "Fornecedores"),
            Map.entry("funcionarios", "Funcionários"),
            Map.entry("motoristas", "Motoristas"),
            Map.entry("veiculos", "Veículos"),
            Map.entry("localizacoes", "Localizações"),
            Map.entry("notas_fiscais", "Notas Fiscais"),
            Map.entry("lotes", "Lotes"),
            Map.entry("recebimentos", "Recebimentos"),
            Map.entry("itens_recebimento", "Itens de Recebimento"),
            Map.entry("divergencias", "Divergências"));

    private static final List<String> TODAS_ENTIDADES = List.of(
            "produtos", "fornecedores", "funcionarios", "motoristas", "veiculos", "localizacoes",
            "notas_fiscais", "lotes", "recebimentos", "itens_recebimento", "divergencias");

    private static final Map<String, String[]> COLUNAS_EXPORT = Map.ofEntries(
            Map.entry("produtos", new String[]{"id", "sku", "codigo_barras", "descricao", "unidade_medida", "status_ativo"}),
            Map.entry("fornecedores", new String[]{"id", "cnpj", "razao_social", "nome_fantasia"}),
            Map.entry("funcionarios", new String[]{"id", "matricula", "nome", "cargo"}),
            Map.entry("motoristas", new String[]{"id", "cpf", "cnh", "nome"}),
            Map.entry("veiculos", new String[]{"id", "placa", "tipo_veiculo", "marca_modelo", "transportadora"}),
            Map.entry("localizacoes", new String[]{"id", "codigo_posicao", "tipo_armazenamento"}),
            Map.entry("notas_fiscais", new String[]{"id", "numero_nf", "serie", "data_emissao", "chave_acesso_nfe", "valor_total", "fornecedor_cnpj"}),
            Map.entry("lotes", new String[]{"id", "numero_lote", "data_fabricacao", "data_validade", "produto_sku"}),
            Map.entry("recebimentos", new String[]{"id", "data_hora_chegada", "data_hora_inicio_conferencia", "data_hora_fim_conferencia", "status_recebimento", "nota_fiscal_chave", "funcionario_matricula", "motorista_cpf", "veiculo_placa"}),
            Map.entry("itens_recebimento", new String[]{"id", "quantidade_declarada", "quantidade_conferida", "nota_fiscal_chave", "lote_numero", "localizacao_codigo"}),
            Map.entry("divergencias", new String[]{"id", "tipo_divergencia", "quantidade_divergente", "observacao", "nota_fiscal_chave", "lote_numero"}));

    private static final Map<String, String[]> COLUNAS_OBRIGATORIAS = Map.ofEntries(
            Map.entry("produtos", new String[]{"sku", "codigo_barras", "descricao", "unidade_medida"}),
            Map.entry("fornecedores", new String[]{"cnpj", "razao_social"}),
            Map.entry("funcionarios", new String[]{"matricula", "nome", "cargo"}),
            Map.entry("motoristas", new String[]{"cpf", "cnh", "nome"}),
            Map.entry("veiculos", new String[]{"placa", "tipo_veiculo", "marca_modelo", "transportadora"}),
            Map.entry("localizacoes", new String[]{"codigo_posicao", "tipo_armazenamento"}),
            Map.entry("notas_fiscais", new String[]{"numero_nf", "serie", "data_emissao", "chave_acesso_nfe", "valor_total", "fornecedor_cnpj"}),
            Map.entry("lotes", new String[]{"numero_lote", "data_fabricacao", "data_validade", "produto_sku"}),
            Map.entry("recebimentos", new String[]{"data_hora_chegada", "nota_fiscal_chave"}),
            Map.entry("itens_recebimento", new String[]{"quantidade_declarada", "quantidade_conferida", "nota_fiscal_chave", "lote_numero", "localizacao_codigo"}),
            Map.entry("divergencias", new String[]{"tipo_divergencia", "quantidade_divergente", "nota_fiscal_chave", "lote_numero"}));

    private static final DateTimeFormatter DATA_BR = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter DATA_ISO = DateTimeFormatter.ISO_LOCAL_DATE;
    private static final DateTimeFormatter DATA_HORA_BR = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private static final List<DateTimeFormatter> FORMATOS_DATA_HORA = List.of(
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"),
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"),
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"),
            DateTimeFormatter.ISO_LOCAL_DATE_TIME);

    // ====================== METADADOS (UI) ======================

    public List<EntidadeMetaDTO> entidades() {
        List<EntidadeMetaDTO> lista = new ArrayList<>();
        for (String chave : TODAS_ENTIDADES) {
            lista.add(entidadeMeta(chave));
        }
        return lista;
    }

    private EntidadeMetaDTO entidadeMeta(String chave) {
        return new EntidadeMetaDTO(chave, ROTULOS.get(chave), descricaoEntidade(chave), contar(chave), colunasMeta(chave));
    }

    public ResumoExportacaoDTO resumoExportacao(String entidade) {
        validarEntidade(entidade);
        return new ResumoExportacaoDTO(entidade, ROTULOS.get(entidade), "csv", contar(entidade),
                Arrays.asList(COLUNAS_EXPORT.get(entidade)));
    }

    private long contar(String entidade) {
        switch (entidade) {
            case "produtos": return produtoRepository.count();
            case "fornecedores": return fornecedorRepository.count();
            case "funcionarios": return funcionarioRepository.count();
            case "motoristas": return motoristaRepository.count();
            case "veiculos": return veiculoRepository.count();
            case "localizacoes": return localizacaoRepository.count();
            case "notas_fiscais": return notaFiscalRepository.count();
            case "lotes": return loteRepository.count();
            case "recebimentos": return recebimentoRepository.count();
            case "itens_recebimento": return itemRecebimentoRepository.count();
            case "divergencias": return divergenciaRepository.count();
            default: throw new IllegalArgumentException("Entidade desconhecida: " + entidade);
        }
    }

    private String descricaoEntidade(String entidade) {
        switch (entidade) {
            case "produtos": return "Catálogo de produtos (SKU, código de barras, unidade e status).";
            case "fornecedores": return "Parceiros e distribuidores cadastrados.";
            case "funcionarios": return "Funcionários do setor de recebimento.";
            case "motoristas": return "Motoristas de transportadoras.";
            case "veiculos": return "Veículos utilizados nas entregas.";
            case "localizacoes": return "Posições de armazenamento no estoque.";
            case "notas_fiscais": return "Notas fiscais. A coluna fornecedor_cnpj referencia um fornecedor existente.";
            case "lotes": return "Lotes de produtos. A coluna produto_sku referencia um produto existente.";
            case "recebimentos": return "Recebimentos. Referenciam nota fiscal (chave), funcionário (matrícula), motorista (CPF) e veículo (placa) já cadastrados.";
            case "itens_recebimento": return "Linhas de recebimento. Referenciam a nota fiscal (chave), o lote (número) e a localização (código).";
            case "divergencias": return "Divergências de itens de recebimento. Referenciam a nota fiscal (chave) e o lote (número).";
            default: return "";
        }
    }

    private void validarEntidade(String entidade) {
        if (entidade == null || !TODAS_ENTIDADES.contains(entidade)) {
            throw new IllegalArgumentException("Entidade desconhecida. Use: " + String.join(", ", TODAS_ENTIDADES));
        }
    }

    // ====================== METADADOS DAS COLUNAS ======================

    private static String normalizarColuna(String nome) {
        if (nome == null) return "";
        String semAcentuacao = Normalizer.normalize(nome, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
        return semAcentuacao.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]", "");
    }

    private static final Map<String, ColunaMetaDTO> COL_META = carregarMetaColunas();

    private static List<ColunaMetaDTO> colunasMeta(String entidade) {
        String[] colunas = COLUNAS_EXPORT.get(entidade);
        List<String> obrigatorias = Arrays.asList(COLUNAS_OBRIGATORIAS.get(entidade));
        List<ColunaMetaDTO> lista = new ArrayList<>();
        for (String col : colunas) {
            ColunaMetaDTO base = COL_META.get(normalizarColuna(col));
            if (base == null) {
                base = new ColunaMetaDTO(col, col, "texto", false, "", "");
            }
            ColunaMetaDTO meta = new ColunaMetaDTO(col, base.getRotulo(), base.getTipo(), false, base.getExemplo(), base.getDescricao());
            meta.setObrigatorio(obrigatorias.contains(col));
            lista.add(meta);
        }
        return lista;
    }

    private static Map<String, ColunaMetaDTO> carregarMetaColunas() {
        Map<String, ColunaMetaDTO> m = new HashMap<>();
        m.put("id", new ColunaMetaDTO("id", "ID interno", "número", false, "1", "Não preencher na importação (auto-gerado)."));
        m.put("sku", new ColunaMetaDTO("sku", "SKU", "texto", false, "PRD-001", "Letras maiúsculas, números e hífen."));
        m.put("codigobarras", new ColunaMetaDTO("codigo_barras", "Código de barras", "número", false, "7891234567890", "8 a 14 dígitos."));
        m.put("descricao", new ColunaMetaDTO("descricao", "Descrição", "texto", false, "Arroz 5kg", ""));
        m.put("unidadedemedida", new ColunaMetaDTO("unidade_medida", "Unidade de medida", "texto", false, "CX", "Ex.: CX, UN, KG."));
        m.put("statusativo", new ColunaMetaDTO("status_ativo", "Ativo", "booleano", false, "true", "true, ativo, sim, 1 / false, inativo, não."));
        m.put("cnpj", new ColunaMetaDTO("cnpj", "CNPJ", "texto", false, "00.000.000/0001-00", "Com máscara."));
        m.put("razaosocial", new ColunaMetaDTO("razao_social", "Razão social", "texto", false, "Distribuidora X Ltda", ""));
        m.put("nomefantasia", new ColunaMetaDTO("nome_fantasia", "Nome fantasia", "texto", false, "Distribuidora X", ""));
        m.put("matricula", new ColunaMetaDTO("matricula", "Matrícula", "texto", false, "FUNC-001", "Formato FUNC-001."));
        m.put("nome", new ColunaMetaDTO("nome", "Nome", "texto", false, "João da Silva", ""));
        m.put("cargo", new ColunaMetaDTO("cargo", "Cargo", "texto", false, "Conferente", ""));
        m.put("cpf", new ColunaMetaDTO("cpf", "CPF", "texto", false, "000.000.000-00", "Com máscara."));
        m.put("cnh", new ColunaMetaDTO("cnh", "CNH", "texto", false, "12345678901", ""));
        m.put("placa", new ColunaMetaDTO("placa", "Placa", "texto", false, "ABC-1234", "ABC-1234 ou ABC1D23."));
        m.put("tipoveiculo", new ColunaMetaDTO("tipo_veiculo", "Tipo do veículo", "texto", false, "Caminhão", ""));
        m.put("marcamodelo", new ColunaMetaDTO("marca_modelo", "Marca/Modelo", "texto", false, "M. Benz Actros", ""));
        m.put("transportadora", new ColunaMetaDTO("transportadora", "Transportadora", "texto", false, "Transportes X", ""));
        m.put("codigoposicao", new ColunaMetaDTO("codigo_posicao", "Código da posição", "texto", false, "A-01-02", "Formato A-01-02."));
        m.put("tipoarmazenamento", new ColunaMetaDTO("tipo_armazenamento", "Tipo de armazenamento", "texto", false, "Prateleira", ""));
        m.put("numeronf", new ColunaMetaDTO("numero_nf", "Número da NF", "número", false, "12345", ""));
        m.put("serie", new ColunaMetaDTO("serie", "Série", "texto", false, "001", ""));
        m.put("dataemissao", new ColunaMetaDTO("data_emissao", "Data de emissão", "data", false, "01/01/2026", "dd/MM/aaaa."));
        m.put("chaveacessonfe", new ColunaMetaDTO("chave_acesso_nfe", "Chave de acesso", "número", false, "35260000000000000000000000000000000000000000", "44 dígitos."));
        m.put("valortotal", new ColunaMetaDTO("valor_total", "Valor total (R$)", "decimal", false, "1234.56", "Decimais com ponto. Mínimo 0."));
        m.put("fornecedorcnpj", new ColunaMetaDTO("fornecedor_cnpj", "Fornecedor (CNPJ)", "texto", false, "00.000.000/0001-00", "Referência: CNPJ de fornecedor já cadastrado."));
        m.put("numerolote", new ColunaMetaDTO("numero_lote", "Número do lote", "texto", false, "LOTE-001", "Letras maiúsculas, números e hífen."));
        m.put("datafabricacao", new ColunaMetaDTO("data_fabricacao", "Data de fabricação", "data", false, "01/01/2026", "dd/MM/aaaa."));
        m.put("datavalidade", new ColunaMetaDTO("data_validade", "Data de validade", "data", false, "31/12/2026", "dd/MM/aaaa."));
        m.put("produtosku", new ColunaMetaDTO("produto_sku", "Produto (SKU)", "texto", false, "PRD-001", "Referência: SKU de produto já cadastrado."));
        m.put("datahorachegada", new ColunaMetaDTO("data_hora_chegada", "Data/hora de chegada", "data-hora", false, "08/08/2026 14:30", "dd/MM/aaaa HH:mm."));
        m.put("datahorainicioconferencia", new ColunaMetaDTO("data_hora_inicio_conferencia", "Início da conferência", "data-hora", false, "08/08/2026 15:00", "Opcional."));
        m.put("datahorafimconferencia", new ColunaMetaDTO("data_hora_fim_conferencia", "Fim da conferência", "data-hora", false, "08/08/2026 15:45", "Opcional."));
        m.put("statusrecebimento", new ColunaMetaDTO("status_recebimento", "Status do recebimento", "texto", false, "EM_CONFERENCIA", "Ex.: EM_CONFERENCIA, CONCLUIDO."));
        m.put("notafiscalchave", new ColunaMetaDTO("nota_fiscal_chave", "Nota fiscal (chave de acesso)", "texto", false, "352607...44 dígitos...", "Referência: chave da NF já cadastrada."));
        m.put("funcionariomatricula", new ColunaMetaDTO("funcionario_matricula", "Funcionário (matrícula)", "texto", false, "FUNC-001", "Referência: matrícula já cadastrada."));
        m.put("motoristacpf", new ColunaMetaDTO("motorista_cpf", "Motorista (CPF)", "texto", false, "000.000.000-00", "Referência: CPF já cadastrado."));
        m.put("veiculoplaca", new ColunaMetaDTO("veiculo_placa", "Veículo (placa)", "texto", false, "ABC-1234", "Referência: placa já cadastrada."));
        m.put("quantidadedeclarada", new ColunaMetaDTO("quantidade_declarada", "Qtd. declarada", "decimal", false, "100.00", "Mínimo 0."));
        m.put("quantidadeconferida", new ColunaMetaDTO("quantidade_conferida", "Qtd. conferida", "decimal", false, "98.00", "Mínimo 0."));
        m.put("lotenumero", new ColunaMetaDTO("lote_numero", "Lote (número)", "texto", false, "LOTE-001", "Referência: número do lote já cadastrado."));
        m.put("localizacaocodigo", new ColunaMetaDTO("localizacao_codigo", "Localização (código)", "texto", false, "A-01-02", "Referência: código da posição já cadastrado."));
        m.put("tipodivergencia", new ColunaMetaDTO("tipo_divergencia", "Tipo da divergência", "texto", false, "falta", "falta, sobra ou avaria."));
        m.put("quantidadedivergente", new ColunaMetaDTO("quantidade_divergente", "Qtd. divergente", "decimal", false, "2.00", "Não pode ser zero."));
        m.put("observacao", new ColunaMetaDTO("observacao", "Observação", "texto", false, "Produto danificado", ""));
        return m;
    }

    // ====================== PARSING CSV ======================

    private List<List<String>> parseCsv(String conteudo) {
        char separador = CsvUtil.detectarSeparador(conteudo);
        List<List<String>> registros = CsvUtil.lerRegistros(conteudo, separador);
        if (registros.isEmpty()) {
            throw new IllegalArgumentException("O arquivo CSV está vazio ou inválido.");
        }
        return registros;
    }

    private List<String> normalizarCabecalho(List<String> cabecalho) {
        List<String> normais = new ArrayList<>();
        for (String h : cabecalho) {
            normais.add(normalizarColuna(h));
        }
        return normais;
    }

    private void garantirColunas(List<String> headers, String[] obrigatorias) {
        List<String> faltando = new ArrayList<>();
        for (String col : obrigatorias) {
            if (!headers.contains(normalizarColuna(col))) {
                faltando.add(col);
            }
        }
        if (!faltando.isEmpty()) {
            throw new IllegalArgumentException("Colunas obrigatórias ausentes no arquivo: " + String.join(", ", faltando)
                    + ". Baixe o modelo exportado ou siga a descrição das colunas.");
        }
    }

    private boolean linhaVazia(List<String> linha) {
        for (String c : linha) {
            if (c != null && !c.trim().isEmpty()) {
                return false;
            }
        }
        return true;
    }

    private Map<String, String> mapaLinha(List<String> headers, List<String> linha) {
        Map<String, String> mapa = new LinkedHashMap<>();
        for (int i = 0; i < headers.size(); i++) {
            String valor = i < linha.size() ? linha.get(i) : "";
            mapa.put(headers.get(i), valor == null ? "" : valor.trim());
        }
        return mapa;
    }

    // ====================== VALIDAÇÃO (PRÉVIA) ======================

    public ValidacaoImportacaoDTO validarImportacao(String entidade, String conteudo) {
        validarEntidade(entidade);
        if (conteudo == null || conteudo.isBlank()) {
            throw new IllegalArgumentException("Arquivo vazio.");
        }
        List<List<String>> registros = parseCsv(conteudo);
        List<String> headers = normalizarCabecalho(registros.get(0));
        garantirColunas(headers, COLUNAS_OBRIGATORIAS.get(entidade));

        ValidacaoImportacaoDTO dto = new ValidacaoImportacaoDTO();
        long total = 0, validos = 0, comErros = 0, duplicados = 0;

        for (int i = 1; i < registros.size(); i++) {
            List<String> linha = registros.get(i);
            if (linhaVazia(linha)) {
                continue;
            }
            total++;
            List<String> erros = new ArrayList<>();
            montarEntidade(entidade, mapaLinha(headers, linha), erros);
            if (!erros.isEmpty()) {
                comErros++;
                if (dto.getErros().size() < 50) {
                    dto.getErros().add(new ErroLinhaDTO(i + 1, String.join(" | ", erros)));
                }
            } else {
                String dup = duplicadoNaBase(entidade, mapaLinha(headers, linha));
                if (dup != null) {
                    duplicados++;
                    if (dto.getDuplicidades().size() < 50) {
                        dto.getDuplicidades().add(new ErroLinhaDTO(i + 1, dup));
                    }
                } else {
                    validos++;
                }
            }
        }

        dto.setTotalLinhas(total);
        dto.setRegistrosValidos(validos);
        dto.setRegistrosComErro(comErros);
        dto.setRegistrosDuplicados(duplicados);
        dto.setProntoParaImportar(comErros == 0);
        if (total == 0) {
            throw new IllegalArgumentException("Nenhuma linha de dados encontrada no arquivo.");
        }
        return dto;
    }

    // ====================== IMPORT (CONFIRMAÇÃO/TRANSAÇÃO) ======================

    @Transactional
    public ResultadoImportacaoDTO importar(String entidade, String conteudo) {
        validarEntidade(entidade);
        if (conteudo == null || conteudo.isBlank()) {
            throw new IllegalArgumentException("Arquivo vazio.");
        }
        List<List<String>> registros = parseCsv(conteudo);
        List<String> headers = normalizarCabecalho(registros.get(0));
        garantirColunas(headers, COLUNAS_OBRIGATORIAS.get(entidade));

        ResultadoImportacaoDTO dto = new ResultadoImportacaoDTO();
        long total = 0, importados = 0, ignorados = 0, rejeitados = 0;

        try {
            for (int i = 1; i < registros.size(); i++) {
                List<String> linha = registros.get(i);
                if (linhaVazia(linha)) {
                    continue;
                }
                total++;
                Map<String, String> mapa = mapaLinha(headers, linha);
                List<String> erros = new ArrayList<>();
                Object obj = montarEntidade(entidade, mapa, erros);
                if (!erros.isEmpty()) {
                    rejeitados++;
                    if (dto.getErros().size() < 50) {
                        dto.getErros().add(new ErroLinhaDTO(i + 1, String.join(" | ", erros)));
                    }
                    continue;
                }
                String dup = duplicadoNaBase(entidade, mapa);
                if (dup != null) {
                    ignorados++;
                    continue;
                }
                persistir(entidade, obj);
                importados++;
            }
        } catch (DataAccessException e) {
            throw new IllegalArgumentException("Erro de banco ao importar: nenhum registro foi gravado (transação revertida). " + mensagemCausa(e));
        }
        if (total == 0) {
            throw new IllegalArgumentException("Nenhuma linha de dados encontrada no arquivo.");
        }

        dto.setTotalLinhas(total);
        dto.setImportados(importados);
        dto.setDuplicadosIgnorados(ignorados);
        dto.setErrosRejeitados(rejeitados);
        dto.setSucesso(importados > 0 || ignorados > 0);
        dto.setMensagem(importados > 0
                ? importados + " registro(s) importado(s) com sucesso."
                : "Nenhum registro novo foi inserido.");
        return dto;
    }

    private String mensagemCausa(DataAccessException e) {
        Throwable causa = e.getMostSpecificCause() != null ? e.getMostSpecificCause() : e;
        String msg = causa.getMessage();
        return msg == null || msg.isBlank() ? causa.getClass().getSimpleName() : msg;
    }

    // ====================== PARSING DE TIPOS ======================

    private String requerido(Map<String, String> mapa, String chave, List<String> erros, String rotulo) {
        String v = mapa.get(normalizarColuna(chave));
        if (v == null || v.isBlank()) {
            erros.add(rotulo + " é obrigatório.");
            return "";
        }
        return v;
    }

    private String opcional(Map<String, String> mapa, String chave) {
        String v = mapa.get(normalizarColuna(chave));
        return v == null ? "" : v.trim();
    }

    private LocalDate lerData(Map<String, String> mapa, String chave, boolean obrigatorio, List<String> erros, String rotulo) {
        String v = obrigatorio ? requerido(mapa, chave, erros, rotulo) : opcional(mapa, chave);
        if (v.isEmpty()) {
            return null;
        }
        try {
            return LocalDate.parse(v, DATA_BR);
        } catch (DateTimeParseException e1) {
            try {
                return LocalDate.parse(v, DATA_ISO);
            } catch (DateTimeParseException e2) {
                erros.add(rotulo + " inválida. Use dd/MM/aaaa (ex.: 01/01/2026).");
                return null;
            }
        }
    }

    private LocalDateTime lerDataHora(Map<String, String> mapa, String chave, boolean obrigatorio, List<String> erros, String rotulo) {
        String v = obrigatorio ? requerido(mapa, chave, erros, rotulo) : opcional(mapa, chave);
        if (v.isEmpty()) {
            return null;
        }
        for (DateTimeFormatter fmt : FORMATOS_DATA_HORA) {
            try {
                return LocalDateTime.parse(v, fmt);
            } catch (DateTimeParseException ignored) {
            }
        }
        erros.add(rotulo + " inválido. Use dd/MM/aaaa HH:mm (ex.: 08/08/2026 14:30).");
        return null;
    }

    private BigDecimal lerNumero(Map<String, String> mapa, String chave, boolean obrigatorio, List<String> erros, String rotulo) {
        String v = obrigatorio ? requerido(mapa, chave, erros, rotulo) : opcional(mapa, chave);
        if (v.isEmpty()) {
            return null;
        }
        String limpo = v.replace("R$", "").replace(" ", "").replace("\u00A0", "");
        try {
            return new BigDecimal(limpo);
        } catch (NumberFormatException e) {
            erros.add(rotulo + " inválido. Use número com ponto decimal (ex.: 12.50).");
            return null;
        }
    }

    private Boolean lerBooleano(Map<String, String> mapa, String chave, List<String> erros, String rotulo) {
        String v = opcional(mapa, chave);
        if (v.isEmpty()) {
            return null;
        }
        switch (v.toLowerCase(Locale.ROOT)) {
            case "true": case "ativo": case "sim": case "s": case "1":
                return true;
            case "false": case "inativo": case "nao": case "n": case "0":
                return false;
            default:
                erros.add(rotulo + " inválido. Use true ou false.");
                return null;
        }
    }

    // ====================== MAPEAMENTO DE ENTIDADES ======================

    private Object montarEntidade(String entidade, Map<String, String> m, List<String> erros) {
        switch (entidade) {
            case "produtos": return montarProduto(m, erros);
            case "fornecedores": return montarFornecedor(m, erros);
            case "funcionarios": return montarFuncionario(m, erros);
            case "motoristas": return montarMotorista(m, erros);
            case "veiculos": return montarVeiculo(m, erros);
            case "localizacoes": return montarLocalizacao(m, erros);
            case "notas_fiscais": return montarNotaFiscal(m, erros);
            case "lotes": return montarLote(m, erros);
            case "recebimentos": return montarRecebimento(m, erros);
            case "itens_recebimento": return montarItemRecebimento(m, erros);
            case "divergencias": return montarDivergencia(m, erros);
            default: throw new IllegalArgumentException("Entidade desconhecida: " + entidade);
        }
    }

    private Produto montarProduto(Map<String, String> m, List<String> erros) {
        Produto p = new Produto();
        String sku = requerido(m, "sku", erros, "sku");
        String codigo = requerido(m, "codigo_barras", erros, "Código de barras");
        String descricao = requerido(m, "descricao", erros, "Descrição");
        String unidade = requerido(m, "unidade_medida", erros, "Unidade de medida");
        if (!sku.isEmpty() && !sku.matches("[A-Z0-9\\-]+")) {
            erros.add("sku inválido (use apenas letras maiúsculas, números e hífen).");
        }
        if (!codigo.isEmpty() && !codigo.matches("\\d{8,14}")) {
            erros.add("Código de barras inválido (8 a 14 dígitos).");
        }
        Boolean status = lerBooleano(m, "status_ativo", erros, "status_ativo");
        p.setSku(sku.toUpperCase(Locale.ROOT));
        p.setCodigoBarras(codigo);
        p.setDescricao(descricao);
        p.setUnidadeMedida(unidade.toUpperCase(Locale.ROOT));
        p.setStatusAtivo(status == null ? true : status);
        return p;
    }

    private Fornecedor montarFornecedor(Map<String, String> m, List<String> erros) {
        Fornecedor f = new Fornecedor();
        String cnpj = requerido(m, "cnpj", erros, "CNPJ");
        String razao = requerido(m, "razao_social", erros, "Razão social");
        if (!cnpj.isEmpty() && !cnpj.matches("\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}")) {
            erros.add("CNPJ inválido. Use o formato 00.000.000/0001-00.");
        }
        f.setCnpj(cnpj);
        f.setRazaoSocial(razao);
        f.setNomeFantasia(opcional(m, "nome_fantasia"));
        return f;
    }

    private Funcionario montarFuncionario(Map<String, String> m, List<String> erros) {
        Funcionario f = new Funcionario();
        String matricula = requerido(m, "matricula", erros, "Matrícula");
        String nome = requerido(m, "nome", erros, "Nome");
        String cargo = requerido(m, "cargo", erros, "Cargo");
        if (!matricula.isEmpty() && !matricula.matches("FUNC-[0-9]{3}")) {
            erros.add("Matrícula inválida. Use o formato FUNC-001.");
        }
        f.setMatricula(matricula.toUpperCase(Locale.ROOT));
        f.setNome(nome);
        f.setCargo(cargo);
        return f;
    }

    private Motorista montarMotorista(Map<String, String> m, List<String> erros) {
        Motorista mot = new Motorista();
        String cpf = requerido(m, "cpf", erros, "CPF");
        String cnh = requerido(m, "cnh", erros, "CNH");
        String nome = requerido(m, "nome", erros, "Nome");
        if (!cpf.isEmpty() && !cpf.matches("\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}")) {
            erros.add("CPF inválido. Use o formato 000.000.000-00.");
        }
        mot.setCpf(cpf);
        mot.setCnh(cnh);
        mot.setNome(nome);
        return mot;
    }

    private Veiculo montarVeiculo(Map<String, String> m, List<String> erros) {
        Veiculo v = new Veiculo();
        String placa = requerido(m, "placa", erros, "Placa");
        String tipo = requerido(m, "tipo_veiculo", erros, "Tipo do veículo");
        String marca = requerido(m, "marca_modelo", erros, "Marca/Modelo");
        String transportadora = requerido(m, "transportadora", erros, "Transportadora");
        if (!placa.isEmpty() && !placa.matches("[A-Z]{3}-[0-9]{4}|[A-Z]{3}[0-9][A-Z][0-9]{2}")) {
            erros.add("Placa inválida. Use ABC-1234 ou ABC1D23.");
        }
        v.setPlaca(placa.toUpperCase(Locale.ROOT));
        v.setTipoVeiculo(tipo);
        v.setMarcaModelo(marca);
        v.setTransportadora(transportadora);
        return v;
    }

    private Localizacao montarLocalizacao(Map<String, String> m, List<String> erros) {
        Localizacao l = new Localizacao();
        String codigo = requerido(m, "codigo_posicao", erros, "Código da posição");
        String tipo = requerido(m, "tipo_armazenamento", erros, "Tipo de armazenamento");
        if (!codigo.isEmpty() && !codigo.matches("[A-Z0-9]+-[0-9]{2}-[0-9]{2}")) {
            erros.add("Código da posição inválido. Use o formato A-01-02.");
        }
        l.setCodigoPosicao(codigo.toUpperCase(Locale.ROOT));
        l.setTipoArmazenamento(tipo);
        return l;
    }

    private NotaFiscal montarNotaFiscal(Map<String, String> m, List<String> erros) {
        NotaFiscal n = new NotaFiscal();
        String numero = requerido(m, "numero_nf", erros, "Número da NF");
        String serie = requerido(m, "serie", erros, "Série");
        String chave = requerido(m, "chave_acesso_nfe", erros, "Chave de acesso");
        String cnpj = requerido(m, "fornecedor_cnpj", erros, "fornecedor_cnpj");
        LocalDate emissao = lerData(m, "data_emissao", true, erros, "Data de emissão");
        BigDecimal valor = lerNumero(m, "valor_total", true, erros, "Valor total");
        if (!chave.isEmpty() && !chave.matches("\\d{44}")) {
            erros.add("Chave de acesso inválida. Deve conter 44 dígitos.");
        }
        if (valor != null && valor.compareTo(BigDecimal.ZERO) < 0) {
            erros.add("Valor total não pode ser negativo.");
        }
        Fornecedor fornecedor = cnpj.isEmpty() ? null : fornecedorRepository.findByCnpj(cnpj);
        if (fornecedor == null) {
            erros.add("fornecedor_cnpj não encontrado: " + cnpj + ". Cadastre o fornecedor antes.");
        }
        n.setNumeroNf(numero);
        n.setSerie(serie);
        n.setDataEmissao(emissao);
        n.setChaveAcessoNfe(chave);
        n.setValorTotal(valor);
        n.setIdFornecedor(fornecedor != null ? fornecedor.getIdFornecedor() : null);
        return n;
    }

    private Lote montarLote(Map<String, String> m, List<String> erros) {
        Lote lote = new Lote();
        String numero = requerido(m, "numero_lote", erros, "Número do lote");
        String sku = requerido(m, "produto_sku", erros, "produto_sku");
        LocalDate fabricacao = lerData(m, "data_fabricacao", true, erros, "Data de fabricação");
        LocalDate validade = lerData(m, "data_validade", true, erros, "Data de validade");
        if (!numero.isEmpty() && !numero.matches("[A-Z0-9\\-]+")) {
            erros.add("Número do lote inválido (use letras maiúsculas, números e hífen).");
        }
        if (fabricacao != null && validade != null && validade.isBefore(fabricacao)) {
            erros.add("Data de validade não pode ser anterior à fabricação.");
        }
        Produto produto = sku.isEmpty() ? null : produtoRepository.findBySku(sku);
        if (produto == null) {
            erros.add("produto_sku não encontrado: " + sku + ". Cadastre o produto antes.");
        }
        lote.setNumeroLote(numero.toUpperCase(Locale.ROOT));
        lote.setDataFabricacao(fabricacao);
        lote.setDataValidade(validade);
        lote.setIdProduto(produto != null ? produto.getIdProduto() : null);
        return lote;
    }

    private Recebimento montarRecebimento(Map<String, String> m, List<String> erros) {
        Recebimento r = new Recebimento();
        LocalDateTime chegada = lerDataHora(m, "data_hora_chegada", true, erros, "Data/hora de chegada");
        LocalDateTime inicio = lerDataHora(m, "data_hora_inicio_conferencia", false, erros, "Início da conferência");
        LocalDateTime fim = lerDataHora(m, "data_hora_fim_conferencia", false, erros, "Fim da conferência");

        String chaveNF = requerido(m, "nota_fiscal_chave", erros, "nota_fiscal_chave");
        NotaFiscal nota = chaveNF.isEmpty() ? null : notaFiscalRepository.findByChaveAcessoNfe(chaveNF);
        if (nota == null) {
            erros.add("nota_fiscal_chave não encontrada: " + chaveNF + ". Cadastre a NF antes.");
        }

        String matricula = opcional(m, "funcionario_matricula");
        if (!matricula.isEmpty()) {
            Funcionario func = funcionarioRepository.findByMatricula(matricula.toUpperCase(Locale.ROOT));
            if (func == null) {
                erros.add("funcionario_matricula não encontrada: " + matricula);
            } else {
                r.setIdFuncionario(func.getIdFuncionario());
            }
        }
        String cpfMotorista = opcional(m, "motorista_cpf");
        if (!cpfMotorista.isEmpty()) {
            Motorista mot = motoristaRepository.findByCpf(cpfMotorista);
            if (mot == null) {
                erros.add("motorista_cpf não encontrado: " + cpfMotorista);
            } else {
                r.setIdMotorista(mot.getIdMotorista());
            }
        }
        String placaVeiculo = opcional(m, "veiculo_placa");
        if (!placaVeiculo.isEmpty()) {
            Veiculo veh = veiculoRepository.findByPlaca(placaVeiculo.toUpperCase(Locale.ROOT));
            if (veh == null) {
                erros.add("veiculo_placa não encontrada: " + placaVeiculo);
            } else {
                r.setIdVeiculo(veh.getIdVeiculo());
            }
        }

        String status = opcional(m, "status_recebimento");
        r.setDataHoraChegada(chegada);
        r.setDataHoraInicioConferencia(inicio);
        r.setDataHoraFimConferencia(fim);
        r.setStatusRecebimento(status.isEmpty() ? null : status);
        r.setIdNotaFiscal(nota != null ? nota.getIdNotaFiscal() : null);
        return r;
    }

    private ItemRecebimento montarItemRecebimento(Map<String, String> m, List<String> erros) {
        ItemRecebimento item = new ItemRecebimento();
        BigDecimal declarada = lerNumero(m, "quantidade_declarada", true, erros, "Quantidade declarada");
        BigDecimal conferida = lerNumero(m, "quantidade_conferida", true, erros, "Quantidade conferida");
        if (declarada != null && declarada.compareTo(BigDecimal.ZERO) < 0) {
            erros.add("Quantidade declarada não pode ser negativa.");
        }
        if (conferida != null && conferida.compareTo(BigDecimal.ZERO) < 0) {
            erros.add("Quantidade conferida não pode ser negativa.");
        }

        String chaveNF = requerido(m, "nota_fiscal_chave", erros, "nota_fiscal_chave");
        NotaFiscal nota = chaveNF.isEmpty() ? null : notaFiscalRepository.findByChaveAcessoNfe(chaveNF);
        Integer idRecebimento = null;
        if (nota != null) {
            List<Recebimento> recebimentos = recebimentoRepository.findByIdNotaFiscal(nota.getIdNotaFiscal());
            if (recebimentos.isEmpty()) {
                erros.add("Não há recebimento para a nota fiscal " + chaveNF + ". Cadastre o recebimento antes.");
            } else if (recebimentos.size() > 1) {
                erros.add("Há mais de um recebimento para a nota " + chaveNF + ". Importe os itens individualmente.");
            } else {
                idRecebimento = recebimentos.get(0).getIdRecebimento();
            }
        }

        String numeroLote = requerido(m, "lote_numero", erros, "lote_numero");
        Lote lote = numeroLote.isEmpty() ? null : loteRepository.findByNumeroLote(numeroLote.toUpperCase(Locale.ROOT));
        if (lote == null) {
            erros.add("lote_numero não encontrado: " + numeroLote);
        }

        String codigoPosicao = requerido(m, "localizacao_codigo", erros, "localizacao_codigo");
        Localizacao local = codigoPosicao.isEmpty() ? null : localizacaoRepository.findByCodigoPosicao(codigoPosicao.toUpperCase(Locale.ROOT));
        if (local == null) {
            erros.add("localizacao_codigo não encontrado: " + codigoPosicao);
        }

        item.setQuantidadeDeclarada(declarada);
        item.setQuantidadeConferida(conferida);
        item.setIdRecebimento(idRecebimento);
        item.setIdLote(lote != null ? lote.getIdLote() : null);
        item.setIdLocalizacao(local != null ? local.getIdLocalizacao() : null);
        return item;
    }

    private Divergencia montarDivergencia(Map<String, String> m, List<String> erros) {
        Divergencia d = new Divergencia();
        String tipo = requerido(m, "tipo_divergencia", erros, "Tipo da divergência");
        BigDecimal quantidade = lerNumero(m, "quantidade_divergente", true, erros, "Quantidade divergente");
        if (!tipo.isEmpty() && !"falta".equalsIgnoreCase(tipo.trim())
                && !"sobra".equalsIgnoreCase(tipo.trim())
                && !"avaria".equalsIgnoreCase(tipo.trim())) {
            erros.add("Tipo da divergência deve ser falta, sobra ou avaria.");
        }
        if (quantidade != null && quantidade.compareTo(BigDecimal.ZERO) == 0) {
            erros.add("Quantidade divergente não pode ser zero.");
        }

        String chaveNF = requerido(m, "nota_fiscal_chave", erros, "nota_fiscal_chave");
        String numeroLote = requerido(m, "lote_numero", erros, "lote_numero");
        Integer idItem = resolverItemPorNotaELote(chaveNF, numeroLote, erros);
        d.setTipoDivergencia(tipo);
        d.setQuantidadeDivergente(quantidade);
        d.setObservacao(opcional(m, "observacao"));
        d.setIdItemRecebimento(idItem);
        return d;
    }

    private Integer resolverItemPorNotaELote(String chaveNF, String numeroLote, List<String> erros) {
        NotaFiscal nota = chaveNF.isEmpty() ? null : notaFiscalRepository.findByChaveAcessoNfe(chaveNF);
        Lote lote = numeroLote.isEmpty() ? null : loteRepository.findByNumeroLote(numeroLote.toUpperCase(Locale.ROOT));
        if (nota == null || lote == null) {
            return null;
        }
        List<Integer> candidatos = new ArrayList<>();
        for (Recebimento r : recebimentoRepository.findByIdNotaFiscal(nota.getIdNotaFiscal())) {
            for (ItemRecebimento it : itemRecebimentoRepository.findByIdRecebimentoAndIdLote(r.getIdRecebimento(), lote.getIdLote())) {
                candidatos.add(it.getIdItemRecebimento());
            }
        }
        if (candidatos.isEmpty()) {
            erros.add("Não há item de recebimento com essa nota fiscal e esse lote.");
            return null;
        }
        if (candidatos.size() > 1) {
            erros.add("Há mais de um item de recebimento para essa nota fiscal e lote.");
            return null;
        }
        return candidatos.get(0);
    }

    // ====================== DUPLICADOS ======================

    private String duplicadoNaBase(String entidade, Map<String, String> m) {
        switch (entidade) {
            case "produtos": {
                Produto p = montarProduto(m, new ArrayList<>());
                if (produtoRepository.findBySku(p.getSku()) != null) {
                    return "SKU já cadastrado: " + p.getSku();
                }
                if (produtoRepository.findByCodigoBarras(p.getCodigoBarras()) != null) {
                    return "Código de barras já cadastrada: " + p.getCodigoBarras();
                }
                return null;
            }
            case "fornecedores": {
                Fornecedor f = montarFornecedor(m, new ArrayList<>());
                Fornecedor existente = fornecedorRepository.findByCnpj(f.getCnpj());
                return existente != null ? "CNPJ já cadastrado: " + f.getCnpj() : null;
            }
            case "funcionarios": {
                Funcionario f = montarFuncionario(m, new ArrayList<>());
                return funcionarioRepository.findByMatricula(f.getMatricula()) != null
                        ? "Matrícula já cadastrada: " + f.getMatricula() : null;
            }
            case "motoristas": {
                Motorista mot = montarMotorista(m, new ArrayList<>());
                return motoristaRepository.findByCpf(mot.getCpf()) != null
                        ? "CPF já cadastrado: " + mot.getCpf() : null;
            }
            case "veiculos": {
                Veiculo v = montarVeiculo(m, new ArrayList<>());
                return veiculoRepository.findByPlaca(v.getPlaca()) != null
                        ? "Placa já cadastrada: " + v.getPlaca() : null;
            }
            case "localizacoes": {
                Localizacao l = montarLocalizacao(m, new ArrayList<>());
                return localizacaoRepository.findByCodigoPosicao(l.getCodigoPosicao()) != null
                        ? "Código da posição já cadastrado: " + l.getCodigoPosicao() : null;
            }
            case "notas_fiscais": {
                NotaFiscal n = montarNotaFiscal(m, new ArrayList<>());
                return notaFiscalRepository.findByChaveAcessoNfe(n.getChaveAcessoNfe()) != null
                        ? "Chave de acesso já cadastrada." : null;
            }
            case "lotes": {
                Lote l = montarLote(m, new ArrayList<>());
                return loteRepository.findByNumeroLote(l.getNumeroLote()) != null
                        ? "Número do lote já cadastrado: " + l.getNumeroLote() : null;
            }
            default:
                return null;
        }
    }

    // ====================== PERSISTÊNCIA ======================

    private void persistir(String entidade, Object obj) {
        switch (entidade) {
            case "produtos": produtoRepository.save((Produto) obj); break;
            case "fornecedores": fornecedorRepository.save((Fornecedor) obj); break;
            case "funcionarios": funcionarioRepository.save((Funcionario) obj); break;
            case "motoristas": motoristaRepository.save((Motorista) obj); break;
            case "veiculos": veiculoRepository.save((Veiculo) obj); break;
            case "localizacoes": localizacaoRepository.save((Localizacao) obj); break;
            case "notas_fiscais": notaFiscalRepository.save((NotaFiscal) obj); break;
            case "lotes": loteRepository.save((Lote) obj); break;
            case "recebimentos": recebimentoRepository.save((Recebimento) obj); break;
            case "itens_recebimento": itemRecebimentoRepository.save((ItemRecebimento) obj); break;
            case "divergencias": divergenciaRepository.save((Divergencia) obj); break;
            default: throw new IllegalArgumentException("Entidade desconhecida: " + entidade);
        }
    }

    // ====================== EXPORT ======================

    public String exportar(String entidade) {
        validarEntidade(entidade);
        List<List<String>> linhas = new ArrayList<>();
        linhas.add(Arrays.asList(COLUNAS_EXPORT.get(entidade)));

        switch (entidade) {
            case "produtos":
                for (Produto p : produtoRepository.findAll()) {
                    linhas.add(Arrays.asList(
                            str(p.getIdProduto()), n(p.getSku()), n(p.getCodigoBarras()),
                            n(p.getDescricao()), n(p.getUnidadeMedida()),
                            p.getStatusAtivo() == null ? "" : String.valueOf(p.getStatusAtivo())));
                }
                break;
            case "fornecedores":
                for (Fornecedor f : fornecedorRepository.findAll()) {
                    linhas.add(Arrays.asList(
                            str(f.getIdFornecedor()), n(f.getCnpj()),
                            n(f.getRazaoSocial()), n(f.getNomeFantasia())));
                }
                break;
            case "funcionarios":
                for (Funcionario f : funcionarioRepository.findAll()) {
                    linhas.add(Arrays.asList(
                            str(f.getIdFuncionario()), n(f.getMatricula()),
                            n(f.getNome()), n(f.getCargo())));
                }
                break;
            case "motoristas":
                for (Motorista m : motoristaRepository.findAll()) {
                    linhas.add(Arrays.asList(
                            str(m.getIdMotorista()), n(m.getCpf()),
                            n(m.getCnh()), n(m.getNome())));
                }
                break;
            case "veiculos":
                for (Veiculo v : veiculoRepository.findAll()) {
                    linhas.add(Arrays.asList(
                            str(v.getIdVeiculo()), n(v.getPlaca()), n(v.getTipoVeiculo()),
                            n(v.getMarcaModelo()), n(v.getTransportadora())));
                }
                break;
            case "localizacoes":
                for (Localizacao l : localizacaoRepository.findAll()) {
                    linhas.add(Arrays.asList(
                            str(l.getIdLocalizacao()), n(l.getCodigoPosicao()),
                            n(l.getTipoArmazenamento())));
                }
                break;
            case "notas_fiscais": {
                Map<Integer, String> cnpjPorFornecedor = mapaCnpjFornecedores();
                for (NotaFiscal nf : notaFiscalRepository.findAll()) {
                    linhas.add(Arrays.asList(
                            str(nf.getIdNotaFiscal()), n(nf.getNumeroNf()), n(nf.getSerie()),
                            nf.getDataEmissao() == null ? "" : DATA_BR.format(nf.getDataEmissao()),
                            n(nf.getChaveAcessoNfe()),
                            num(nf.getValorTotal()),
                            nf.getIdFornecedor() == null ? "" : cnpjPorFornecedor.getOrDefault(nf.getIdFornecedor(), "")));
                }
                break;
            }
            case "lotes": {
                Map<Integer, String> skuPorProduto = mapaSkuProdutos();
                for (Lote l : loteRepository.findAll()) {
                    linhas.add(Arrays.asList(
                            str(l.getIdLote()), n(l.getNumeroLote()),
                            l.getDataFabricacao() == null ? "" : DATA_BR.format(l.getDataFabricacao()),
                            l.getDataValidade() == null ? "" : DATA_BR.format(l.getDataValidade()),
                            l.getIdProduto() == null ? "" : skuPorProduto.getOrDefault(l.getIdProduto(), "")));
                }
                break;
            }
            case "recebimentos": {
                Map<Integer, String> chavePorNota = mapaChaveNotas();
                Map<Integer, String> matriculaPorFuncionario = mapaMatriculaFuncionarios();
                Map<Integer, String> cpfPorMotorista = mapaCpfMotoristas();
                Map<Integer, String> placaPorVeiculo = mapaPlacaVeiculos();
                for (Recebimento r : recebimentoRepository.findAll()) {
                    linhas.add(Arrays.asList(
                            str(r.getIdRecebimento()),
                            r.getDataHoraChegada() == null ? "" : DATA_HORA_BR.format(r.getDataHoraChegada()),
                            r.getDataHoraInicioConferencia() == null ? "" : DATA_HORA_BR.format(r.getDataHoraInicioConferencia()),
                            r.getDataHoraFimConferencia() == null ? "" : DATA_HORA_BR.format(r.getDataHoraFimConferencia()),
                            n(r.getStatusRecebimento()),
                            r.getIdNotaFiscal() == null ? "" : chavePorNota.getOrDefault(r.getIdNotaFiscal(), ""),
                            r.getIdFuncionario() == null ? "" : matriculaPorFuncionario.getOrDefault(r.getIdFuncionario(), ""),
                            r.getIdMotorista() == null ? "" : cpfPorMotorista.getOrDefault(r.getIdMotorista(), ""),
                            r.getIdVeiculo() == null ? "" : placaPorVeiculo.getOrDefault(r.getIdVeiculo(), "")));
                }
                break;
            }
            case "itens_recebimento": {
                Map<Integer, String> chavePorRecebimento = mapaChavePorRecebimento();
                Map<Integer, String> numeroPorLote = mapaNumeroLotes();
                Map<Integer, String> codigoPorLocalizacao = mapaCodigoLocalizacoes();
                for (ItemRecebimento it : itemRecebimentoRepository.findAll()) {
                    linhas.add(Arrays.asList(
                            str(it.getIdItemRecebimento()),
                            num(it.getQuantidadeDeclarada()),
                            num(it.getQuantidadeConferida()),
                            it.getIdRecebimento() == null ? "" : chavePorRecebimento.getOrDefault(it.getIdRecebimento(), ""),
                            it.getIdLote() == null ? "" : numeroPorLote.getOrDefault(it.getIdLote(), ""),
                            it.getIdLocalizacao() == null ? "" : codigoPorLocalizacao.getOrDefault(it.getIdLocalizacao(), "")));
                }
                break;
            }
            case "divergencias": {
                Map<Integer, Integer> recebimentoPorItem = new HashMap<>();
                Map<Integer, Integer> lotePorItem = new HashMap<>();
                for (ItemRecebimento it : itemRecebimentoRepository.findAll()) {
                    recebimentoPorItem.put(it.getIdItemRecebimento(), it.getIdRecebimento());
                    lotePorItem.put(it.getIdItemRecebimento(), it.getIdLote());
                }
                Map<Integer, String> chavePorRecebimento = mapaChavePorRecebimento();
                Map<Integer, String> numeroPorLote = mapaNumeroLotes();
                for (Divergencia d : divergenciaRepository.findAll()) {
                    linhas.add(Arrays.asList(
                            str(d.getIdDivergencia()),
                            n(d.getTipoDivergencia()),
                            num(d.getQuantidadeDivergente()),
                            n(d.getObservacao()),
                            d.getIdItemRecebimento() == null ? "" : chavePorRecebimento.getOrDefault(recebimentoPorItem.get(d.getIdItemRecebimento()), ""),
                            d.getIdItemRecebimento() == null ? "" : numeroPorLote.getOrDefault(lotePorItem.get(d.getIdItemRecebimento()), "")));
                }
                break;
            }
            default:
                break;
        }

        StringBuilder sb = new StringBuilder();
        for (List<String> linha : linhas) {
            sb.append(CsvUtil.montarLinha(linha, ',')).append("\r\n");
        }
        return sb.toString();
    }

    private static String n(String v) {
        return v == null ? "" : v;
    }

    private static String str(Integer v) {
        return v == null ? "" : String.valueOf(v);
    }

    private static String num(BigDecimal v) {
        return v == null ? "" : v.toPlainString();
    }

    private Map<Integer, String> mapaCnpjFornecedores() {
        Map<Integer, String> mapa = new HashMap<>();
        for (Fornecedor f : fornecedorRepository.findAll()) {
            mapa.put(f.getIdFornecedor(), n(f.getCnpj()));
        }
        return mapa;
    }

    private Map<Integer, String> mapaSkuProdutos() {
        Map<Integer, String> mapa = new HashMap<>();
        for (Produto p : produtoRepository.findAll()) {
            mapa.put(p.getIdProduto(), n(p.getSku()));
        }
        return mapa;
    }

    private Map<Integer, String> mapaChaveNotas() {
        Map<Integer, String> mapa = new HashMap<>();
        for (NotaFiscal nf : notaFiscalRepository.findAll()) {
            mapa.put(nf.getIdNotaFiscal(), n(nf.getChaveAcessoNfe()));
        }
        return mapa;
    }

    private Map<Integer, String> mapaMatriculaFuncionarios() {
        Map<Integer, String> mapa = new HashMap<>();
        for (Funcionario f : funcionarioRepository.findAll()) {
            mapa.put(f.getIdFuncionario(), n(f.getMatricula()));
        }
        return mapa;
    }

    private Map<Integer, String> mapaCpfMotoristas() {
        Map<Integer, String> mapa = new HashMap<>();
        for (Motorista m : motoristaRepository.findAll()) {
            mapa.put(m.getIdMotorista(), n(m.getCpf()));
        }
        return mapa;
    }

    private Map<Integer, String> mapaPlacaVeiculos() {
        Map<Integer, String> mapa = new HashMap<>();
        for (Veiculo v : veiculoRepository.findAll()) {
            mapa.put(v.getIdVeiculo(), n(v.getPlaca()));
        }
        return mapa;
    }

    private Map<Integer, String> mapaNumeroLotes() {
        Map<Integer, String> mapa = new HashMap<>();
        for (Lote l : loteRepository.findAll()) {
            mapa.put(l.getIdLote(), n(l.getNumeroLote()));
        }
        return mapa;
    }

    private Map<Integer, String> mapaCodigoLocalizacoes() {
        Map<Integer, String> mapa = new HashMap<>();
        for (Localizacao l : localizacaoRepository.findAll()) {
            mapa.put(l.getIdLocalizacao(), n(l.getCodigoPosicao()));
        }
        return mapa;
    }

    private Map<Integer, String> mapaChavePorRecebimento() {
        Map<Integer, String> chavePorNota = mapaChaveNotas();
        Map<Integer, String> mapa = new HashMap<>();
        for (Recebimento r : recebimentoRepository.findAll()) {
            if (r.getIdNotaFiscal() != null) {
                mapa.put(r.getIdRecebimento(), chavePorNota.getOrDefault(r.getIdNotaFiscal(), ""));
            }
        }
        return mapa;
    }
}