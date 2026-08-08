'use client';

import { useEffect, useState, useCallback } from 'react';
import { Lote } from '@/types';
import { loteService } from '@/services/loteService';
import { Plus, Trash2, Edit, Package, AlertCircle, X, Check } from 'lucide-react';
import axios from 'axios';
import { useProductSearch } from '@/hooks/useProductSearch';
import { validarNumeroLote, validarCampoObrigatorio, validarNumeroPositivo } from '@/utils/validators';

export default function LotesPage() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroGeral, setErroGeral] = useState('');

  const [numeroLote, setNumeroLote] = useState('');
  const [dataFabricacao, setDataFabricacao] = useState('');
  const [dataValidade, setDataValidade] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  const [editNumeroLote, setEditNumeroLote] = useState('');
  const [editDataFabricacao, setEditDataFabricacao] = useState('');
  const [editDataValidade, setEditDataValidade] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const produtoSearch = useProductSearch({
    onSelect: (p) => {
      setIdProduto(p.idProduto ?? '');
    },
  });

  const [idProduto, setIdProduto] = useState<number | ''>('');
  const [editIdProduto, setEditIdProduto] = useState<number | ''>('');

  const [erroNumeroLote, setErroNumeroLote] = useState('');
  const [erroDataFabricacao, setErroDataFabricacao] = useState('');
  const [erroDataValidade, setErroDataValidade] = useState('');
  const [erroIdProduto, setErroIdProduto] = useState('');

  const [editErroNumeroLote, setEditErroNumeroLote] = useState('');
  const [editErroDataFabricacao, setEditErroDataFabricacao] = useState('');
  const [editErroDataValidade, setEditErroDataValidade] = useState('');
  const [editErroIdProduto, setEditErroIdProduto] = useState('');

  const limparErros = () => {
    setErroNumeroLote('');
    setErroDataFabricacao('');
    setErroDataValidade('');
    setErroIdProduto('');
  };

  const limparEditErros = () => {
    setEditErroNumeroLote('');
    setEditErroDataFabricacao('');
    setEditErroDataValidade('');
    setEditErroIdProduto('');
  };

  const mapearErroBackend = (mensagem: string) => {
    const msg = mensagem.toLowerCase();
    if (msg.includes('lote')) {
      setErroNumeroLote(mensagem);
    } else if (msg.includes('fabricação') || msg.includes('fabricacao')) {
      setErroDataFabricacao(mensagem);
    } else if (msg.includes('validade')) {
      setErroDataValidade(mensagem);
    } else if (msg.includes('produto')) {
      setErroIdProduto(mensagem);
    } else {
      setErroGeral(mensagem);
    }
  };

  const mapearEditErroBackend = (mensagem: string) => {
    const msg = mensagem.toLowerCase();
    if (msg.includes('lote')) {
      setEditErroNumeroLote(mensagem);
    } else if (msg.includes('fabricação') || msg.includes('fabricacao')) {
      setEditErroDataFabricacao(mensagem);
    } else if (msg.includes('validade')) {
      setEditErroDataValidade(mensagem);
    } else if (msg.includes('produto')) {
      setEditErroIdProduto(mensagem);
    } else {
      setErroGeral(mensagem);
    }
  };

  const carregarLotes = useCallback(async () => {
    try {
      setCarregando(true);
      const data = await loteService.listarTodos();
      setLotes(data);
      setErroGeral('');
    } catch {
      setErroGeral('Não foi possível carregar a lista de lotes.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await carregarLotes();
    })();
  }, [carregarLotes]);

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    limparErros();
    let temErro = false;

    const errNumero = validarNumeroLote(numeroLote);
    if (errNumero) {
      setErroNumeroLote(errNumero);
      temErro = true;
    }

    const errDataFab = validarCampoObrigatorio(dataFabricacao, 'Data de fabricação');
    if (errDataFab) {
      setErroDataFabricacao(errDataFab);
      temErro = true;
    }

    const errDataVal = validarCampoObrigatorio(dataValidade, 'Data de validade');
    if (errDataVal) {
      setErroDataValidade(errDataVal);
      temErro = true;
    }

    const errIdProduto = validarNumeroPositivo(String(idProduto), 'ID do Produto');
    if (errIdProduto) {
      setErroIdProduto(errIdProduto);
      temErro = true;
    }

    if (temErro) return;

    try {
      await loteService.cadastrar({ numeroLote, dataFabricacao, dataValidade, idProduto: Number(idProduto) });
      setNumeroLote('');
      setDataFabricacao('');
      setDataValidade('');
      setIdProduto('');
      produtoSearch.setTermo('');
      setMostrarForm(false);
      limparErros();
      await carregarLotes();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        mapearErroBackend(err.response.data.mensagem);
      } else {
        setErroGeral('Erro ao cadastrar lote.');
      }
    }
  };

  const handleExcluir = async (id?: number) => {
    if (!id || !confirm('Deseja excluir este lote?')) return;
    try {
      await loteService.excluir(id);
      await carregarLotes();
    } catch {
      setErroGeral('Erro ao excluir lote.');
    }
  };

  const iniciarEdicao = (l: Lote) => {
    setEditandoId(l.idLote ?? null);
    setEditNumeroLote(l.numeroLote);
    setEditDataFabricacao(l.dataFabricacao);
    setEditDataValidade(l.dataValidade);
    setEditIdProduto(l.idProduto);
    produtoSearch.setTermo('');
    limparEditErros();
    setErroGeral('');
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditNumeroLote('');
    setEditDataFabricacao('');
    setEditDataValidade('');
    setEditIdProduto('');
    produtoSearch.setTermo('');
    limparEditErros();
    setErroGeral('');
  };

  const salvarEdicao = async (id: number) => {
    limparEditErros();
    let temErro = false;

    const errNumero = validarNumeroLote(editNumeroLote);
    if (errNumero) {
      setEditErroNumeroLote(errNumero);
      temErro = true;
    }

    const errDataFab = validarCampoObrigatorio(editDataFabricacao, 'Data de fabricação');
    if (errDataFab) {
      setEditErroDataFabricacao(errDataFab);
      temErro = true;
    }

    const errDataVal = validarCampoObrigatorio(editDataValidade, 'Data de validade');
    if (errDataVal) {
      setEditErroDataValidade(errDataVal);
      temErro = true;
    }

    const errIdProduto = validarNumeroPositivo(String(editIdProduto), 'ID do Produto');
    if (errIdProduto) {
      setEditErroIdProduto(errIdProduto);
      temErro = true;
    }

    if (temErro) return;

    try {
      await loteService.atualizar(id, {
        numeroLote: editNumeroLote,
        dataFabricacao: editDataFabricacao,
        dataValidade: editDataValidade,
        idProduto: Number(editIdProduto),
      });
      cancelarEdicao();
      await carregarLotes();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        mapearEditErroBackend(err.response.data.mensagem);
      } else {
        setErroGeral('Erro ao atualizar lote.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Lotes</h1>
          <p className="mt-1 text-base text-muted">Gestão dos lotes de produtos</p>
        </div>
        <button
          onClick={() => {
            setMostrarForm(!mostrarForm);
            if (mostrarForm) limparErros();
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-warning px-4 py-2.5 font-semibold text-foreground shadow-sm transition-colors hover:bg-warning-hover"
        >
          <Plus className="w-4 h-4" />
          {mostrarForm ? 'Fechar Formulário' : 'Novo Lote'}
        </button>
      </div>

      {erroGeral && (
        <div className="flex items-center gap-3 rounded-lg border border-danger/50 bg-danger/10 p-4 font-medium text-danger">
          <AlertCircle className="w-5 h-5" />
          {erroGeral}
        </div>
      )}

      {mostrarForm && (
        <form onSubmit={handleCadastrar} className="space-y-4 rounded-xl border border-border bg-background p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground border-b pb-2">Cadastrar Lote</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Número do Lote</label>
              <input
                type="text"
                required
                value={numeroLote}
                onChange={(e) => {
                  setNumeroLote(e.target.value);
                  setErroNumeroLote('');
                }}
                onBlur={() => setErroNumeroLote(validarNumeroLote(numeroLote) || '')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none ${erroNumeroLote ? 'border-danger' : 'border-border'}`}
                placeholder="LOTE-001"
              />
              {erroNumeroLote && <p className="text-xs text-danger mt-1">{erroNumeroLote}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Data Fabricação</label>
              <input
                type="date"
                required
                value={dataFabricacao}
                onChange={(e) => {
                  setDataFabricacao(e.target.value);
                  setErroDataFabricacao('');
                }}
                onBlur={() => setErroDataFabricacao(validarCampoObrigatorio(dataFabricacao, 'Data de fabricação') || '')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none ${erroDataFabricacao ? 'border-danger' : 'border-border'}`}
              />
              {erroDataFabricacao && <p className="text-xs text-danger mt-1">{erroDataFabricacao}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Data Validade</label>
              <input
                type="date"
                required
                value={dataValidade}
                onChange={(e) => {
                  setDataValidade(e.target.value);
                  setErroDataValidade('');
                }}
                onBlur={() => setErroDataValidade(validarCampoObrigatorio(dataValidade, 'Data de validade') || '')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none ${erroDataValidade ? 'border-danger' : 'border-border'}`}
              />
              {erroDataValidade && <p className="text-xs text-danger mt-1">{erroDataValidade}</p>}
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-muted mb-1">Produto</label>
              <input
                type="text"
                required
                value={produtoSearch.termo}
                onChange={(e) => {
                  produtoSearch.setTermo(e.target.value);
                  setErroIdProduto('');
                }}
                onBlur={() => {
                  setTimeout(produtoSearch.fechar, 150);
                  setErroIdProduto(validarNumeroPositivo(String(idProduto), 'ID do Produto') || '');
                }}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none ${erroIdProduto ? 'border-danger' : 'border-border'}`}
                placeholder="Buscar por SKU, código de barras ou descrição..."
              />
              {produtoSearch.aberto && (
                <ul className="absolute z-10 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-48 overflow-auto">
                  {produtoSearch.carregando ? (
                    <li className="p-3 text-sm text-muted">Carregando...</li>
                  ) : (
                    produtoSearch.sugestoes.map((p) => (
                      <li
                        key={p.idProduto}
                        onMouseDown={() => produtoSearch.selecionar(p)}
                        className="cursor-pointer px-3 py-2 text-sm hover:bg-surface-hover"
                      >
                        <span className="font-medium text-foreground">{p.sku}</span>
                        <span className="text-muted"> - {p.descricao}</span>
                      </li>
                    ))
                  )}
                </ul>
              )}
              {erroIdProduto && <p className="text-xs text-danger mt-1">{erroIdProduto}</p>}
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" className="bg-warning hover:bg-warning-hover text-foreground px-6 py-2 rounded-lg font-medium text-sm">
              Salvar
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-background">
        {carregando ? (
          <div className="p-8 text-center text-muted">Carregando lotes...</div>
        ) : lotes.length === 0 ? (
          <div className="p-8 text-center text-muted flex flex-col items-center gap-2">
            <Package className="w-10 h-10 text-muted" />
            Nenhum lote cadastrado.
          </div>
        ) : (
          <table className="w-full min-w-175 border-collapse text-left text-base">
            <thead className="border-b border-border bg-surface text-xs font-bold uppercase tracking-wider text-foreground">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Nº Lote</th>
                <th className="p-4">Data Fab.</th>
                <th className="p-4">Data Val.</th>
                <th className="p-4">ID Produto</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lotes.map((l) => (
                <tr key={l.idLote} className="transition-colors hover:bg-surface-hover">
                  {editandoId === l.idLote ? (
                    <>
                      <td className="p-4 font-mono text-muted">#{l.idLote}</td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={editNumeroLote}
                          onChange={(e) => {
                            setEditNumeroLote(e.target.value);
                            setEditErroNumeroLote('');
                          }}
                          onBlur={() => setEditErroNumeroLote(validarNumeroLote(editNumeroLote) || '')}
                          className={`w-full border rounded px-2 py-1 text-xs ${editErroNumeroLote ? 'border-danger' : 'border-border'}`}
                        />
                        {editErroNumeroLote && <p className="text-xs text-danger mt-1">{editErroNumeroLote}</p>}
                      </td>
                      <td className="p-4">
                        <input
                          type="date"
                          value={editDataFabricacao}
                          onChange={(e) => {
                            setEditDataFabricacao(e.target.value);
                            setEditErroDataFabricacao('');
                          }}
                          onBlur={() => setEditErroDataFabricacao(validarCampoObrigatorio(editDataFabricacao, 'Data de fabricação') || '')}
                          className={`w-full border rounded px-2 py-1 text-xs ${editErroDataFabricacao ? 'border-danger' : 'border-border'}`}
                        />
                        {editErroDataFabricacao && <p className="text-xs text-danger mt-1">{editErroDataFabricacao}</p>}
                      </td>
                      <td className="p-4">
                        <input
                          type="date"
                          value={editDataValidade}
                          onChange={(e) => {
                            setEditDataValidade(e.target.value);
                            setEditErroDataValidade('');
                          }}
                          onBlur={() => setEditErroDataValidade(validarCampoObrigatorio(editDataValidade, 'Data de validade') || '')}
                          className={`w-full border rounded px-2 py-1 text-xs ${editErroDataValidade ? 'border-danger' : 'border-border'}`}
                        />
                        {editErroDataValidade && <p className="text-xs text-danger mt-1">{editErroDataValidade}</p>}
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          value={editIdProduto}
                          onChange={(e) => {
                            setEditIdProduto(e.target.value === '' ? '' : Number(e.target.value));
                            setEditErroIdProduto('');
                          }}
                          onBlur={() => setEditErroIdProduto(validarNumeroPositivo(String(editIdProduto), 'ID do Produto') || '')}
                          className={`w-full border rounded px-2 py-1 text-xs ${editErroIdProduto ? 'border-danger' : 'border-border'}`}
                        />
                        {editErroIdProduto && <p className="text-xs text-danger mt-1">{editErroIdProduto}</p>}
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => salvarEdicao(l.idLote!)} className="text-muted hover:text-accent p-1 mr-1">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={cancelarEdicao} className="text-muted p-1">
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-4 font-mono text-muted">#{l.idLote}</td>
                      <td className="p-4 font-mono text-foreground">{l.numeroLote}</td>
                      <td className="p-4 text-muted">{new Date(l.dataFabricacao).toLocaleDateString()}</td>
                      <td className="p-4 text-muted">{new Date(l.dataValidade).toLocaleDateString()}</td>
                      <td className="p-4 text-muted">#{l.idProduto}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => iniciarEdicao(l)} className="text-muted hover:text-accent p-1 mr-1">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleExcluir(l.idLote)} className="text-muted hover:text-danger p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}


