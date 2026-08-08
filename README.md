# Sistema de Estoque Mercado

Documentação completa do projeto **Sistema de Estoque Mercado** — uma aplicação fullstack para gestão de estoque e recebimento de mercadorias em supermercados.

---

## Sobre o Projeto

O **Sistema de Estoque Mercado** é uma aplicação web desenvolvida para gerenciar o fluxo de recebimento de mercadorias, controle de estoque, fornecedores, funcionários, veículos, motoristas e divergências em um ambiente de supermercado.

A aplicação é composta por:

- **Backend**: API REST construída com **Spring Boot 3.4.2** e **Java 21**, persistência com **PostgreSQL** (hospedado no **Neon**).
- **Frontend**: SPA construída com **Next.js 16** (App Router), **React 19**, **TypeScript** e **Tailwind CSS v4**.

---

## Arquitetura

```
┌─────────────────┐      HTTP/REST      ┌─────────────────┐
│                 │  ──────────────────▶│                 │
│   Frontend      │                     │   Backend       │
│   Next.js       │ ◀────────────────── │   Spring Boot   │
│   (porta 3000)  │                     │   (porta 8080)  │
│                 │                     │                 │
└─────────────────┘                     └────────┬────────┘
                                                 │
                                                 │ JDBC
                                                 ▼
                                        ┌─────────────────┐
                                        │   PostgreSQL    │
                                        │   (Neon Cloud)  │
                                        └─────────────────┘
```

### Padrão Arquitetural (Backend)

O backend segue o padrão **MVC (Model-View-Controller)** simplificado com camadas adicionais:

- **Model**: Entidades JPA (`@Entity`) que representam as tabelas do banco.
- **Repository**: Interfaces `JpaRepository` para acesso a dados.
- **Service**: Camada de regra de negócio.
- **Controller**: Endpoints REST (`@RestController`).
- **Config**: Configurações globais, como o `GlobalExceptionHandler`.

### Padrão Arquitetural (Frontend)

- **App Router** do Next.js 16 para roteamento.
- **Services**: Camada de abstração para chamadas HTTP (axios).
- **Types**: Interfaces TypeScript que espelham os models do backend.
- **Components**: Componentes reutilizáveis (ex: `Sidebar`).
- **Pages**: Páginas organizadas por entidade/módulo.

---

## Estrutura de Arquivos

