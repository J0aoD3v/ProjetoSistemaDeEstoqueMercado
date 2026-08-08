'use client';

import { useEffect, useState } from 'react';
import { Funcionario } from '@/types';
import { funcionarioService } from '@/services/funcionarioService';
import { Plus, Trash2, User, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // Formulário
  const [matricula, setMatricula] = useState('');
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  const buscarFuncionarios = async () => {
    try {
      const data = await funcionarioService.listarTodos();
      setFuncionarios(data);
      setErro('');
    } catch {
      setErro('Não foi possível carregar a lista de funcionários.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const carregarInicial = async () => {
      try {
        const data = await funcionarioService.listarTodos();
        if (isMounted) {
          setFuncionarios(data);
          setErro('');
        }
      } catch {
        if (isMounted) {
          setErro('Não foi possível carregar a lista de funcionários.');
        }
      } finally {
        if (isMounted) {
          setCarregando(false);
        }
      }
    };

    carregarInicial();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await funcionarioService.cadastrar({ matricula, nome, cargo });
      setMatricula('');
      setNome('');
      setCargo('');
      setMostrarForm(false);
      setCarregando(true);
      await buscarFuncionarios();
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
      setCarregando(true);
      await buscarFuncionarios();
    } catch {
      alert('Erro ao excluir funcionário.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Funcionários</h1>
          <p className="mt-1 text-base text-slate-600 dark:text-slate-300">Gestão dos colaboradores do mercado</p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="flex items-center justify-center gap-2 rounded-lg bg-purple-700 px-4 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-purple-800"
        >
          <Plus className="w-4 h-4" />
          {mostrarForm ? 'Fechar Formulário' : 'Novo Funcionário'}
        </button>
      </div>

      {erro && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 font-medium text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
          <AlertCircle className="w-5 h-5" />
          {erro}
        </div>
      )}

      {mostrarForm && (
        <form onSubmit={handleCadastrar} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-700 border-b pb-2">Cadastrar Funcionário</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Matrícula</label>
              <input
                type="text"
                required
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="FUNC-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Nome</label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="João Silva"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Cargo</label>
              <input
                type="text"
                required
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Operador de Caixa"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium text-sm">
              Salvar
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        {carregando ? (
          <div className="p-8 text-center text-slate-500">Carregando funcionários...</div>
        ) : funcionarios.length === 0 ? (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
            <User className="w-10 h-10 text-slate-400" />
            Nenhum funcionário cadastrado.
          </div>
        ) : (
          <table className="w-full min-w-170 border-collapse text-left text-base">
            <thead className="border-b border-slate-200 bg-slate-100 text-xs font-bold uppercase tracking-wider text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Matrícula</th>
                <th className="p-4">Nome</th>
                <th className="p-4">Cargo</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm dark:divide-slate-700">
              {funcionarios.map((f) => (
                <tr key={f.idFuncionario} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/70">
                  <td className="p-4 font-mono text-slate-500">#{f.idFuncionario}</td>
                  <td className="p-4 font-mono text-slate-800">{f.matricula}</td>
                  <td className="p-4 text-slate-700 font-medium">{f.nome}</td>
                  <td className="p-4 text-slate-600">{f.cargo}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleExcluir(f.idFuncionario)} className="text-slate-400 hover:text-rose-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}