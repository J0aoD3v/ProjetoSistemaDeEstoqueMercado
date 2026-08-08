'use client';

import { useEffect, useState } from 'react';
import { ItemRecebimento } from '@/types';
import { itemRecebimentoService } from '@/services/itemRecebimentoService';
import { Plus, Trash2, Calculator, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useProductSearch } from '@/hooks/useProductSearch';

export default function ItensRecebimentoPage() {
  const [itens, setItens] = useState<ItemRecebimento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [quantidadeDeclarada, setQuantidadeDeclarada] = useState('');
  const [quantidadeConferida, setQuantidadeConferida] = useState('');
  const [idRecebimento, setIdRecebimento] = useState('');
  const [idLocalizacao, setIdLocalizacao] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  const produtoSearch = useProductSearch({
    onSelect: (p) => {
      setIdLote(p.idProduto ?? '');
    },
  });

  const [idLote, setIdLote] = useState('');

  const buscarItens = async () => {
    try {
      const data = await itemRecebimentoService.listarTodos();
      setItens(data);
      setErro('');
    } catch {
      setErro('Não foi possível carregar a lista de itens de recebimento.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const carregarInicial = async () => {
      try {
        const data = await itemRecebimentoService.listarTodos();
        if (isMounted) {
          setItens(data);
          setErro('');
        }
      } catch {
        if (isMounted) {
          setErro('Não foi possível carregar a lista de itens de recebimento.');
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
      await itemRecebimentoService.cadastrar({
        quantidadeDeclarada: parseFloat(quantidadeDeclarada),
        quantidadeConferida: parseFloat(quantidadeConferida),
        idRecebimento: parseInt(idRecebimento),
        idLote: parseInt(idLote),
        idLocalizacao: parseInt(idLocalizacao),
      });
      setQuantidadeDeclarada('');
      setQuantidadeConferida('');
      setIdRecebimento('');
      setIdLote('');
      setIdLocalizacao('');
      produtoSearch.setTermo('');
      setMostrarForm(false);
      setCarregando(true);
      await buscarItens();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        alert(err.response.data.mensagem);
      } else {
        alert('Erro ao cadastrar item de recebimento.');
      }
    }
  };

  const handleExcluir = async (id?: number) => {
    if (!id || !confirm('Deseja excluir este item?')) return;
    try {
      await itemRecebimentoService.excluir(id);
      setCarregando(true);
      await buscarItens();
    } catch {
      alert('Erro ao excluir item.');
    }
  };

  const handleCalcularDivergencia = async () => {
    if (!quantidadeDeclarada || !quantidadeConferida || !idLote) {
      alert('Preencha Quantidade Declarada, Quantidade Conferida e ID do Lote para calcular.');
      return;
    }
    try {
      const valor = await itemRecebimentoService.calcularDivergencia({
        quantidadeDeclarada: parseFloat(quantidadeDeclarada),
        quantidadeConferida: parseFloat(quantidadeConferida),
        idRecebimento: idRecebimento ? parseInt(idRecebimento) : 0,
        idLote: parseInt(idLote),
        idLocalizacao: idLocalizacao ? parseInt(idLocalizacao) : 0,
      });
      alert(`Divergência calculada: ${valor}`);
    } catch {
      alert('Erro ao calcular divergência.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Itens de Recebimento</h1>
          <p className="mt-1 text-base text-muted">Gestão dos itens conferidos no recebimento</p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="flex items-center justify-center gap-2 rounded-lg bg-info px-4 py-2.5 font-semibold text-foreground shadow-sm transition-colors hover:bg-info-hover"
        >
          <Plus className="w-4 h-4" />
          {mostrarForm ? 'Fechar Formulário' : 'Novo Item'}
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
          <h2 className="text-lg font-semibold text-foreground border-b pb-2">Cadastrar Item de Recebimento</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Qtd. Declarada</label>
              <input
                type="number"
                step="0.01"
                required
                value={quantidadeDeclarada}
                onChange={(e) => setQuantidadeDeclarada(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Qtd. Conferida</label>
              <input
                type="number"
                step="0.01"
                required
                value={quantidadeConferida}
                onChange={(e) => setQuantidadeConferida(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">ID Recebimento</label>
              <input
                type="number"
                required
                value={idRecebimento}
                onChange={(e) => setIdRecebimento(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none"
                placeholder="1"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-muted mb-1">Produto / Lote</label>
              <input
                type="text"
                required
                value={produtoSearch.termo}
                onChange={(e) => produtoSearch.setTermo(e.target.value)}
                onBlur={() => setTimeout(produtoSearch.fechar, 150)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none"
                placeholder="Buscar produto por SKU, código ou descrição..."
              />
              {produtoSearch.aberto && (
                <ul className="absolute z-10 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-48 overflow-auto">
                  {produtoSearch.carregando ? (
                    <li className="p-3 text-sm text-muted">Carregando...</li>
                  ) : (
                    produtoSearch.sugestoes.map((p) => (
                      <li
                        key={p.idProduto}
                        onMouseDown={() => produtoSearch.selecionar(p)}
                        className="cursor-pointer px-3 py-2 text-sm hover:bg-surface-hover"
                      >
                        <span className="font-medium text-foreground">{p.sku}</span>
                        <span className="text-muted"> - {p.descricao}</span>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">ID Localização</label>
              <input
                type="number"
                required
                value={idLocalizacao}
                onChange={(e) => setIdLocalizacao(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none"
                placeholder="1"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCalcularDivergencia}
              className="flex items-center gap-2 rounded-lg border border-info/50 bg-info/10 px-4 py-2 text-sm font-medium text-info transition-colors hover:bg-info-hover"
            >
              <Calculator className="w-4 h-4" />
              Calcular Divergência
            </button>
            <button type="submit" className="bg-info hover:bg-info-hover text-foreground px-6 py-2 rounded-lg font-medium text-sm">
              Salvar
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-background">
        {carregando ? (
          <div className="p-8 text-center text-muted">Carregando itens de recebimento...</div>
        ) : itens.length === 0 ? (
          <div className="p-8 text-center text-muted flex flex-col items-center gap-2">
            Nenhum item de recebimento cadastrado.
          </div>
        ) : (
          <table className="w-full min-w-175 border-collapse text-left text-base">
            <thead className="border-b border-border bg-surface text-xs font-bold uppercase tracking-wider text-foreground">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Qtd. Declarada</th>
                <th className="p-4">Qtd. Conferida</th>
                <th className="p-4">ID Recebimento</th>
                <th className="p-4">ID Lote</th>
                <th className="p-4">ID Localização</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {itens.map((item) => (
                <tr key={item.idItemRecebimento} className="transition-colors hover:bg-surface-hover">
                  <td className="p-4 font-mono text-muted">#{item.idItemRecebimento}</td>
                  <td className="p-4 text-foreground font-medium">{item.quantidadeDeclarada}</td>
                  <td className="p-4 text-muted">{item.quantidadeConferida}</td>
                  <td className="p-4 font-mono text-muted">#{item.idRecebimento}</td>
                  <td className="p-4 font-mono text-muted">#{item.idLote}</td>
                  <td className="p-4 font-mono text-muted">#{item.idLocalizacao}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleExcluir(item.idItemRecebimento)} className="text-muted hover:text-danger p-1">
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









