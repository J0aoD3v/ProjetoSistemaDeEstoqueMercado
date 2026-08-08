'use client';

import { useEffect, useState, useCallback } from 'react';
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

  const carregarProdutos = useCallback(async () => {
    try {
      setCarregando(true);
      const data = await produtoService.listarTodos();
      setProdutos(data);
      setErro('');
    } catch {
      setErro('Não foi possível conectar ao servidor backend.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await carregarProdutos();
    })();
  }, [carregarProdutos]);

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
      carregarProdutos();
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
      carregarProdutos();
    } catch {
      alert('Erro ao excluir produto.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Cadastro de Produtos</h1>
          <p className="mt-1 text-base text-slate-600 dark:text-slate-300">Gerencie os itens do catálogo do mercado</p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800"
        >
          <Plus className="w-4 h-4" />
          {mostrarForm ? 'Fechar Formulário' : 'Novo Produto'}
        </button>
      </div>

      {erro && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-900/50 dark:bg-red-950/60 dark:text-red-200">
          <AlertCircle className="w-5 h-5" />
          {erro}
        </div>
      )}

      {/* Form de Cadastro */}
      {mostrarForm && (
        <form onSubmit={handleCadastrar} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="border-b border-slate-200 pb-2 text-lg font-semibold text-slate-900 dark:border-slate-700 dark:text-slate-100">Novo Produto</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">SKU</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                placeholder="PROD-001"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">Código de Barras</label>
              <input
                type="text"
                required
                value={codigoBarras}
                onChange={(e) => setCodigoBarras(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                placeholder="7891234567890"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">Unidade de Medida</label>
              <select
                value={unidadeMedida}
                onChange={(e) => setUnidadeMedida(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="UN">Unidade (UN)</option>
                <option value="KG">Quilograma (KG)</option>
                <option value="CX">Caixa (CX)</option>
                <option value="LT">Litro (LT)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">Descrição</label>
              <input
                type="text"
                required
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                placeholder="Arroz Tipo 1 - 5kg"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="statusAtivo"
                checked={statusAtivo}
                onChange={(e) => setStatusAtivo(e.target.checked)}
                className="h-4 w-4 rounded text-emerald-600"
              />
              <label htmlFor="statusAtivo" className="text-sm font-medium text-slate-700 dark:text-slate-200">Ativo para Venda</label>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800"
            >
              Salvar Produto
            </button>
          </div>
        </form>
      )}

      {/* Tabela de Produtos */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        {carregando ? (
          <div className="p-8 text-center text-slate-600 dark:text-slate-300">Carregando catálogo de produtos...</div>
        ) : produtos.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-8 text-center text-slate-600 dark:text-slate-300">
            <PackageCheck className="w-10 h-10 text-slate-400 dark:text-slate-500" />
            Nenhum produto cadastrado no momento.
          </div>
        ) : (
          <table className="w-full min-w-[760px] border-collapse text-left text-base">
            <thead className="border-b border-slate-200 bg-slate-100 text-xs font-bold uppercase tracking-wider text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
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
            <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
              {produtos.map((p) => (
                <tr key={p.idProduto} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60">
                  <td className="p-4 font-mono text-slate-600 dark:text-slate-300">#{p.idProduto}</td>
                  <td className="p-4 font-medium text-slate-900 dark:text-slate-100">{p.sku}</td>
                  <td className="p-4 font-mono text-slate-600 dark:text-slate-300">{p.codigoBarras}</td>
                  <td className="p-4 text-slate-700 dark:text-slate-200">{p.descricao}</td>
                  <td className="p-4 text-slate-700 dark:text-slate-200">{p.unidadeMedida}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        p.statusAtivo
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200'
                      }`}
                    >
                      {p.statusAtivo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleExcluir(p.idProduto)}
                      className="rounded-md p-1 text-slate-500 transition-colors hover:text-rose-600 dark:text-slate-400"
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
