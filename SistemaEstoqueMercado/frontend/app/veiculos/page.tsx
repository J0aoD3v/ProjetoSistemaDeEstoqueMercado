'use client';

import { useEffect, useState, useCallback } from 'react';
import { Veiculo } from '@/types';
import { veiculoService } from '@/services/veiculoService';
import { Plus, Trash2, Truck, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { formatPlate } from '@/utils/masks';
import { validarPlaca, validarCampoObrigatorio } from '@/utils/validators';

export default function VeiculosPage() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroGeral, setErroGeral] = useState('');

  const [placa, setPlaca] = useState('');
  const [tipoVeiculo, setTipoVeiculo] = useState('');
  const [marcaModelo, setMarcaModelo] = useState('');
  const [transportadora, setTransportadora] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  const [erroPlaca, setErroPlaca] = useState('');
  const [erroTipoVeiculo, setErroTipoVeiculo] = useState('');
  const [erroMarcaModelo, setErroMarcaModelo] = useState('');
  const [erroTransportadora, setErroTransportadora] = useState('');

  const carregarVeiculos = useCallback(async () => {
    try {
      setCarregando(true);
      const data = await veiculoService.listarTodos();
      setVeiculos(data);
      setErroGeral('');
    } catch {
      setErroGeral('Não foi possível carregar a lista de veículos.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await carregarVeiculos();
    })();
  }, [carregarVeiculos]);

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    const msgPlaca = validarPlaca(placa);
    const msgTipo = validarCampoObrigatorio(tipoVeiculo, 'Tipo de veículo');
    const msgMarca = validarCampoObrigatorio(marcaModelo, 'Marca/Modelo');
    const msgTransp = validarCampoObrigatorio(transportadora, 'Transportadora');

    setErroPlaca(msgPlaca || '');
    setErroTipoVeiculo(msgTipo || '');
    setErroMarcaModelo(msgMarca || '');
    setErroTransportadora(msgTransp || '');

    if (msgPlaca || msgTipo || msgMarca || msgTransp) return;

    try {
      await veiculoService.cadastrar({ placa, tipoVeiculo, marcaModelo, transportadora });
      setPlaca('');
      setTipoVeiculo('');
      setMarcaModelo('');
      setTransportadora('');
      setMostrarForm(false);
      setErroPlaca('');
      setErroTipoVeiculo('');
      setErroMarcaModelo('');
      setErroTransportadora('');
      await carregarVeiculos();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        const msg = err.response.data.mensagem;
        if (msg.toLowerCase().includes('placa')) setErroPlaca(msg);
        else if (msg.toLowerCase().includes('tipo')) setErroTipoVeiculo(msg);
        else if (msg.toLowerCase().includes('marca') || msg.toLowerCase().includes('modelo')) setErroMarcaModelo(msg);
        else if (msg.toLowerCase().includes('transportadora')) setErroTransportadora(msg);
        else setErroGeral(msg);
      } else {
        setErroGeral('Erro ao cadastrar veículo.');
      }
    }
  };

  const handleExcluir = async (id?: number) => {
    if (!id || !confirm('Deseja excluir este veículo?')) return;
    try {
      await veiculoService.excluir(id);
      await carregarVeiculos();
    } catch {
      setErroGeral('Erro ao excluir veículo.');
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
          onClick={() => { setMostrarForm(!mostrarForm); setErroPlaca(''); setErroTipoVeiculo(''); setErroMarcaModelo(''); setErroTransportadora(''); }}
          className="flex items-center justify-center gap-2 rounded-lg bg-warning px-4 py-2.5 font-semibold text-foreground shadow-sm transition-colors hover:bg-warning-hover"
        >
          <Plus className="w-4 h-4" />
          {mostrarForm ? 'Fechar Formulário' : 'Novo Veículo'}
        </button>
      </div>

      {erroGeral && (
        <div className="flex items-center gap-3 rounded-lg border border-danger/50 bg-danger/10 p-4 font-medium text-danger">
          <AlertCircle className="w-5 h-5" />
          {erroGeral}
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
                onChange={(e) => { setPlaca(formatPlate(e.target.value)); setErroPlaca(''); }}
                onBlur={() => setErroPlaca(validarPlaca(placa) || '')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 outline-none ${erroPlaca ? 'border-danger focus:ring-danger' : 'border-border focus:ring-warning'}`}
                placeholder="ABC-1234"
                maxLength={8}
              />
              {erroPlaca && <p className="text-xs text-danger mt-1">{erroPlaca}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Tipo de Veículo</label>
              <input
                type="text"
                required
                value={tipoVeiculo}
                onChange={(e) => { setTipoVeiculo(e.target.value); setErroTipoVeiculo(''); }}
                onBlur={() => setErroTipoVeiculo(validarCampoObrigatorio(tipoVeiculo, 'Tipo de veículo') || '')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 outline-none ${erroTipoVeiculo ? 'border-danger focus:ring-danger' : 'border-border focus:ring-warning'}`}
                placeholder="Caminhão"
              />
              {erroTipoVeiculo && <p className="text-xs text-danger mt-1">{erroTipoVeiculo}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Marca/Modelo</label>
              <input
                type="text"
                required
                value={marcaModelo}
                onChange={(e) => { setMarcaModelo(e.target.value); setErroMarcaModelo(''); }}
                onBlur={() => setErroMarcaModelo(validarCampoObrigatorio(marcaModelo, 'Marca/Modelo') || '')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 outline-none ${erroMarcaModelo ? 'border-danger focus:ring-danger' : 'border-border focus:ring-warning'}`}
                placeholder="Volvo FH 540"
              />
              {erroMarcaModelo && <p className="text-xs text-danger mt-1">{erroMarcaModelo}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Transportadora</label>
              <input
                type="text"
                required
                value={transportadora}
                onChange={(e) => { setTransportadora(e.target.value); setErroTransportadora(''); }}
                onBlur={() => setErroTransportadora(validarCampoObrigatorio(transportadora, 'Transportadora') || '')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 outline-none ${erroTransportadora ? 'border-danger focus:ring-danger' : 'border-border focus:ring-warning'}`}
                placeholder="Transportes XYZ"
              />
              {erroTransportadora && <p className="text-xs text-danger mt-1">{erroTransportadora}</p>}
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
