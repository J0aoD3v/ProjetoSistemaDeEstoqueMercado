'use client';

import { useEffect, useState } from 'react';
import { Localizacao } from '@/types';
import { localizacaoService } from '@/services/localizacaoService';
import { Plus, Trash2, MapPin, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { formatCodigoPosicao } from '@/utils/masks';

export default function LocalizacoesPage() {
  const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [codigoPosicao, setCodigoPosicao] = useState('');
  const [tipoArmazenamento, setTipoArmazenamento] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  const buscarLocalizacoes = async () => {
    try {
      const data = await localizacaoService.listarTodos();
      setLocalizacoes(data);
      setErro('');
    } catch {
      setErro('Não foi possível carregar a lista de localizações.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const carregarInicial = async () => {
      try {
        const data = await localizacaoService.listarTodos();
        if (isMounted) {
          setLocalizacoes(data);
          setErro('');
        }
      } catch {
        if (isMounted) {
          setErro('Não foi possível carregar a lista de localizações.');
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
      await localizacaoService.cadastrar({ codigoPosicao, tipoArmazenamento });
      setCodigoPosicao('');
      setTipoArmazenamento('');
      setMostrarForm(false);
      setCarregando(true);
      await buscarLocalizacoes();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        alert(err.response.data.mensagem);
      } else {
        alert('Erro ao cadastrar localização.');
      }
    }
  };

  const handleExcluir = async (id?: number) => {
    if (!id || !confirm('Deseja excluir esta localização?')) return;
    try {
      await localizacaoService.excluir(id);
      setCarregando(true);
      await buscarLocalizacoes();
    } catch {
      alert('Erro ao excluir localização.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Localizações</h1>
          <p className="mt-1 text-base text-muted">Gestão dos pontos de armazenamento</p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-semibold text-foreground shadow-sm transition-colors hover:bg-accent-hover"
        >
          <Plus className="w-4 h-4" />
          {mostrarForm ? 'Fechar Formulário' : 'Nova Localização'}
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
          <h2 className="text-lg font-semibold text-foreground border-b pb-2">Cadastrar Localização</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Código da Posição</label>
              <input
                type="text"
                required
                value={formatCodigoPosicao(codigoPosicao)}
                onChange={(e) => setCodigoPosicao(formatCodigoPosicao(e.target.value))}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none"
                placeholder="A-01-02"
                maxLength={8}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Tipo de Armazenamento</label>
              <input
                type="text"
                required
                value={tipoArmazenamento}
                onChange={(e) => setTipoArmazenamento(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none"
                placeholder="Prateleira / Pallet"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" className="bg-accent hover:bg-accent-hover text-foreground px-6 py-2 rounded-lg font-medium text-sm">
              Salvar
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-background">
        {carregando ? (
          <div className="p-8 text-center text-muted">Carregando localizações...</div>
        ) : localizacoes.length === 0 ? (
          <div className="p-8 text-center text-muted flex flex-col items-center gap-2">
            <MapPin className="w-10 h-10 text-muted" />
            Nenhuma localização cadastrada.
          </div>
        ) : (
          <table className="w-full min-w-125 border-collapse text-left text-base">
            <thead className="border-b border-border bg-surface text-xs font-bold uppercase tracking-wider text-foreground">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Código Posição</th>
                <th className="p-4">Tipo Armazenamento</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {localizacoes.map((loc) => (
                <tr key={loc.idLocalizacao} className="transition-colors hover:bg-surface-hover">
                  <td className="p-4 font-mono text-muted">#{loc.idLocalizacao}</td>
                  <td className="p-4 font-mono text-foreground">{loc.codigoPosicao}</td>
                  <td className="p-4 text-muted">{loc.tipoArmazenamento}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleExcluir(loc.idLocalizacao)} className="text-muted hover:text-danger p-1">
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









