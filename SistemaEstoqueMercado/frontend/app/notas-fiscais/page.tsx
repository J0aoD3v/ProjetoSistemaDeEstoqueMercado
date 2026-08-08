'use client';

import { useEffect, useState } from 'react';
import { NotaFiscal } from '@/types';
import { notaFiscalService } from '@/services/notaFiscalService';
import { Plus, Trash2, FileText, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { formatNFeKey } from '@/utils/masks';

export default function NotasFiscaisPage() {
  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [numeroNf, setNumeroNf] = useState('');
  const [serie, setSerie] = useState('');
  const [dataEmissao, setDataEmissao] = useState('');
  const [chaveAcessoNfe, setChaveAcessoNfe] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [idFornecedor, setIdFornecedor] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  const buscarNotas = async () => {
    try {
      const data = await notaFiscalService.listarTodos();
      setNotas(data);
      setErro('');
    } catch {
      setErro('Não foi possível carregar a lista de notas fiscais.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const carregarInicial = async () => {
      try {
        const data = await notaFiscalService.listarTodos();
        if (isMounted) {
          setNotas(data);
          setErro('');
        }
      } catch {
        if (isMounted) {
          setErro('Não foi possível carregar a lista de notas fiscais.');
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
      await notaFiscalService.cadastrar({
        numeroNf,
        serie,
        dataEmissao,
        chaveAcessoNfe,
        valorTotal: parseFloat(valorTotal),
        idFornecedor: parseInt(idFornecedor),
      });
      setNumeroNf('');
      setSerie('');
      setDataEmissao('');
      setChaveAcessoNfe('');
      setValorTotal('');
      setIdFornecedor('');
      setMostrarForm(false);
      setCarregando(true);
      await buscarNotas();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        alert(err.response.data.mensagem);
      } else {
        alert('Erro ao cadastrar nota fiscal.');
      }
    }
  };

  const handleExcluir = async (id?: number) => {
    if (!id || !confirm('Deseja excluir esta nota fiscal?')) return;
    try {
      await notaFiscalService.excluir(id);
      setCarregando(true);
      await buscarNotas();
    } catch {
      alert('Erro ao excluir nota fiscal.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Notas Fiscais</h1>
          <p className="mt-1 text-base text-muted">Gestão das notas fiscais de entrada</p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="flex items-center justify-center gap-2 rounded-lg bg-info px-4 py-2.5 font-semibold text-foreground shadow-sm transition-colors hover:bg-info-hover"
        >
          <Plus className="w-4 h-4" />
          {mostrarForm ? 'Fechar Formulário' : 'Nova Nota Fiscal'}
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
          <h2 className="text-lg font-semibold text-foreground border-b pb-2">Cadastrar Nota Fiscal</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Número NF</label>
              <input
                type="text"
                required
                value={numeroNf}
                onChange={(e) => setNumeroNf(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none"
                placeholder="12345"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Série</label>
              <input
                type="text"
                required
                value={serie}
                onChange={(e) => setSerie(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none"
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Data Emissão</label>
              <input
                type="date"
                required
                value={dataEmissao}
                onChange={(e) => setDataEmissao(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted mb-1">Chave de Acesso NFE</label>
              <input
                type="text"
                required
                value={formatNFeKey(chaveAcessoNfe)}
                onChange={(e) => setChaveAcessoNfe(formatNFeKey(e.target.value))}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none"
                placeholder="chave de 44 dígitos"
                maxLength={44}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Valor Total (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                value={valorTotal}
                onChange={(e) => setValorTotal(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">ID Fornecedor</label>
              <input
                type="number"
                required
                value={idFornecedor}
                onChange={(e) => setIdFornecedor(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none"
                placeholder="1"
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
          <div className="p-8 text-center text-muted">Carregando notas fiscais...</div>
        ) : notas.length === 0 ? (
          <div className="p-8 text-center text-muted flex flex-col items-center gap-2">
            <FileText className="w-10 h-10 text-muted" />
            Nenhuma nota fiscal cadastrada.
          </div>
        ) : (
          <table className="w-full min-w-200 border-collapse text-left text-base">
            <thead className="border-b border-border bg-surface text-xs font-bold uppercase tracking-wider text-foreground">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Número NF</th>
                <th className="p-4">Série</th>
                <th className="p-4">Data Emissão</th>
                <th className="p-4">Valor Total</th>
                <th className="p-4">Fornecedor ID</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {notas.map((n) => (
                <tr key={n.idNotaFiscal} className="transition-colors hover:bg-surface-hover">
                  <td className="p-4 font-mono text-muted">#{n.idNotaFiscal}</td>
                  <td className="p-4 font-medium text-foreground">{n.numeroNf}</td>
                  <td className="p-4 text-muted">{n.serie}</td>
                  <td className="p-4 text-muted">{n.dataEmissao ? new Date(n.dataEmissao).toLocaleDateString('pt-BR') : '-'}</td>
                  <td className="p-4 text-foreground font-semibold">
                    {n.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="p-4 font-mono text-muted">#{n.idFornecedor}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleExcluir(n.idNotaFiscal)} className="text-muted hover:text-danger p-1">
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









