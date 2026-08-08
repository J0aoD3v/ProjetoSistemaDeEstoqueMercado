'use client';

import { useEffect, useState, useCallback } from 'react';
import { Recebimento } from '@/types';
import { recebimentoService } from '@/services/recebimentoService';
import { Plus, Trash2, Edit, Truck, AlertCircle, X, Check } from 'lucide-react';
import axios from 'axios';

export default function RecebimentosPage() {
  const [recebimentos, setRecebimentos] = useState<Recebimento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [dataHoraChegada, setDataHoraChegada] = useState('');
  const [statusRecebimento, setStatusRecebimento] = useState('EM_CONFERENCIA');
  const [idNotaFiscal, setIdNotaFiscal] = useState('');
  const [idFuncionario, setIdFuncionario] = useState('');
  const [idMotorista, setIdMotorista] = useState('');
  const [idVeiculo, setIdVeiculo] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  const [editDataHoraChegada, setEditDataHoraChegada] = useState('');
  const [editStatusRecebimento, setEditStatusRecebimento] = useState('');
  const [editIdNotaFiscal, setEditIdNotaFiscal] = useState('');
  const [editIdFuncionario, setEditIdFuncionario] = useState('');
  const [editIdMotorista, setEditIdMotorista] = useState('');
  const [editIdVeiculo, setEditIdVeiculo] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const carregarRecebimentos = useCallback(async () => {
    try {
      const data = await recebimentoService.listarTodos();
      setRecebimentos(data);
      setErro('');
    } catch {
      setErro('Não foi possível carregar a lista de recebimentos.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await carregarRecebimentos();
    })();
  }, [carregarRecebimentos]);

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await recebimentoService.cadastrar({
        dataHoraChegada: new Date(dataHoraChegada).toISOString(),
        statusRecebimento,
        idNotaFiscal: parseInt(idNotaFiscal),
        idFuncionario: parseInt(idFuncionario),
        idMotorista: parseInt(idMotorista),
        idVeiculo: parseInt(idVeiculo),
      });
      setDataHoraChegada('');
      setStatusRecebimento('EM_CONFERENCIA');
      setIdNotaFiscal('');
      setIdFuncionario('');
      setIdMotorista('');
      setIdVeiculo('');
      setMostrarForm(false);
      await carregarRecebimentos();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        alert(err.response.data.mensagem);
      } else {
        alert('Erro ao cadastrar recebimento.');
      }
    }
  };

  const handleExcluir = async (id?: number) => {
    if (!id || !confirm('Deseja excluir este recebimento?')) return;
    try {
      await recebimentoService.excluir(id);
      await carregarRecebimentos();
    } catch {
      alert('Erro ao excluir recebimento.');
    }
  };

  const iniciarEdicao = (r: Recebimento) => {
    setEditandoId(r.idRecebimento ?? null);
    setEditDataHoraChegada(r.dataHoraChegada ? new Date(r.dataHoraChegada).toISOString().slice(0, 16) : '');
    setEditStatusRecebimento(r.statusRecebimento);
    setEditIdNotaFiscal(String(r.idNotaFiscal));
    setEditIdFuncionario(String(r.idFuncionario));
    setEditIdMotorista(String(r.idMotorista));
    setEditIdVeiculo(String(r.idVeiculo));
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditDataHoraChegada('');
    setEditStatusRecebimento('');
    setEditIdNotaFiscal('');
    setEditIdFuncionario('');
    setEditIdMotorista('');
    setEditIdVeiculo('');
  };

  const salvarEdicao = async (id: number) => {
    try {
      await recebimentoService.atualizar(id, {
        dataHoraChegada: new Date(editDataHoraChegada).toISOString(),
        statusRecebimento: editStatusRecebimento,
        idNotaFiscal: parseInt(editIdNotaFiscal),
        idFuncionario: parseInt(editIdFuncionario),
        idMotorista: parseInt(editIdMotorista),
        idVeiculo: parseInt(editIdVeiculo),
      });
      cancelarEdicao();
      await carregarRecebimentos();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        alert(err.response.data.mensagem);
      } else {
        alert('Erro ao atualizar recebimento.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Recebimento de Mercadorias</h1>
          <p className="mt-1 text-base text-muted">Acompanhe as cargas e conferências de notas fiscais</p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="flex items-center justify-center gap-2 rounded-lg bg-warning px-4 py-2.5 font-semibold text-foreground shadow-sm transition-colors hover:bg-warning-hover"
        >
          <Plus className="w-4 h-4" />
          {mostrarForm ? 'Fechar Formulário' : 'Novo Recebimento'}
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
          <h2 className="text-lg font-semibold text-foreground border-b pb-2">Cadastrar Recebimento</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Data/Hora Chegada</label>
              <input
                type="datetime-local"
                required
                value={dataHoraChegada}
                onChange={(e) => setDataHoraChegada(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Status</label>
              <select
                value={statusRecebimento}
                onChange={(e) => setStatusRecebimento(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none"
              >
                <option value="EM_CONFERENCIA">Em Conferência</option>
                <option value="CONCLUIDO">Concluído</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">ID Nota Fiscal</label>
              <input
                type="number"
                required
                value={idNotaFiscal}
                onChange={(e) => setIdNotaFiscal(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none"
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">ID Funcionário</label>
              <input
                type="number"
                required
                value={idFuncionario}
                onChange={(e) => setIdFuncionario(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none"
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">ID Motorista</label>
              <input
                type="number"
                required
                value={idMotorista}
                onChange={(e) => setIdMotorista(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none"
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">ID Veículo</label>
              <input
                type="number"
                required
                value={idVeiculo}
                onChange={(e) => setIdVeiculo(e.target.value)}
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
          <div className="p-8 text-center text-muted">Carregando recebimentos...</div>
        ) : recebimentos.length === 0 ? (
          <div className="p-8 text-center text-muted flex flex-col items-center gap-2">
            <Truck className="w-10 h-10 text-muted" />
            Nenhum recebimento registrado no momento.
          </div>
        ) : (
          <table className="w-full min-w-225 border-collapse text-left text-base">
            <thead className="border-b border-border bg-surface text-xs font-bold uppercase tracking-wider text-foreground">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Data/Hora Chegada</th>
                <th className="p-4">Status</th>
                <th className="p-4">NF ID</th>
                <th className="p-4">Funcionário</th>
                <th className="p-4">Motorista</th>
                <th className="p-4">Veículo</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recebimentos.map((r) => (
                <tr key={r.idRecebimento} className="transition-colors hover:bg-surface-hover">
                  {editandoId === r.idRecebimento ? (
                    <>
                      <td className="p-4 font-mono text-muted">#{r.idRecebimento}</td>
                      <td className="p-4">
                        <input
                          type="datetime-local"
                          value={editDataHoraChegada}
                          onChange={(e) => setEditDataHoraChegada(e.target.value)}
                          className="w-full border border-border rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-4">
                        <select
                          value={editStatusRecebimento}
                          onChange={(e) => setEditStatusRecebimento(e.target.value)}
                          className="w-full border border-border rounded px-2 py-1 text-xs"
                        >
                          <option value="EM_CONFERENCIA">Em Conferência</option>
                          <option value="CONCLUIDO">Concluído</option>
                          <option value="CANCELADO">Cancelado</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          value={editIdNotaFiscal}
                          onChange={(e) => setEditIdNotaFiscal(e.target.value)}
                          className="w-full border border-border rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          value={editIdFuncionario}
                          onChange={(e) => setEditIdFuncionario(e.target.value)}
                          className="w-full border border-border rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          value={editIdMotorista}
                          onChange={(e) => setEditIdMotorista(e.target.value)}
                          className="w-full border border-border rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          value={editIdVeiculo}
                          onChange={(e) => setEditIdVeiculo(e.target.value)}
                          className="w-full border border-border rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => salvarEdicao(r.idRecebimento!)} className="text-muted hover:text-accent p-1 mr-1">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={cancelarEdicao} className="text-muted p-1">
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-4 font-mono text-muted">#{r.idRecebimento}</td>
                      <td className="p-4 font-medium text-foreground">{new Date(r.dataHoraChegada).toLocaleString('pt-BR')}</td>
                      <td className="p-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                          r.statusRecebimento === 'CONCLUIDO' ? 'bg-accent/20 text-accent' :
                          r.statusRecebimento === 'CANCELADO' ? 'bg-danger/20 text-danger' :
                          'bg-warning/20 text-warning'
                        }`}>
                          {r.statusRecebimento || 'EM_CONFERENCIA'}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-muted">#{r.idNotaFiscal}</td>
                      <td className="p-4 font-mono text-muted">#{r.idFuncionario}</td>
                      <td className="p-4 font-mono text-muted">#{r.idMotorista}</td>
                      <td className="p-4 font-mono text-muted">#{r.idVeiculo}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => iniciarEdicao(r)} className="text-muted hover:text-accent p-1 mr-1">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleExcluir(r.idRecebimento)} className="text-muted hover:text-danger p-1">
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









