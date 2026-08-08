'use client';

import { useEffect, useState } from 'react';
import { Produto } from '@/types';
import { produtoService } from '@/services/produtoService';
import { Plus, Trash2, PackageCheck, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // Formulário
  const [sku, setSku] = useState('');
  const [codigoBarras, setCodigoBarras] = useState('');
  const [descricao, setDescricao] = useState('');
  const [unidadeMedida, setUnidadeMedida] = useState('UN');
  const [statusAtivo, setStatusAtivo] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);

  // Função auxiliar para buscar produtos após cadastro ou exclusão
  const buscarProdutos = async () => {
    try {
      const data = await produtoService.listarTodos();
      setProdutos(data);
      setErro('');
    } catch {
      setErro('Não foi possível conectar ao servidor backend.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const carregarInicial = async () => {
      try {
        const data = await produtoService.listarTodos();
        if (isMounted) {
          setProdutos(data);
          setErro('');
        }
      } catch {
        if (isMounted) {
          setErro('Não foi possível conectar ao servidor backend.');
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
      await produtoService.cadastrar({
        sku,
        codigoBarras,
        descricao,
        unidadeMedida,
        statusAtivo,
      });

      // Limpar formulário
      setSku('');
      setCodigoBarras('');
      setDescricao('');
      setMostrarForm(false);
      
      // Recarregar lista
      setCarregando(true);
      await buscarProdutos();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        alert(err.response.data.mensagem);
      } else {
        alert('Erro ao cadastrar produto.');
      }
    }
  };

  const handleExcluir = async (id?: number) => {
    if (!id || !confirm('Deseja realmente excluir este produto?')) return;
    try {
      await produtoService.excluir(id);
      setCarregando(true);
      await buscarProdutos();
    } catch {
      alert('Erro ao excluir produto.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho principal com cores ajustadas para Dark Mode */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Cadastro de Produtos
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Gerencie os itens do catálogo do mercado
          </p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {mostrarForm ? 'Fechar Formulário' : 'Novo Produto'}
        </button>
      </div>

      {erro && (
        <div className="p-4 bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {erro}
        </div>
      )}

      {/* Formulário de Cadastro com suporte a fundo escuro e campos nítidos */}
      {mostrarForm && (
        <form 
          onSubmit={handleCadastrar} 
          className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm space-y-4 border border-slate-200 dark:border-slate-800 transition-colors"
        >
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-2">
            Novo Produto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                SKU
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="PROD-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                Código de Barras
              </label>
              <input
                type="text"
                required
                value={codigoBarras}
                onChange={(e) => setCodigoBarras(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="7891234567890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                Unidade de Medida
              </label>
              <select
                value={unidadeMedida}
                onChange={(e) => setUnidadeMedida(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="UN">Unidade (UN)</option>
                <option value="KG">Quilograma (KG)</option>
                <option value="CX">Caixa (CX)</option>
                <option value="LT">Litro (LT)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                Descrição
              </label>
              <input
                type="text"
                required
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Arroz Tipo 1 - 5kg"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="statusAtivo"
                checked={statusAtivo}
                onChange={(e) => setStatusAtivo(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              />
              <label htmlFor="statusAtivo" className="text-sm text-slate-700 dark:text-slate-300">
                Ativo para Venda
              </label>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors"
            >
              Salvar Produto
            </button>
          </div>
        </form>
      )}

      {/* Tabela de Produtos com Dark Mode completo */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        {carregando ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            Carregando catálogo de produtos...
          </div>
        ) : produtos.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center gap-2">
            <PackageCheck className="w-10 h-10 text-slate-400 dark:text-slate-500" />
            Nenhum produto cadastrado no momento.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Cód. Barras</th>
                <th className="p-4">Descrição</th>
                <th className="p-4">UN</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {produtos.map((p) => (
                <tr key={p.idProduto} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono text-slate-500 dark:text-slate-400">
                    #{p.idProduto}
                  </td>
                  <td className="p-4 font-medium text-slate-800 dark:text-slate-100">
                    {p.sku}
                  </td>
                  <td className="p-4 font-mono text-slate-600 dark:text-slate-300">
                    {p.codigoBarras}
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-200">
                    {p.descricao}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">
                    {p.unidadeMedida}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        p.statusAtivo
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border dark:border-emerald-800/50'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400 dark:border dark:border-rose-800/50'
                      }`}
                    >
                      {p.statusAtivo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleExcluir(p.idProduto)}
                      className="text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 transition-colors p-1"
                      title="Excluir Produto"
                    >
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