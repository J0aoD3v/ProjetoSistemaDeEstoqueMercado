'use client';

import { useEffect, useState } from 'react';
import {
  Download,
  Upload,
  FileSpreadsheet,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  ArrowRight,
  Info,
} from 'lucide-react';
import { dadosService } from '@/services/dadosService';
import type {
  EntidadeMeta,
  ResultadoImportacao,
  ResumoExportacao,
  ValidacaoImportacao,
} from '@/types/Dados';

type Aba = 'importar' | 'exportar';

function mensagemErro(e: unknown): string {
  const erro = e as { response?: { data?: { mensagem?: string } | string }; message?: string };
  const dados = erro?.response?.data;
  if (typeof dados === 'string' && dados.trim()) return dados;
  if (typeof dados === 'object' && dados !== null && typeof dados.mensagem === 'string') return dados.mensagem;
  return erro?.message || 'Ocorreu um erro inesperado.';
}

function parseCsvLite(texto: string): { cabecalho: string[]; linhas: string[][] } {
  const linhas = texto
    .replace(/\r/g, '')
    .split('\n')
    .filter((l) => l.trim().length > 0);
  if (linhas.length === 0) return { cabecalho: [], linhas: [] };
  const primeira = linhas[0];
  const sep =
    (primeira.match(/;/g) || []).length > (primeira.match(/,/g) || []).length ? ';' : ',';
  return {
    cabecalho: primeira.split(sep).map((s) => s.trim()),
    linhas: linhas.slice(1).map((l) => l.split(sep).map((s) => s.trim())),
  };
}

function CardResumo({
  rotulo,
  valor,
  cor,
}: {
  rotulo: string;
  valor: number;
  cor: 'verde' | 'vermelho' | 'amarelo' | 'neutro';
}) {
  const cores = {
    verde: 'text-accent',
    vermelho: 'text-danger',
    amarelo: 'text-warning',
    neutro: 'text-foreground',
  } as const;
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-background p-4">
      <span className="text-xs font-medium text-muted">{rotulo}</span>
      <span className={`text-2xl font-bold ${cores[cor]}`}>{valor}</span>
    </div>
  );
}