```
ProjetoSistemaDeEstoqueMercado/
├── DiagramaCompleto.png
├── DiagramaDER.png
├── .git/
├── .kilo/
├── .vscode/
└── SistemaEstoqueMercado/
    ├── .env
    ├── .gitignore
    ├── Neon/                         # Pasta reservada para scripts/snapshot do Neon
    ├── backend/                      # API Spring Boot
    │   ├── pom.xml
    │   ├── .vscode/
    │   ├── src/
    │   │   ├── main/
    │   │   │   ├── java/j0aod3v/sistemaestoquemercado/
    │   │   │   │   ├── App.java
    │   │   │   │   ├── TestDatabase.java
    │   │   │   │   ├── config/
    │   │   │   │   │   └── GlobalExceptionHandler.java
    │   │   │   │   ├── controller/
    │   │   │   │   │   ├── ProdutoController.java
    │   │   │   │   │   ├── FornecedorController.java
    │   │   │   │   │   ├── RecebimentoController.java
    │   │   │   │   │   ├── DivergenciaController.java
    │   │   │   │   │   ├── FuncionarioController.java
    │   │   │   │   │   ├── LoteController.java
    │   │   │   │   │   ├── NotaFiscalController.java
    │   │   │   │   │   ├── MotoristaController.java
    │   │   │   │   │   ├── VeiculoController.java
    │   │   │   │   │   └── LocalizacaoController.java
    │   │   │   │   ├── database/
    │   │   │   │   │   └── Database.java
    │   │   │   │   ├── model/
    │   │   │   │   │   ├── Produto.java
    │   │   │   │   │   ├── Fornecedor.java
    │   │   │   │   │   ├── Recebimento.java
    │   │   │   │   │   ├── Divergencia.java
    │   │   │   │   │   ├── Funcionario.java
    │   │   │   │   │   ├── Lote.java
    │   │   │   │   │   ├── NotaFiscal.java
    │   │   │   │   │   ├── Motorista.java
    │   │   │   │   │   ├── Veiculo.java
    │   │   │   │   │   └── Localizacao.java
    │   │   │   │   ├── repository/
    │   │   │   │   │   ├── ProdutoRepository.java
    │   │   │   │   │   ├── FornecedorRepository.java
    │   │   │   │   │   ├── RecebimentoRepository.java
    │   │   │   │   │   ├── DivergenciaRepository.java
    │   │   │   │   │   ├── FuncionarioRepository.java
    │   │   │   │   │   ├── LoteRepository.java
    │   │   │   │   │   ├── NotaFiscalRepository.java
    │   │   │   │   │   ├── MotoristaRepository.java
    │   │   │   │   │   ├── VeiculoRepository.java
    │   │   │   │   │   └── LocalizacaoRepository.java
    │   │   │   │   └── service/
    │   │   │   │       ├── ProdutoService.java
    │   │   │   │       ├── FornecedorService.java
    │   │   │   │       ├── RecebimentoService.java
    │   │   │   │       ├── DivergenciaService.java
    │   │   │   │       ├── FuncionarioService.java
    │   │   │   │       ├── LoteService.java
    │   │   │   │       ├── NotaFiscalService.java
    │   │   │   │       ├── MotoristaService.java
    │   │   │   │       ├── VeiculoService.java
    │   │   │   │       └── LocalizacaoService.java
    │   │   │   └── resources/
    │   │   │       └── application.properties
    │   │   └── test/java/j0aod3v/sistemaestoquemercado/   # (vazio)
    │   └── target/                    # Build artifacts (Maven)
    │       ├── classes/
    │       └── test-classes/
    └── frontend/                      # Next.js Frontend
        ├── package.json
        ├── package-lock.json
        ├── tsconfig.json
        ├── tsconfig.tsbuildinfo
        ├── next.config.ts
        ├── next-env.d.ts
        ├── eslint.config.mjs
        ├── postcss.config.mjs
        ├── .gitignore
        ├── AGENTS.md
        ├── CLAUDE.md
        ├── README.md
        ├── app/
        │   ├── layout.tsx
        │   ├── page.tsx
        │   ├── globals.css
        │   ├── favicon.ico
        │   ├── produtos/page.tsx
        │   ├── fornecedores/page.tsx
        │   ├── funcionarios/page.tsx
        │   ├── lotes/page.tsx
        │   ├── notas-fiscais/page.tsx
        │   ├── recebimentos/page.tsx
        │   ├── itens-recebimento/page.tsx
        │   ├── motoristas/page.tsx
        │   ├── veiculos/page.tsx
        │   ├── localizacoes/page.tsx
        │   └── divergencias/page.tsx
        ├── components/
        │   └── Sidebar.tsx
        ├── services/
        │   ├── api.ts
        │   ├── produtoService.ts
        │   ├── fornecedorService.ts
        │   ├── recebimentoService.ts
        │   ├── divergenciaService.ts
        │   ├── funcionarioService.ts
        │   ├── itemRecebimentoService.ts
        │   ├── localizacaoService.ts
        │   ├── loteService.ts
        │   ├── motoristaService.ts
        │   ├── notaFiscalService.ts
        │   └── veiculoService.ts
        ├── types/
        │   ├── index.ts
        │   ├── Produto.ts
        │   ├── Fornecedor.ts
        │   ├── Recebimento.ts
        │   ├── Divergencia.ts
        │   ├── Funcionario.ts
        │   ├── Lote.ts
        │   ├── NotaFiscal.ts
        │   ├── Motorista.ts
        │   ├── Veiculo.ts
        │   ├── Localizacao.ts
        │   └── ItemRecebimento.ts
        ├── public/                       # Assets estáticos (SVGs padrão)
        ├── .next/                        # Build artifacts (Next.js)
        └── node_modules/                 # Dependencies
```

