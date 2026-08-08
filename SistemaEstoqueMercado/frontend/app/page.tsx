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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cadastro de Produtos</h1>
          <p className="text-sm text-slate-500">Gerencie os itens do catálogo do mercado</p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          {mostrarForm ? 'Fechar Formulário' : 'Novo Produto'}
        </button>
      </div>

      {erro && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          {erro}
        </div>
      )}

      {/* Form de Cadastro */}
      {mostrarForm && (
        <form onSubmit={handleCadastrar} className="bg-white p-6 rounded-xl shadow-sm space-y-4 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-700 border-b pb-2">Novo Produto</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">SKU</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="PROD-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Código de Barras</label>
              <input
                type="text"
                required
                value={codigoBarras}
                onChange={(e) => setCodigoBarras(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="7891234567890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Unidade de Medida</label>
              <select
                value={unidadeMedida}
                onChange={(e) => setUnidadeMedida(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="UN">Unidade (UN)</option>
                <option value="KG">Quilograma (KG)</option>
                <option value="CX">Caixa (CX)</option>
                <option value="LT">Litro (LT)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-600 mb-1">Descrição</label>
              <input
                type="text"
                required
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Arroz Tipo 1 - 5kg"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="statusAtivo"
                checked={statusAtivo}
                onChange={(e) => setStatusAtivo(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <label htmlFor="statusAtivo" className="text-sm text-slate-700">Ativo para Venda</label>
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

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {carregando ? (
          <div className="p-8 text-center text-slate-500">Carregando catálogo de produtos...</div>
        ) : produtos.length === 0 ? (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
            <PackageCheck className="w-10 h-10 text-slate-400" />
            Nenhum produto cadastrado no momento.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
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
            <tbody className="divide-y divide-slate-100 text-sm">
              {produtos.map((p) => (
                <tr key={p.idProduto} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono text-slate-500">#{p.idProduto}</td>
                  <td className="p-4 font-medium text-slate-800">{p.sku}</td>
                  <td className="p-4 font-mono text-slate-600">{p.codigoBarras}</td>
                  <td className="p-4 text-slate-700">{p.descricao}</td>
                  <td className="p-4 text-slate-600">{p.unidadeMedida}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        p.statusAtivo
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {p.statusAtivo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleExcluir(p.idProduto)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
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