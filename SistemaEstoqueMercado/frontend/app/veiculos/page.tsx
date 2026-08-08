'use client';

import { useEffect, useState } from 'react';
import { Veiculo } from '@/types';
import { veiculoService } from '@/services/veiculoService';
import { Plus, Trash2, Truck, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { formatPlate } from '@/utils/masks';

export default function VeiculosPage() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [placa, setPlaca] = useState('');
  const [tipoVeiculo, setTipoVeiculo] = useState('');
  const [marcaModelo, setMarcaModelo] = useState('');
  const [transportadora, setTransportadora] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  const buscarVeiculos = async () => {
    try {
      const data = await veiculoService.listarTodos();
      setVeiculos(data);
      setErro('');
    } catch {
      setErro('Não foi possível carregar a lista de veículos.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const carregarInicial = async () => {
      try {
        const data = await veiculoService.listarTodos();
        if (isMounted) {
          setVeiculos(data);
          setErro('');
        }
      } catch {
        if (isMounted) {
          setErro('Não foi possível carregar a lista de veículos.');
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
      await veiculoService.cadastrar({ placa, tipoVeiculo, marcaModelo, transportadora });
      setPlaca('');
      setTipoVeiculo('');
      setMarcaModelo('');
      setTransportadora('');
      setMostrarForm(false);
      setCarregando(true);
      await buscarVeiculos();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        alert(err.response.data.mensagem);
      } else {
        alert('Erro ao cadastrar veículo.');
      }
    }
  };

  const handleExcluir = async (id?: number) => {
    if (!id || !confirm('Deseja excluir este veículo?')) return;
    try {
      await veiculoService.excluir(id);
      setCarregando(true);
      await buscarVeiculos();
    } catch {
      alert('Erro ao excluir veículo.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Veículos</h1>
          <p className="mt-1 text-base text-muted">Gestão dos veículos cadastrados</p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="flex items-center justify-center gap-2 rounded-lg bg-warning px-4 py-2.5 font-semibold text-foreground shadow-sm transition-colors hover:bg-warning-hover"
        >
          <Plus className="w-4 h-4" />
          {mostrarForm ? 'Fechar Formulário' : 'Novo Veículo'}
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
          <h2 className="text-lg font-semibold text-foreground border-b pb-2">Cadastrar Veículo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Placa</label>
              <input
                type="text"
                required
                value={formatPlate(placa)}
                onChange={(e) => setPlaca(formatPlate(e.target.value))}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none"
                placeholder="ABC-1234"
                maxLength={8}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Tipo de Veículo</label>
              <input
                type="text"
                required
                value={tipoVeiculo}
                onChange={(e) => setTipoVeiculo(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none"
                placeholder="Caminhão"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Marca/Modelo</label>
              <input
                type="text"
                required
                value={marcaModelo}
                onChange={(e) => setMarcaModelo(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none"
                placeholder="Volvo FH 540"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Transportadora</label>
              <input
                type="text"
                required
                value={transportadora}
                onChange={(e) => setTransportadora(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none"
                placeholder="Transportes XYZ"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" className="bg-warning hover:bg-warning-hover text-foreground px-6 py-2 rounded-lg font-medium text-sm">
              Salvar
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-background">
        {carregando ? (
          <div className="p-8 text-center text-muted">Carregando veículos...</div>
        ) : veiculos.length === 0 ? (
          <div className="p-8 text-center text-muted flex flex-col items-center gap-2">
            <Truck className="w-10 h-10 text-muted" />
            Nenhum veículo cadastrado.
          </div>
        ) : (
          <table className="w-full min-w-175 border-collapse text-left text-base">
            <thead className="border-b border-border bg-surface text-xs font-bold uppercase tracking-wider text-foreground">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Placa</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Marca/Modelo</th>
                <th className="p-4">Transportadora</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {veiculos.map((v) => (
                <tr key={v.idVeiculo} className="transition-colors hover:bg-surface-hover">
                  <td className="p-4 font-mono text-muted">#{v.idVeiculo}</td>
                  <td className="p-4 font-mono text-foreground">{v.placa}</td>
                  <td className="p-4 text-muted">{v.tipoVeiculo}</td>
                  <td className="p-4 text-muted">{v.marcaModelo}</td>
                  <td className="p-4 text-muted">{v.transportadora}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleExcluir(v.idVeiculo)} className="text-muted hover:text-danger p-1">
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