export default function DadosPage() {
  const [entidades, setEntidades] = useState<EntidadeMeta[]>([]);
  const [carregandoEntidades, setCarregandoEntidades] = useState(true);
  const [aba, setAba] = useState<Aba>('importar');

  const [entidade, setEntidade] = useState<EntidadeMeta | null>(null);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<{ cabecalho: string[]; linhas: string[][] } | null>(null);
  const [validacao, setValidacao] = useState<ValidacaoImportacao | null>(null);
  const [resultado, setResultado] = useState<ResultadoImportacao | null>(null);
  const [validando, setValidando] = useState(false);
  const [importando, setImportando] = useState(false);
  const [erro, setErro] = useState('');

  const [resumoExport, setResumoExport] = useState<ResumoExportacao | null>(null);
  const [exportando, setExportando] = useState(false);

  useEffect(() => {
    dadosService
      .obterEntidades()
      .then(setEntidades)
      .catch((e) => setErro(mensagemErro(e)))
      .finally(() => setCarregandoEntidades(false));
  }, []);

  function selecionarEntidade(e: EntidadeMeta) {
    setEntidade(e);
    setArquivo(null);
    setPreview(null);
    setValidacao(null);
    setResultado(null);
    setErro('');
    setResumoExport(null);
    if (aba === 'exportar') {
      void verResumo(e.chave);
    }
  }

  function aoEscolherArquivo(f: File | null) {
    setArquivo(f);
    setPreview(null);
    setValidacao(null);
    setResultado(null);
    setErro('');
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(parseCsvLite(typeof reader.result === 'string' ? reader.result : ''));
    };
    reader.readAsText(f);
  }

  async function validarArquivo() {
    if (!entidade || !arquivo) return;
    setValidando(true);
    setErro('');
    try {
      setValidacao(await dadosService.validarImportacao(entidade.chave, arquivo));
    } catch (e) {
      setErro(mensagemErro(e));
    } finally {
      setValidando(false);
    }
  }

  async function confirmarImportacao() {
    if (!entidade || !arquivo) return;
    setImportando(true);
    setErro('');
    try {
      setResultado(await dadosService.importar(entidade.chave, arquivo));
    } catch (e) {
      setErro(mensagemErro(e));
    } finally {
      setImportando(false);
    }
  }

  async function verResumo(chave: string) {
    setErro('');
    try {
      setResumoExport(await dadosService.resumoExportacao(chave));
    } catch (e) {
      setErro(mensagemErro(e));
    }
  }

  async function baixarExportacao() {
    if (!entidade) return;
    setExportando(true);
    setErro('');
    try {
      await dadosService.exportarCSV(entidade.chave);
    } catch (e) {
      setErro(mensagemErro(e));
    } finally {
      setExportando(false);
    }
  }

  const renderSeletor = (
    <section className="rounded-xl border border-border bg-background p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold">1. Escolha a tabela</h2>
      {carregandoEntidades ? (
        <p className="flex items-center gap-2 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" /> Carregando entidades...
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {entidades.map((e) => (
            <button
              key={e.chave}
              onClick={() => selecionarEntidade(e)}
              className={`flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-colors ${
                entidade?.chave === e.chave
                  ? 'border-accent bg-accent/10'
                  : 'border-border bg-background hover:bg-surface-hover'
              }`}
            >
              <span className="text-sm font-semibold">{e.rotulo}</span>
              <span className="text-xs text-muted">{e.totalRegistros} registro(s)</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );

  const renderColunas = entidade ? (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-border bg-surface text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="p-3">Coluna</th>
            <th className="p-3">Rótulo</th>
            <th className="p-3">Tipo</th>
            <th className="p-3">Obrigatório</th>
            <th className="p-3">Exemplo</th>
            <th className="p-3">Descrição</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {entidade.colunas.map((c) => (
            <tr key={c.coluna} className="hover:bg-surface/50">
              <td className="p-3 font-mono text-xs">{c.coluna}</td>
              <td className="p-3">{c.rotulo}</td>
              <td className="p-3 text-xs text-muted">{c.tipo}</td>
              <td className="p-3">
                {c.obrigatorio ? (
                  <span className="font-medium text-danger">Sim</span>
                ) : (
                  <span className="text-muted">Não</span>
                )}
              </td>
              <td className="p-3 font-mono text-xs">{c.exemplo}</td>
              <td className="p-3 text-xs text-muted">{c.descricao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : null;

  const renderImportar = entidade ? (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-background p-6 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
          <Info className="h-5 w-5 text-accent" /> Padrão do arquivo
        </h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
          <li>
            Arquivo <b>.csv</b> com <b>cabeçalho</b> na primeira linha. Separador <b>,</b> ou <b>;</b>{" "}
            (detectado automaticamente).
          </li>
          <li>
            Datas em <b>dd/MM/aaaa</b>; data e hora em <b>dd/MM/aaaa HH:mm</b>. Decimais com <b>ponto</b>{" "}
            (ex.: 12.50).
          </li>
          <li>
            Não envie a coluna <b>id</b> — ela é ignorada. Os IDs são gerados pelo sistema.
          </li>
          <li>
            Registros com chave já existente (SKU, CNPJ, matrícula, chave da NF etc.) são tratados
            como <b>duplicados</b> e ignorados.
          </li>
          <li>
            Registros inválidos são <b>rejeitados</b> com mensagem na pré-visualização. Nada é gravado
            sem a sua confirmação.
          </li>
        </ul>
        <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-muted">
          Colunas suportadas
        </p>
        {renderColunas}
      </section>

      <section className="rounded-xl border border-border bg-background p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">2. Selecione o arquivo</h2>
        <label
          htmlFor="arquivo-csv"
          className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-border p-8 text-center transition-colors hover:border-accent"
        >
          <FileSpreadsheet className="h-8 w-8 text-accent" />
          <span className="text-sm font-medium">Clique para escolher o arquivo .csv</span>
          <span className="text-xs text-muted">Somente arquivos CSV são aceitos</span>
        </label>
        <input
          id="arquivo-csv"
          type="file"
          accept=".csv,text/csv"
          className="sr-only"
          onChange={(e) => aoEscolherArquivo(e.target.files?.[0] ?? null)}
        />
        {arquivo && (
          <div className="mt-3 flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm">
            <span className="truncate font-medium">{arquivo.name}</span>
            <button
              type="button"
              onClick={() => aoEscolherArquivo(null)}
              aria-label="Remover arquivo"
              className="ml-3 text-muted hover:text-danger"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {arquivo && !validacao && (
          <button
            onClick={validarArquivo}
            disabled={validando}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {validando ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            Validar e pré-visualizar
          </button>
        )}
      </section>

      {validacao && (
        <section className="space-y-4 rounded-xl border border-border bg-background p-6 shadow-sm">
          <h2 className="text-lg font-bold">3. Pré-visualização e validação</h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <CardResumo rotulo="Linhas de dados" valor={validacao.totalLinhas} cor="neutro" />
            <CardResumo rotulo="Prontos p/ importar" valor={validacao.registrosValidos} cor="verde" />
            <CardResumo
              rotulo="Com erro"
              valor={validacao.registrosComErro}
              cor={validacao.registrosComErro > 0 ? 'vermelho' : 'verde'}
            />
            <CardResumo
              rotulo="Duplicados"
              valor={validacao.registrosDuplicados}
              cor={validacao.registrosDuplicados > 0 ? 'amarelo' : 'verde'}
            />
          </div>

          {preview && preview.cabecalho.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium text-muted">Exibindo as 5 primeiras linhas do arquivo:</p>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-[400px] text-left text-xs">
                  <thead className="border-b border-border bg-surface text-muted">
                    <tr>
                      {preview.cabecalho.map((h) => (
                        <th key={h} className="p-2 font-mono">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {preview.linhas.map((linha, i) => (
                      <tr key={i} className="hover:bg-surface/50">
                        {linha.map((celula, j) => (
                          <td key={j} className="p-2">
                            {celula || '\u00A0'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {validacao.erros.length > 0 && (
            <div className="rounded-lg border border-danger/30 bg-danger/5 p-3">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-danger">
                <XCircle className="h-4 w-4" /> Erros encontrados ({validacao.erros.length})
              </p>
              <ul className="max-h-44 list-disc space-y-1 overflow-y-auto pl-5 text-xs text-muted">
                {validacao.erros.map((erroLinha, i) => (
                  <li key={i}>
                    <b>Linha {erroLinha.linha}:</b> {erroLinha.mensagem}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {validacao.duplicidades.length > 0 && (
            <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-warning">
                <AlertTriangle className="h-4 w-4" /> Registros duplicados ({validacao.duplicidades.length})
              </p>
              <ul className="max-h-44 list-disc space-y-1 overflow-y-auto pl-5 text-xs text-muted">
                {validacao.duplicidades.map((dup, i) => (
                  <li key={i}>
                    <b>Linha {dup.linha}:</b> {dup.mensagem}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end border-t border-border pt-4">
            <button
              onClick={confirmarImportacao}
              disabled={validacao.registrosValidos === 0 || importando}
              className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {importando ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Confirmar importação ({validacao.registrosValidos})
            </button>
          </div>
        </section>
      )}

      {resultado && (
        <section
          className={`rounded-xl border p-6 shadow-sm ${
            resultado.sucesso ? 'border-accent/40 bg-accent/5' : 'border-danger/40 bg-danger/5'
          }`}
        >
          <h2
            className={`flex items-center gap-2 text-lg font-bold ${
              resultado.sucesso ? 'text-accent' : 'text-danger'
            }`}
          >
            {resultado.sucesso ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            {resultado.mensagem}
          </h2>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-2xl font-bold text-accent">{resultado.importados}</p>
              <p className="text-xs text-muted">Importados</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-2xl font-bold text-warning">{resultado.duplicadosIgnorados}</p>
              <p className="text-xs text-muted">Duplicados ignorados</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-2xl font-bold text-danger">{resultado.errosRejeitados}</p>
              <p className="text-xs text-muted">Rejeitados</p>
            </div>
          </div>
          {resultado.erros.length > 0 && (
            <ul className="mt-4 max-h-44 list-disc space-y-1 overflow-y-auto pl-5 text-xs text-muted">
              {resultado.erros.map((e, i) => (
                <li key={i}>
                  <b>Linha {e.linha}:</b> {e.mensagem}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  ) : null;

  const renderExportar = entidade ? (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-background p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-bold">Exportar {entidade.rotulo}</h2>
        {resumoExport ? (
          <div className="space-y-4">
            <p className="text-sm text-muted">{entidade.descricao}</p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
                {resumoExport.quantidade} registro(s)
              </span>
              <span className="rounded-full bg-surface px-3 py-1 text-sm text-muted">
                Formato {resumoExport.formato}
              </span>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Colunas incluídas</p>
              <div className="flex flex-wrap gap-2">
                {resumoExport.colunas.map((col) => (
                  <span key={col} className="rounded-md border border-border bg-surface px-2 py-1 font-mono text-xs">
                    {col}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={baixarExportacao}
              disabled={exportando}
              className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {exportando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Exportar CSV
            </button>
          </div>
        ) : (
          <p className="flex items-center gap-2 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" /> Consultando a tabela...
          </p>
        )}
      </section>

      <section className="rounded-xl border border-border bg-background p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-bold">Como ler o arquivo gerado</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
          <li>
            O arquivo é um <b>CSV</b> com cabeçalho na primeira linha e separador por vírgula.
          </li>
          <li>
            Colunas de relacionamento trazem a <b>chave natural</b> (ex.: <b>fornecedor_cnpj</b>,{" "}
            <b>produto_sku</b>, <b>nota_fiscal_chave</b>) para fácil referência cruzada.
          </li>
          <li>
            Datas e horas seguem o formato brasileiro (<b>dd/MM/aaaa</b> e <b>dd/MM/aaaa HH:mm</b>),
            prontos para leitura em planilhas.
          </li>
          <li>
            Este mesmo arquivo pode ser reimportado pela aba <b>Importar</b> após edições.
          </li>
        </ul>
      </section>
    </div>
  ) : null;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Importar / Exportar dados</h1>
        <p className="mt-1 text-sm text-muted">
          Carregue ou baixe registros em CSV. Nada é gravado no banco sem a sua confirmação.
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => setAba('importar')}
          className={`flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors ${
            aba === 'importar'
              ? 'border-accent bg-accent text-foreground'
              : 'border-border bg-background text-muted hover:bg-surface-hover hover:text-foreground'
          }`}
        >
          <Upload className="h-4 w-4" /> Importar dados
        </button>
        <button
          onClick={() => setAba('exportar')}
          className={`flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors ${
            aba === 'exportar'
              ? 'border-accent bg-accent text-foreground'
              : 'border-border bg-background text-muted hover:bg-surface-hover hover:text-foreground'
          }`}
        >
          <Download className="h-4 w-4" /> Exportar dados
        </button>
      </div>

      {erro && (
        <div className="rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{erro}</div>
      )}

      {renderSeletor}

      {aba === 'importar'
        ? renderImportar ?? (
            <p className="rounded-xl border border-dashed border-border bg-background p-8 text-center text-sm text-muted">
              Selecione uma tabela acima para começar a importação.
            </p>
          )
        : renderExportar ?? (
            <p className="rounded-xl border border-dashed border-border bg-background p-8 text-center text-sm text-muted">
              Selecione uma tabela acima para exportar.
            </p>
          )}
    </div>
  );
}