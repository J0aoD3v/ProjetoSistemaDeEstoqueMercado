'use client';

import { useEffect, useState, useCallback } from 'react';
import { Divergencia } from '@/types';
import { divergenciaService } from '@/services/divergenciaService';
import { Plus, Trash2, Edit, AlertTriangle, AlertCircle, X, Check } from 'lucide-react';
import axios from 'axios';

export default function DivergenciasPage() {
  const [divergencias, setDivergencias] = useState<Divergencia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [tipoDivergencia, setTipoDivergencia] = useState('');
  const [quantidadeDivergente, setQuantidadeDivergente] = useState('');
  const [observacao, setObservacao] = useState('');
  const [idItemRecebimento, setIdItemRecebimento] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  const [editTipoDivergencia, setEditTipoDivergencia] = useState('');
  const [editQuantidadeDivergente, setEditQuantidadeDivergente] = useState('');
  const [editObservacao, setEditObservacao] = useState('');
  const [editIdItemRecebimento, setEditIdItemRecebimento] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const carregarDivergencias = useCallback(async () => {
    try {
      const data = await divergenciaService.listarTodos();
      setDivergencias(data);
      setErro('');
    } catch {
      setErro('Não foi possível carregar o relatório de divergências.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await carregarDivergencias();
    })();
  }, [carregarDivergencias]);

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await divergenciaService.cadastrar({
        tipoDivergencia,
        quantidadeDivergente: parseFloat(quantidadeDivergente),
        observacao,
        idItemRecebimento: parseInt(idItemRecebimento),
      });
      setTipoDivergencia('');
      setQuantidadeDivergente('');
      setObservacao('');
      setIdItemRecebimento('');
      setMostrarForm(false);
      await carregarDivergencias();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        alert(err.response.data.mensagem);
      } else {
        alert('Erro ao cadastrar divergência.');
      }
    }
  };

  const handleExcluir = async (id?: number) => {
    if (!id || !confirm('Deseja excluir esta divergência?')) return;
    try {
      await divergenciaService.excluir(id);
      await carregarDivergencias();
    } catch {
      alert('Erro ao excluir divergência.');
    }
  };

  const iniciarEdicao = (d: Divergencia) => {
    setEditandoId(d.idDivergencia ?? null);
    setEditTipoDivergencia(d.tipoDivergencia);
    setEditQuantidadeDivergente(String(d.quantidadeDivergente));
    setEditObservacao(d.observacao || '');
    setEditIdItemRecebimento(String(d.idItemRecebimento));
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditTipoDivergencia('');
    setEditQuantidadeDivergente('');
    setEditObservacao('');
    setEditIdItemRecebimento('');
  };

  const salvarEdicao = async (id: number) => {
    try {
      await divergenciaService.atualizar(id, {
        tipoDivergencia: editTipoDivergencia,
        quantidadeDivergente: parseFloat(editQuantidadeDivergente),
        observacao: editObservacao,
        idItemRecebimento: parseInt(editIdItemRecebimento),
      });
      cancelarEdicao();
      await carregarDivergencias();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        alert(err.response.data.mensagem);
      } else {
        alert('Erro ao atualizar divergência.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Relatório de Divergências</h1>
          <p className="mt-1 text-base text-muted">Diferenças encontradas entre a Nota Fiscal e a conferência física</p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="flex items-center justify-center gap-2 rounded-lg bg-warning px-4 py-2.5 font-semibold text-foreground shadow-sm transition-colors hover:bg-warning-hover"
        >
          <Plus className="w-4 h-4" />
          {mostrarForm ? 'Fechar Formulário' : 'Nova Divergência'}
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
          <h2 className="text-lg font-semibold text-foreground border-b pb-2">Cadastrar Divergência</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Tipo de Divergência</label>
              <input
                type="text"
                required
                value={tipoDivergencia}
                onChange={(e) => setTipoDivergencia(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none"
                placeholder="FALTA / SOBRA / AVARIA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Quantidade Divergente</label>
              <input
                type="number"
                step="0.01"
                required
                value={quantidadeDivergente}
                onChange={(e) => setQuantidadeDivergente(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">ID Item Recebimento</label>
              <input
                type="number"
                required
                value={idItemRecebimento}
                onChange={(e) => setIdItemRecebimento(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none"
                placeholder="1"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-muted mb-1">Observação</label>
              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                rows={2}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none"
                placeholder="Detalhes da divergência..."
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
          <div className="p-8 text-center text-muted">Carregando divergências...</div>
        ) : divergencias.length === 0 ? (
          <div className="p-8 text-center text-muted flex flex-col items-center gap-2">
            <AlertTriangle className="w-10 h-10 text-muted" />
            Nenhuma divergência registrada no momento.
          </div>
        ) : (
          <table className="w-full min-w-175 border-collapse text-left text-base">
            <thead className="border-b border-border bg-surface text-xs font-bold uppercase tracking-wider text-foreground">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Qtd. Divergente</th>
                <th className="p-4">Observação</th>
                <th className="p-4">Item ID</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {divergencias.map((d) => (
                <tr key={d.idDivergencia} className="transition-colors hover:bg-surface-hover">
                  {editandoId === d.idDivergencia ? (
                    <>
                      <td className="p-4 font-mono text-muted">#{d.idDivergencia}</td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={editTipoDivergencia}
                          onChange={(e) => setEditTipoDivergencia(e.target.value)}
                          className="w-full border border-border rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          step="0.01"
                          value={editQuantidadeDivergente}
                          onChange={(e) => setEditQuantidadeDivergente(e.target.value)}
                          className="w-full border border-border rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={editObservacao}
                          onChange={(e) => setEditObservacao(e.target.value)}
                          className="w-full border border-border rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          value={editIdItemRecebimento}
                          onChange={(e) => setEditIdItemRecebimento(e.target.value)}
                          className="w-full border border-border rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => salvarEdicao(d.idDivergencia!)} className="text-muted hover:text-accent p-1 mr-1">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={cancelarEdicao} className="text-muted p-1">
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-4 font-mono text-muted">#{d.idDivergencia}</td>
                      <td className="p-4 font-semibold text-warning">{d.tipoDivergencia}</td>
                      <td className="p-4 font-bold text-foreground">{d.quantidadeDivergente}</td>
                      <td className="p-4 text-muted">{d.observacao || '-'}</td>
                      <td className="p-4 font-mono text-muted">#{d.idItemRecebimento}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => iniciarEdicao(d)} className="text-muted hover:text-accent p-1 mr-1">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleExcluir(d.idDivergencia)} className="text-muted hover:text-danger p-1">
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









