'use client';

import { useEffect, useState, useCallback } from 'react';
import { Funcionario } from '@/types';
import { funcionarioService } from '@/services/funcionarioService';
import { Plus, Trash2, Edit, AlertCircle, X, Check } from 'lucide-react';
import axios from 'axios';

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [matricula, setMatricula] = useState('');
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  const [editMatricula, setEditMatricula] = useState('');
  const [editNome, setEditNome] = useState('');
  const [editCargo, setEditCargo] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const carregarFuncionarios = useCallback(async () => {
    try {
      const data = await funcionarioService.listarTodos();
      setFuncionarios(data);
      setErro('');
    } catch {
      setErro('Não foi possível carregar a lista de funcionários.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await carregarFuncionarios();
    })();
  }, [carregarFuncionarios]);

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await funcionarioService.cadastrar({ matricula, nome, cargo });
      setMatricula('');
      setNome('');
      setCargo('');
      setMostrarForm(false);
      await carregarFuncionarios();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        alert(err.response.data.mensagem);
      } else {
        alert('Erro ao cadastrar funcionário.');
      }
    }
  };

  const handleExcluir = async (id?: number) => {
    if (!id || !confirm('Deseja excluir este funcionário?')) return;
    try {
      await funcionarioService.excluir(id);
      await carregarFuncionarios();
    } catch {
      alert('Erro ao excluir funcionário.');
    }
  };

  const iniciarEdicao = (func: Funcionario) => {
    setEditandoId(func.idFuncionario ?? null);
    setEditMatricula(func.matricula);
    setEditNome(func.nome);
    setEditCargo(func.cargo);
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditMatricula('');
    setEditNome('');
    setEditCargo('');
  };

  const salvarEdicao = async (id: number) => {
    try {
      await funcionarioService.atualizar(id, {
        matricula: editMatricula,
        nome: editNome,
        cargo: editCargo,
      });
      cancelarEdicao();
      await carregarFuncionarios();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        alert(err.response.data.mensagem);
      } else {
        alert('Erro ao atualizar funcionário.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Funcionários</h1>
          <p className="mt-1 text-base text-muted">Gestão dos colaboradores do mercado</p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="flex items-center justify-center gap-2 rounded-lg bg-info px-4 py-2.5 font-semibold text-foreground shadow-sm transition-colors hover:bg-info-hover"
        >
          <Plus className="w-4 h-4" />
          {mostrarForm ? 'Fechar Formulário' : 'Novo Funcionário'}
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
          <h2 className="text-lg font-semibold text-foreground border-b pb-2">Cadastrar Funcionário</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Matrícula</label>
              <input
                type="text"
                required
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none"
                placeholder="FUNC-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Nome</label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none"
                placeholder="João Silva"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Cargo</label>
              <input
                type="text"
                required
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none"
                placeholder="Operador de Caixa"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" className="bg-info hover:bg-info-hover text-foreground px-6 py-2 rounded-lg font-medium text-sm">
              Salvar
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-background">
        {carregando ? (
          <div className="p-8 text-center text-muted">Carregando funcionários...</div>
        ) : funcionarios.length === 0 ? (
          <div className="p-8 text-center text-muted flex flex-col items-center gap-2">
            Nenhum funcionário cadastrado.
          </div>
        ) : (
          <table className="w-full min-w-[700px] border-collapse text-left text-base">
            <thead className="border-b border-border bg-surface text-xs font-bold uppercase tracking-wider text-foreground bg-surface text-foreground">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Matrícula</th>
                <th className="p-4">Nome</th>
                <th className="p-4">Cargo</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {funcionarios.map((f) => (
                <tr key={f.idFuncionario} className="transition-colors hover:bg-surface-hover">
                  {editandoId === f.idFuncionario ? (
                    <>
                      <td className="p-4 font-mono text-muted">#{f.idFuncionario}</td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={editMatricula}
                          onChange={(e) => setEditMatricula(e.target.value)}
                          className="w-full border border-border rounded px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={editNome}
                          onChange={(e) => setEditNome(e.target.value)}
                          className="w-full border border-border rounded px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={editCargo}
                          onChange={(e) => setEditCargo(e.target.value)}
                          className="w-full border border-border rounded px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => salvarEdicao(f.idFuncionario!)} className="text-muted hover:text-accent p-1 mr-1">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={cancelarEdicao} className="text-muted p-1">
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-4 font-mono text-muted">#{f.idFuncionario}</td>
                      <td className="p-4 font-mono text-foreground">{f.matricula}</td>
                      <td className="p-4 text-foreground font-medium">{f.nome}</td>
                      <td className="p-4 text-muted">{f.cargo}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => iniciarEdicao(f)} className="text-muted hover:text-accent p-1 mr-1">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleExcluir(f.idFuncionario)} className="text-muted hover:text-danger p-1">
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