---

## Entidades do Banco de Dados

O banco de dados é um **PostgreSQL** hospedado no **Neon** (`neondb`). As entidades mapeadas são:

### Produtos
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id_produto` | Integer (PK) | Identificador único |
| `sku` | String | Código SKU do produto |
| `codigo_barras` | String | Código de barras EAN/UPC |
| `descricao` | String | Descrição do produto |
| `unidade_medida` | String | UN, KG, CX, LT |
| `status_ativo` | Boolean | Produto ativo para venda |

### Fornecedores
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id_fornecedor` | Integer (PK) | Identificador único |
| `cnpj` | String | CNPJ do fornecedor |
| `razao_social` | String | Razão social |
| `nome_fantasia` | String | Nome fantasia |

### Funcionários
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id_funcionario` | Integer (PK) | Identificador único |
| `nome` | String | Nome completo |
| `cargo` | String | Cargo/função |
| `cpf` | String | CPF |

### Veículos
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id_veiculo` | Integer (PK) | Identificador único |
| `placa` | String | Placa do veículo |
| `tipo` | String | Tipo de veículo |
| `marca` | String | Marca |
| `capacidade` | String | Capacidade de carga |

### Motoristas
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id_motorista` | Integer (PK) | Identificador único |
| `nome` | String | Nome completo |
| `cnh` | String | Número da CNH |
| `cnh_categoria` | String | Categoria da CNH |

### Lotes
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id_lote` | Integer (PK) | Identificador único |
| `codigo_lote` | String | Código do lote |
| `data_fabricacao` | Date | Data de fabricação |
| `data_validade` | Date | Data de validade |

### Notas Fiscais
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id_nota_fiscal` | Integer (PK) | Identificador único |
| `numero` | String | Número da NF |
| `serie` | String | Série |
| `data_emissao` | Date | Data de emissão |
| `valor_total` | BigDecimal | Valor total da NF |

### Recebimentos
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id_recebimento` | Integer (PK) | Identificador único |
| `data_hora_chegada` | LocalDateTime | Data/hora de chegada |
| `data_hora_inicio_conferencia` | LocalDateTime | Início da conferência |
| `data_hora_fim_conferencia` | LocalDateTime | Fim da conferência |
| `status_recebimento` | String | Status (ex: EM_CONFERENCIA, CONCLUIDO) |
| `id_nota_fiscal` | Integer (FK) | Referência à nota fiscal |
| `id_funcionario` | Integer (FK) | Referência ao funcionário conferente |
| `id_motorista` | Integer (FK) | Referência ao motorista |
| `id_veiculo` | Integer (FK) | Referência ao veículo |

### Itens de Recebimento
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id_item_recebimento` | Integer (PK) | Identificador único |
| `id_recebimento` | Integer (FK) | Referência ao recebimento |
| `id_produto` | Integer (FK) | Referência ao produto |
| `id_lote` | Integer (FK) | Referência ao lote |
| `quantidade_esperada` | BigDecimal | Quantidade esperada pela NF |
| `quantidade_recebida` | BigDecimal | Quantidade fisicamente recebida |

### Divergências
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id_divergencia` | Integer (PK) | Identificador único |
| `tipo_divergencia` | String | Tipo da divergência |
| `quantidade_divergente` | BigDecimal | Quantidade divergente |
| `observacao` | String | Observações |
| `id_item_recebimento` | Integer (FK) | Referência ao item de recebimento |

### Localizações
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id_localizacao` | Integer (PK) | Identificador único |
| `codigo` | String | Código da localização (ex: CORREDOR-A-01) |
| `descricao` | String | Descrição do local |
| `tipo` | String | Tipo de local |

---

## API REST — Endpoints

Base URL: `http://localhost:8080/api`

CORS está configurado para aceitar requisições de qualquer origem (`@CrossOrigin(origins = "*")`).

