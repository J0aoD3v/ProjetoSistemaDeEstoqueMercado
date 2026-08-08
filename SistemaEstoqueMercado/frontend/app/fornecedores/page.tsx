'use client';

import { useEffect, useState } from 'react';
import { Fornecedor } from '@/types';
import { fornecedorService } from '@/services/fornecedorService';
import { Plus, Trash2, Users, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // Formulário
  const [cnpj, setCnpj] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  const buscarFornecedores = async () => {
    try {
      const data = await fornecedorService.listarTodos();
      setFornecedores(data);
      setErro('');
    } catch {
      setErro('Não foi possível carregar a lista de fornecedores.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const carregarInicial = async () => {
      try {
        const data = await fornecedorService.listarTodos();
        if (isMounted) {
          setFornecedores(data);
          setErro('');
        }
      } catch {
        if (isMounted) {
          setErro('Não foi possível carregar a lista de fornecedores.');
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
      await fornecedorService.cadastrar({ cnpj, razaoSocial, nomeFantasia });
      setCnpj('');
      setRazaoSocial('');
      setNomeFantasia('');
      setMostrarForm(false);
      setCarregando(true);
      await buscarFornecedores();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        alert(err.response.data.mensagem);
      } else {
        alert('Erro ao cadastrar fornecedor.');
      }
    }
  };

  const handleExcluir = async (id?: number) => {
    if (!id || !confirm('Deseja excluir este fornecedor?')) return;
    try {
      await fornecedorService.excluir(id);
      setCarregando(true);
      await buscarFornecedores();
    } catch {
      alert('Erro ao excluir fornecedor.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Fornecedores</h1>
          <p className="mt-1 text-base text-slate-600 dark:text-slate-300">Gestão dos parceiros e distribuidores do mercado</p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-blue-800"
        >
          <Plus className="w-4 h-4" />
          {mostrarForm ? 'Fechar Formulário' : 'Novo Fornecedor'}
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
          <h2 className="text-lg font-semibold text-slate-700 border-b pb-2">Cadastrar Fornecedor</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">CNPJ</label>
              <input
                type="text"
                required
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="00.000.000/0001-00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Razão Social</label>
              <input
                type="text"
                required
                value={razaoSocial}
                onChange={(e) => setRazaoSocial(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Distribuidora de Alimentos S.A."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Nome Fantasia</label>
              <input
                type="text"
                value={nomeFantasia}
                onChange={(e) => setNomeFantasia(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Alimentos Brasil"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium text-sm">
              Salvar
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        {carregando ? (
          <div className="p-8 text-center text-slate-500">Carregando fornecedores...</div>
        ) : fornecedores.length === 0 ? (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
            <Users className="w-10 h-10 text-slate-400" />
            Nenhum fornecedor cadastrado.
          </div>
        ) : (
          <table className="w-full min-w-170 border-collapse text-left text-base">
            <thead className="border-b border-slate-200 bg-slate-100 text-xs font-bold uppercase tracking-wider text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">CNPJ</th>
                <th className="p-4">Razão Social</th>
                <th className="p-4">Nome Fantasia</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm dark:divide-slate-700">
              {fornecedores.map((f) => (
                <tr key={f.idFornecedor} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/70">
                  <td className="p-4 font-mono text-slate-500">#{f.idFornecedor}</td>
                  <td className="p-4 font-mono text-slate-800">{f.cnpj}</td>
                  <td className="p-4 text-slate-700 font-medium">{f.razaoSocial}</td>
                  <td className="p-4 text-slate-600">{f.nomeFantasia || '-'}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleExcluir(f.idFornecedor)} className="text-slate-400 hover:text-rose-600 p-1">
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
