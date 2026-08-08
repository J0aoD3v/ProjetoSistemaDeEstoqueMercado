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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Fornecedores</h1>
          <p className="text-sm text-slate-500">Gestão dos parceiros e distribuidores do mercado</p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          {mostrarForm ? 'Fechar Formulário' : 'Novo Fornecedor'}
        </button>
      </div>

      {erro && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          {erro}
        </div>
      )}

      {mostrarForm && (
        <form onSubmit={handleCadastrar} className="bg-white p-6 rounded-xl shadow-sm space-y-4 border border-slate-200">
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

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {carregando ? (
          <div className="p-8 text-center text-slate-500">Carregando fornecedores...</div>
        ) : fornecedores.length === 0 ? (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
            <Users className="w-10 h-10 text-slate-400" />
            Nenhum fornecedor cadastrado.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b text-xs font-semibold text-slate-500 uppercase">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">CNPJ</th>
                <th className="p-4">Razão Social</th>
                <th className="p-4">Nome Fantasia</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {fornecedores.map((f) => (
                <tr key={f.idFornecedor} className="hover:bg-slate-50">
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