### Produtos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/produtos` | Listar todos os produtos |
| GET | `/api/produtos/{id}` | Buscar produto por ID |
| POST | `/api/produtos` | Cadastrar novo produto |
| PUT | `/api/produtos/{id}` | Atualizar produto |
| DELETE | `/api/produtos/{id}` | Excluir produto |

### Fornecedores
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/fornecedores` | Listar todos |
| GET | `/api/fornecedores/{id}` | Buscar por ID |
| POST | `/api/fornecedores` | Cadastrar |
| PUT | `/api/fornecedores/{id}` | Atualizar |
| DELETE | `/api/fornecedores/{id}` | Excluir |

### Recebimentos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/recebimentos` | Listar todos |
| GET | `/api/recebimentos/{id}` | Buscar por ID |
| POST | `/api/recebimentos` | Cadastrar |
| PUT | `/api/recebimentos/{id}` | Atualizar |
| DELETE | `/api/recebimentos/{id}` | Excluir |

### Divergências
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/divergencias` | Listar todas |
| GET | `/api/divergencias/{id}` | Buscar por ID |
| POST | `/api/divergencias` | Cadastrar |
| PUT | `/api/divergencias/{id}` | Atualizar |
| DELETE | `/api/divergencias/{id}` | Excluir |

### Funcionários, Lotes, Notas Fiscais, Motoristas, Veículos, Localizações, Itens de Recebimento
Seguem o mesmo padrão CRUD com endpoints em `/api/{entidade}`.

---

## Frontend — Páginas e Funcionalidades

O frontend é uma aplicação **Next.js 16** com **App Router**, **TypeScript** e **Tailwind CSS v4**.

### Layout
- **Sidebar**: Navegação lateral com todos os módulos (Dashboard, Produtos, Fornecedores, Funcionários, Lotes, Notas Fiscais, Recebimentos, Itens Recebimento, Motoristas, Veículos, Localizações, Divergências).
- **Tema**: Dark mode com paleta de cores customizada via CSS variables (`globals.css`).

### Módulos Implementados

| Página | Rota | Funcionalidades |
|--------|------|-----------------|
| Dashboard | `/` | Visão geral com estatísticas, atividades recentes e ações rápidas |
| Produtos | `/produtos` | CRUD completo — cadastro, edição inline, exclusão, busca por SKU/código de barras |
| Fornecedores | `/fornecedores` | CRUD completo com CNPJ, razão social e nome fantasia |
| Recebimentos | `/recebimentos` | CRUD completo com datas de chegada, conferência e status |
| Divergências | `/divergencias` | CRUD completo com tipo, quantidade divergente e observações |
| Funcionários | `/funcionarios` | CRUD completo |
| Lotes | `/lotes` | CRUD completo com datas de fabricação e validade |
| Notas Fiscais | `/notas-fiscais` | CRUD completo |
| Motoristas | `/motoristas` | CRUD completo |
| Veículos | `/veiculos` | CRUD completo |
| Localizações | `/localizacoes` | CRUD completo |
| Itens Recebimento | `/itens-recebimento` | CRUD completo |

### Serviços (Frontend)

Cada entidade possui um service dedicado que abstrai as chamadas HTTP:

- `api.ts` — Instância Axios base configurada com `baseURL`
- `produtoService.ts`
- `fornecedorService.ts`
- `recebimentoService.ts`
- `divergenciaService.ts`
- `funcionarioService.ts`
- `itemRecebimentoService.ts`
- `localizacaoService.ts`
- `loteService.ts`
- `motoristaService.ts`
- `notaFiscalService.ts`
- `veiculoService.ts`

### Tipos TypeScript

Todos os tipos estão em `frontend/types/` e correspondem exatamente aos models do backend:

- `Produto.ts`, `Fornecedor.ts`, `Recebimento.ts`, `Divergencia.ts`, `Funcionario.ts`, `Lote.ts`, `NotaFiscal.ts`, `Motorista.ts`, `Veiculo.ts`, `Localizacao.ts`, `ItemRecebimento.ts`

---

## Tecnologias Utilizadas

### Backend
- **Java 21**
- **Spring Boot 3.4.2**
- **Spring Web** — Endpoints REST
- **Spring Data JPA** — Persistência
- **PostgreSQL Driver 42.7.7** — Conexão com Neon
- **dotenv-java 3.2.0** — Leitura de variáveis de ambiente
- **Maven** — Gerenciamento de dependências e build
- **Jakarta Persistence** — Anotações JPA

### Frontend
- **Next.js 16.3.0**
- **React 19.2.8**
- **TypeScript 5**
- **Tailwind CSS v4**
- **Axios 1.19** — Cliente HTTP
- **Lucide React 1.30** — Ícones
- **ESLint 9** — Linting

### Banco de Dados
- **PostgreSQL** (hospedado no **Neon.tech**)
- Banco: `neondb`
- Região: `sa-east-1` (AWS)

---

## Configuração e Execução

### Pré-requisitos
- **Java 21** (JDK)
- **Maven 3.8+**
- **Node.js 18+** e **npm**
- Conta no **Neon.tech** com banco PostgreSQL provisionado

### Backend

```bash
cd SistemaEstoqueMercado/backend

