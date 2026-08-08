'use client';

import { useEffect, useState, useCallback } from 'react';
import { Lote } from '@/types';
import { loteService } from '@/services/loteService';
import { Plus, Trash2, Edit, Package, AlertCircle, X, Check } from 'lucide-react';
import axios from 'axios';

export default function LotesPage() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [numeroLote, setNumeroLote] = useState('');
  const [dataFabricacao, setDataFabricacao] = useState('');
  const [dataValidade, setDataValidade] = useState('');
  const [idProduto, setIdProduto] = useState<number | ''>('');
  const [mostrarForm, setMostrarForm] = useState(false);

  const [editNumeroLote, setEditNumeroLote] = useState('');
  const [editDataFabricacao, setEditDataFabricacao] = useState('');
  const [editDataValidade, setEditDataValidade] = useState('');
  const [editIdProduto, setEditIdProduto] = useState<number | ''>('');
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const carregarLotes = useCallback(async () => {
    try {
      setCarregando(true);
      const data = await loteService.listarTodos();
      setLotes(data);
      setErro('');
    } catch {
      setErro('Não foi possível carregar a lista de lotes.');
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
    if (idProduto === '') {
      alert('ID do Produto é obrigatório.');
      return;
    }
    try {
      await loteService.cadastrar({ numeroLote, dataFabricacao, dataValidade, idProduto: Number(idProduto) });
      setNumeroLote('');
      setDataFabricacao('');
      setDataValidade('');
      setIdProduto('');
      setMostrarForm(false);
      await carregarLotes();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        alert(err.response.data.mensagem);
      } else {
        alert('Erro ao cadastrar lote.');
      }
    }
  };

  const handleExcluir = async (id?: number) => {
    if (!id || !confirm('Deseja excluir este lote?')) return;
    try {
      await loteService.excluir(id);
      await carregarLotes();
    } catch {
      alert('Erro ao excluir lote.');
    }
  };

  const iniciarEdicao = (l: Lote) => {
    setEditandoId(l.idLote ?? null);
    setEditNumeroLote(l.numeroLote);
    setEditDataFabricacao(l.dataFabricacao);
    setEditDataValidade(l.dataValidade);
    setEditIdProduto(l.idProduto);
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditNumeroLote('');
    setEditDataFabricacao('');
    setEditDataValidade('');
    setEditIdProduto('');
  };

  const salvarEdicao = async (id: number) => {
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
        alert(err.response.data.mensagem);
      } else {
        alert('Erro ao atualizar lote.');
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
          onClick={() => setMostrarForm(!mostrarForm)}
          className="flex items-center justify-center gap-2 rounded-lg bg-warning px-4 py-2.5 font-semibold text-foreground shadow-sm transition-colors hover:bg-warning-hover"
        >
          <Plus className="w-4 h-4" />
          {mostrarForm ? 'Fechar Formulário' : 'Novo Lote'}
        </button>
      </div>

      {erro && (
        <div className="flex items-center gap-3 rounded-lg border border-danger/50 bg-danger/10 p-4 font-medium text-danger">
          <AlertCircle className="w-5 h-5" />
          {erro}
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
                onChange={(e) => setNumeroLote(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none"
                placeholder="LOTE-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Data Fabricação</label>
              <input
                type="date"
                required
                value={dataFabricacao}
                onChange={(e) => setDataFabricacao(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Data Validade</label>
              <input
                type="date"
                required
                value={dataValidade}
                onChange={(e) => setDataValidade(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">ID do Produto</label>
              <input
                type="number"
                required
                value={idProduto}
                onChange={(e) => setIdProduto(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none"
                placeholder="1"
              />
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
                          onChange={(e) => setEditNumeroLote(e.target.value)}
                          className="w-full border border-border rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="date"
                          value={editDataFabricacao}
                          onChange={(e) => setEditDataFabricacao(e.target.value)}
                          className="w-full border border-border rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="date"
                          value={editDataValidade}
                          onChange={(e) => setEditDataValidade(e.target.value)}
                          className="w-full border border-border rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          value={editIdProduto}
                          onChange={(e) => setEditIdProduto(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full border border-border rounded px-2 py-1 text-xs"
                        />
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