# Compilar e executar
mvn spring-boot:run

# A aplicação sobe na porta 8080
```

Variáveis de ambiente esperadas no arquivo `.env` (na raiz do projeto `SistemaEstoqueMercado/`):
- `SPRING_DATASOURCE_URL`
- `PGHOST`
- `PGPORT`
- `PGDATABASE`
- `PGUSER`
- `PGPASSWORD`

### Frontend

```bash
cd SistemaEstoqueMercado/frontend

# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm run start
```

O frontend roda em `http://localhost:3000` e se comunica com a API em `http://localhost:8080/api` (configurável via `NEXT_PUBLIC_API_URL`).

---

## Convenções do Código

### Backend
- Pacotes organizados por domínio (`controller`, `service`, `repository`, `model`, `config`).
- Entidades usam `Jakarta Persistence` (`jakarta.persistence.*`).
- Services seguem injeção de dependência via construtor.
- Controllers usam `@CrossOrigin(origins = "*")` para permitir CORS.
- Tratamento global de exceções via `@RestControllerAdvice`.

### Frontend
- Nomenclatura de arquivos em `camelCase` para services e `PascalCase` para tipos.
- Páginas são components client (`'use client'`) quando há estado/interatividade.
- Uso de `useCallback` para funções de carregamento de dados.
- Ícones da biblioteca `lucide-react`.
- Componentes funcionais com Hooks do React.

---

## Diagramas

- `DiagramaDER.png` — Diagrama Entidade-Relacionamento do banco de dados.
- `DiagramaCompleto.png` — Diagrama completo da arquitetura/ sistema.

---

## Status do Projeto

O projeto está em **desenvolvimento ativo**. Todos os módulos CRUD básicos estão implementados tanto no backend quanto no frontend.

### Módulos Backend (Controllers + Services + Repositories + Models)
- [x] Produtos
- [x] Fornecedores
- [x] Recebimentos
- [x] Divergências
- [x] Funcionários
- [x] Lotes
- [x] Notas Fiscais
- [x] Motoristas
- [x] Veículos
- [x] Localizações
- [x] Itens de Recebimento

### Módulos Frontend (Pages + Services + Types)
- [x] Dashboard
- [x] Produtos
- [x] Fornecedores
- [x] Recebimentos
- [x] Divergências
- [x] Funcionários
- [x] Lotes
- [x] Notas Fiscais
- [x] Motoristas
- [x] Veículos
- [x] Localizações
- [x] Itens de Recebimento

### Melhorias Futuras Sugeridas
- Autenticação e autorização de usuários (Spring Security + JWT)
- Paginação e filtros nas listagens
- Upload de arquivos para imagens de produtos
- Relatórios e exportação (PDF/Excel)
- Testes unitários e de integração
- Validação de DTOs com Jakarta Validation
- Dockerização da aplicação
