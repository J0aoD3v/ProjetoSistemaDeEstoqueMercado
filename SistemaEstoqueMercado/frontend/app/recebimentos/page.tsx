'use client';

import { useEffect, useState, useCallback } from 'react';
import { Recebimento, NotaFiscal, Funcionario, Motorista, Veiculo } from '@/types';
import { recebimentoService } from '@/services/recebimentoService';
import { notaFiscalService } from '@/services/notaFiscalService';
import { funcionarioService } from '@/services/funcionarioService';
import { motoristaService } from '@/services/motoristaService';
import { veiculoService } from '@/services/veiculoService';
import { Plus, Trash2, Edit, Truck, AlertCircle, X, Check } from 'lucide-react';
import axios from 'axios';
import { validarCampoObrigatorio } from '@/utils/validators';

export default function RecebimentosPage() {
  const [recebimentos, setRecebimentos] = useState<Recebimento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroGeral, setErroGeral] = useState('');

  const [dataHoraChegada, setDataHoraChegada] = useState('');
  const [statusRecebimento, setStatusRecebimento] = useState('EM_CONFERENCIA');
  const [idNotaFiscal, setIdNotaFiscal] = useState('');
  const [idFuncionario, setIdFuncionario] = useState('');
  const [idMotorista, setIdMotorista] = useState('');
  const [idVeiculo, setIdVeiculo] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  const [notasFiscais, setNotasFiscais] = useState<NotaFiscal[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);

  const [erroDataHoraChegada, setErroDataHoraChegada] = useState('');
  const [erroIdNotaFiscal, setErroIdNotaFiscal] = useState('');
  const [erroIdFuncionario, setErroIdFuncionario] = useState('');
  const [erroIdMotorista, setErroIdMotorista] = useState('');
  const [erroIdVeiculo, setErroIdVeiculo] = useState('');

  const [editDataHoraChegada, setEditDataHoraChegada] = useState('');
  const [editStatusRecebimento, setEditStatusRecebimento] = useState('');
  const [editIdNotaFiscal, setEditIdNotaFiscal] = useState('');
  const [editIdFuncionario, setEditIdFuncionario] = useState('');
  const [editIdMotorista, setEditIdMotorista] = useState('');
  const [editIdVeiculo, setEditIdVeiculo] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [editErroDataHoraChegada, setEditErroDataHoraChegada] = useState('');
  const [editErroIdNotaFiscal, setEditErroIdNotaFiscal] = useState('');
  const [editErroIdFuncionario, setEditErroIdFuncionario] = useState('');
  const [editErroIdMotorista, setEditErroIdMotorista] = useState('');
  const [editErroIdVeiculo, setEditErroIdVeiculo] = useState('');

  const carregarRecebimentos = useCallback(async () => {
    try {
      const data = await recebimentoService.listarTodos();
      setRecebimentos(data);
      setErroGeral('');
    } catch {
      setErroGeral('Não foi possível carregar a lista de recebimentos.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await carregarRecebimentos();
    })();
  }, [carregarRecebimentos]);

  const carregarOpcoes = useCallback(async () => {
    try {
      const [notas, funcs, mots, veics] = await Promise.all([
        notaFiscalService.listarTodos(),
        funcionarioService.listarTodos(),
        motoristaService.listarTodos(),
        veiculoService.listarTodos(),
      ]);
      setNotasFiscais(notas);
      setFuncionarios(funcs);
      setMotoristas(mots);
      setVeiculos(veics);
    } catch {
      setNotasFiscais([]);
      setFuncionarios([]);
      setMotoristas([]);
      setVeiculos([]);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await carregarOpcoes();
    })();
  }, [carregarOpcoes]);

  const mapearErroBackend = (mensagem: string) => {
    const msg = mensagem.toLowerCase();
    if (msg.includes('datahora') || msg.includes('data') || msg.includes('chegada')) {
      setErroDataHoraChegada(mensagem);
    } else if (msg.includes('notafiscal') || msg.includes('nota fiscal')) {
      setErroIdNotaFiscal(mensagem);
    } else if (msg.includes('funcionario') || msg.includes('funcionário')) {
      setErroIdFuncionario(mensagem);
    } else if (msg.includes('motorista')) {
      setErroIdMotorista(mensagem);
    } else if (msg.includes('veiculo') || msg.includes('veículo')) {
      setErroIdVeiculo(mensagem);
    } else {
      setErroGeral(mensagem);
    }
  };

  const mapearErroBackendEdicao = (mensagem: string) => {
    const msg = mensagem.toLowerCase();
    if (msg.includes('datahora') || msg.includes('data') || msg.includes('chegada')) {
      setEditErroDataHoraChegada(mensagem);
    } else if (msg.includes('notafiscal') || msg.includes('nota fiscal')) {
      setEditErroIdNotaFiscal(mensagem);
    } else if (msg.includes('funcionario') || msg.includes('funcionário')) {
      setEditErroIdFuncionario(mensagem);
    } else if (msg.includes('motorista')) {
      setEditErroIdMotorista(mensagem);
    } else if (msg.includes('veiculo') || msg.includes('veículo')) {
      setEditErroIdVeiculo(mensagem);
    } else {
      setErroGeral(mensagem);
    }
  };

  const validarFormulario = () => {
    const eData = validarCampoObrigatorio(dataHoraChegada, 'Data/Hora Chegada');
    const eNota = validarCampoObrigatorio(idNotaFiscal, 'Nota Fiscal');
    const eFunc = validarCampoObrigatorio(idFuncionario, 'Funcionário');
    const eMot = validarCampoObrigatorio(idMotorista, 'Motorista');
    const eVeic = validarCampoObrigatorio(idVeiculo, 'Veículo');
    setErroDataHoraChegada(eData || '');
    setErroIdNotaFiscal(eNota || '');
    setErroIdFuncionario(eFunc || '');
    setErroIdMotorista(eMot || '');
    setErroIdVeiculo(eVeic || '');
    return !(eData || eNota || eFunc || eMot || eVeic);
  };

  const validarFormularioEdicao = () => {
    const eData = validarCampoObrigatorio(editDataHoraChegada, 'Data/Hora Chegada');
    const eNota = validarCampoObrigatorio(editIdNotaFiscal, 'Nota Fiscal');
    const eFunc = validarCampoObrigatorio(editIdFuncionario, 'Funcionário');
    const eMot = validarCampoObrigatorio(editIdMotorista, 'Motorista');
    const eVeic = validarCampoObrigatorio(editIdVeiculo, 'Veículo');
    setEditErroDataHoraChegada(eData || '');
    setEditErroIdNotaFiscal(eNota || '');
    setEditErroIdFuncionario(eFunc || '');
    setEditErroIdMotorista(eMot || '');
    setEditErroIdVeiculo(eVeic || '');
    return !(eData || eNota || eFunc || eMot || eVeic);
  };

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    try {
      await recebimentoService.cadastrar({
        dataHoraChegada: new Date(dataHoraChegada).toISOString(),
        statusRecebimento,
        idNotaFiscal: parseInt(idNotaFiscal),
        idFuncionario: parseInt(idFuncionario),
        idMotorista: parseInt(idMotorista),
        idVeiculo: parseInt(idVeiculo),
      });
      setDataHoraChegada('');
      setStatusRecebimento('EM_CONFERENCIA');
      setIdNotaFiscal('');
      setIdFuncionario('');
      setIdMotorista('');
      setIdVeiculo('');
      setErroDataHoraChegada('');
      setErroIdNotaFiscal('');
      setErroIdFuncionario('');
      setErroIdMotorista('');
      setErroIdVeiculo('');
      setMostrarForm(false);
      await carregarRecebimentos();
    } catch (err) {
      setErroGeral('');
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        mapearErroBackend(err.response.data.mensagem);
      } else {
        setErroGeral('Erro ao cadastrar recebimento.');
      }
    }
  };

  const handleExcluir = async (id?: number) => {
    if (!id) return;
    if (!confirm('Deseja excluir este recebimento?')) return;
    try {
      await recebimentoService.excluir(id);
      await carregarRecebimentos();
    } catch {
      setErroGeral('Erro ao excluir recebimento.');
    }
  };

  const iniciarEdicao = (r: Recebimento) => {
    setEditandoId(r.idRecebimento ?? null);
    setEditDataHoraChegada(r.dataHoraChegada ? new Date(r.dataHoraChegada).toISOString().slice(0, 16) : '');
    setEditStatusRecebimento(r.statusRecebimento);
    setEditIdNotaFiscal(String(r.idNotaFiscal));
    setEditIdFuncionario(String(r.idFuncionario));
    setEditIdMotorista(String(r.idMotorista));
    setEditIdVeiculo(String(r.idVeiculo));
    setEditErroDataHoraChegada('');
    setEditErroIdNotaFiscal('');
    setEditErroIdFuncionario('');
    setEditErroIdMotorista('');
    setEditErroIdVeiculo('');
    setErroGeral('');
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditDataHoraChegada('');
    setEditStatusRecebimento('');
    setEditIdNotaFiscal('');
    setEditIdFuncionario('');
    setEditIdMotorista('');
    setEditIdVeiculo('');
    setEditErroDataHoraChegada('');
    setEditErroIdNotaFiscal('');
    setEditErroIdFuncionario('');
    setEditErroIdMotorista('');
    setEditErroIdVeiculo('');
  };

  const salvarEdicao = async (id: number) => {
    if (!validarFormularioEdicao()) return;
    try {
      await recebimentoService.atualizar(id, {
        dataHoraChegada: new Date(editDataHoraChegada).toISOString(),
        statusRecebimento: editStatusRecebimento,
        idNotaFiscal: parseInt(editIdNotaFiscal),
        idFuncionario: parseInt(editIdFuncionario),
        idMotorista: parseInt(editIdMotorista),
        idVeiculo: parseInt(editIdVeiculo),
      });
      cancelarEdicao();
      await carregarRecebimentos();
    } catch (err) {
      setErroGeral('');
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        mapearErroBackendEdicao(err.response.data.mensagem);
      } else {
        setErroGeral('Erro ao atualizar recebimento.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Recebimento de Mercadorias</h1>
          <p className="mt-1 text-base text-muted">Acompanhe as cargas e conferências de notas fiscais</p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="flex items-center justify-center gap-2 rounded-lg bg-warning px-4 py-2.5 font-semibold text-foreground shadow-sm transition-colors hover:bg-warning-hover"
        >
          <Plus className="w-4 h-4" />
          {mostrarForm ? 'Fechar Formulário' : 'Novo Recebimento'}
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
          <h2 className="text-lg font-semibold text-foreground border-b pb-2">Cadastrar Recebimento</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Data/Hora Chegada</label>
              <input
                type="datetime-local"
                required
                value={dataHoraChegada}
                onChange={(e) => {
                  setDataHoraChegada(e.target.value);
                  setErroDataHoraChegada('');
                }}
                onBlur={() => {
                  const e = validarCampoObrigatorio(dataHoraChegada, 'Data/Hora Chegada');
                  setErroDataHoraChegada(e || '');
                }}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none ${erroDataHoraChegada ? 'border-danger' : 'border-border'}`}
              />
              {erroDataHoraChegada && <p className="text-xs text-danger mt-1">{erroDataHoraChegada}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Status</label>
              <select
                value={statusRecebimento}
                onChange={(e) => setStatusRecebimento(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none"
              >
                <option value="EM_CONFERENCIA">Em Conferência</option>
                <option value="CONCLUIDO">Concluído</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Nota Fiscal</label>
              <select
                value={idNotaFiscal}
                onChange={(e) => {
                  setIdNotaFiscal(e.target.value);
                  if (erroIdNotaFiscal) setErroIdNotaFiscal('');
                }}
                onBlur={() => setErroIdNotaFiscal(validarCampoObrigatorio(idNotaFiscal, 'Nota Fiscal') || '')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none ${erroIdNotaFiscal ? 'border-danger' : 'border-border'}`}
              >
                <option value="">Selecione uma nota fiscal...</option>
                {notasFiscais.map((n) => (
                  <option key={n.idNotaFiscal} value={n.idNotaFiscal}>
                    NF {n.numeroNf} - Série {n.serie} (#{n.idNotaFiscal})
                  </option>
                ))}
              </select>
              {erroIdNotaFiscal && <p className="text-xs text-danger mt-1">{erroIdNotaFiscal}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Funcionário</label>
              <select
                value={idFuncionario}
                onChange={(e) => {
                  setIdFuncionario(e.target.value);
                  if (erroIdFuncionario) setErroIdFuncionario('');
                }}
                onBlur={() => setErroIdFuncionario(validarCampoObrigatorio(idFuncionario, 'Funcionário') || '')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none ${erroIdFuncionario ? 'border-danger' : 'border-border'}`}
              >
                <option value="">Selecione o funcionário...</option>
                {funcionarios.map((f) => (
                  <option key={f.idFuncionario} value={f.idFuncionario}>
                    #{f.idFuncionario} - {f.nome}
                  </option>
                ))}
              </select>
              {erroIdFuncionario && <p className="text-xs text-danger mt-1">{erroIdFuncionario}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Motorista</label>
              <select
                value={idMotorista}
                onChange={(e) => {
                  setIdMotorista(e.target.value);
                  if (erroIdMotorista) setErroIdMotorista('');
                }}
                onBlur={() => setErroIdMotorista(validarCampoObrigatorio(idMotorista, 'Motorista') || '')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none ${erroIdMotorista ? 'border-danger' : 'border-border'}`}
              >
                <option value="">Selecione o motorista...</option>
                {motoristas.map((m) => (
                  <option key={m.idMotorista} value={m.idMotorista}>
                    #{m.idMotorista} - {m.nome}
                  </option>
                ))}
              </select>
              {erroIdMotorista && <p className="text-xs text-danger mt-1">{erroIdMotorista}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Veículo</label>
              <select
                value={idVeiculo}
                onChange={(e) => {
                  setIdVeiculo(e.target.value);
                  if (erroIdVeiculo) setErroIdVeiculo('');
                }}
                onBlur={() => setErroIdVeiculo(validarCampoObrigatorio(idVeiculo, 'Veículo') || '')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none ${erroIdVeiculo ? 'border-danger' : 'border-border'}`}
              >
                <option value="">Selecione o veículo...</option>
                {veiculos.map((v) => (
                  <option key={v.idVeiculo} value={v.idVeiculo}>
                    #{v.idVeiculo} - {v.placa} ({v.tipoVeiculo})
                  </option>
                ))}
              </select>
              {erroIdVeiculo && <p className="text-xs text-danger mt-1">{erroIdVeiculo}</p>}
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
          <div className="p-8 text-center text-muted">Carregando recebimentos...</div>
        ) : recebimentos.length === 0 ? (
          <div className="p-8 text-center text-muted flex flex-col items-center gap-2">
            <Truck className="w-10 h-10 text-muted" />
            Nenhum recebimento registrado no momento.
          </div>
        ) : (
          <table className="w-full min-w-225 border-collapse text-left text-base">
            <thead className="border-b border-border bg-surface text-xs font-bold uppercase tracking-wider text-foreground">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Data/Hora Chegada</th>
                <th className="p-4">Status</th>
                <th className="p-4">NF ID</th>
                <th className="p-4">Funcionário</th>
                <th className="p-4">Motorista</th>
                <th className="p-4">Veículo</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recebimentos.map((r) => (
                <tr key={r.idRecebimento} className="transition-colors hover:bg-surface-hover">
                  {editandoId === r.idRecebimento ? (
                    <>
                      <td className="p-4 font-mono text-muted">#{r.idRecebimento}</td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <input
                            type="datetime-local"
                            value={editDataHoraChegada}
                            onChange={(e) => {
                              setEditDataHoraChegada(e.target.value);
                              setEditErroDataHoraChegada('');
                            }}
                            onBlur={() => {
                              const e = validarCampoObrigatorio(editDataHoraChegada, 'Data/Hora Chegada');
                              setEditErroDataHoraChegada(e || '');
                            }}
                            className={`w-full border rounded px-2 py-1 text-xs ${editErroDataHoraChegada ? 'border-danger' : 'border-border'}`}
                          />
                          {editErroDataHoraChegada && <p className="text-xs text-danger mt-1">{editErroDataHoraChegada}</p>}
                        </div>
                      </td>
                      <td className="p-4">
                        <select
                          value={editStatusRecebimento}
                          onChange={(e) => setEditStatusRecebimento(e.target.value)}
                          className="w-full border border-border rounded px-2 py-1 text-xs"
                        >
                          <option value="EM_CONFERENCIA">Em Conferência</option>
                          <option value="CONCLUIDO">Concluído</option>
                          <option value="CANCELADO">Cancelado</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <select
                            value={editIdNotaFiscal}
                            onChange={(e) => {
                              setEditIdNotaFiscal(e.target.value);
                              if (editErroIdNotaFiscal) setEditErroIdNotaFiscal('');
                            }}
                            onBlur={() => setEditErroIdNotaFiscal(validarCampoObrigatorio(editIdNotaFiscal, 'Nota Fiscal') || '')}
                            className={`w-full border rounded px-2 py-1 text-xs ${editErroIdNotaFiscal ? 'border-danger' : 'border-border'}`}
                          >
                            <option value="">Selecione...</option>
                            {notasFiscais.map((n) => (
                              <option key={n.idNotaFiscal} value={n.idNotaFiscal}>
                                NF {n.numeroNf} - Série {n.serie} (#{n.idNotaFiscal})
                              </option>
                            ))}
                          </select>
                          {editErroIdNotaFiscal && <p className="text-xs text-danger mt-1">{editErroIdNotaFiscal}</p>}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <select
                            value={editIdFuncionario}
                            onChange={(e) => {
                              setEditIdFuncionario(e.target.value);
                              if (editErroIdFuncionario) setEditErroIdFuncionario('');
                            }}
                            onBlur={() => setEditErroIdFuncionario(validarCampoObrigatorio(editIdFuncionario, 'Funcionário') || '')}
                            className={`w-full border rounded px-2 py-1 text-xs ${editErroIdFuncionario ? 'border-danger' : 'border-border'}`}
                          >
                            <option value="">Selecione...</option>
                            {funcionarios.map((f) => (
                              <option key={f.idFuncionario} value={f.idFuncionario}>
                                #{f.idFuncionario} - {f.nome}
                              </option>
                            ))}
                          </select>
                          {editErroIdFuncionario && <p className="text-xs text-danger mt-1">{editErroIdFuncionario}</p>}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <select
                            value={editIdMotorista}
                            onChange={(e) => {
                              setEditIdMotorista(e.target.value);
                              if (editErroIdMotorista) setEditErroIdMotorista('');
                            }}
                            onBlur={() => setEditErroIdMotorista(validarCampoObrigatorio(editIdMotorista, 'Motorista') || '')}
                            className={`w-full border rounded px-2 py-1 text-xs ${editErroIdMotorista ? 'border-danger' : 'border-border'}`}
                          >
                            <option value="">Selecione...</option>
                            {motoristas.map((m) => (
                              <option key={m.idMotorista} value={m.idMotorista}>
                                #{m.idMotorista} - {m.nome}
                              </option>
                            ))}
                          </select>
                          {editErroIdMotorista && <p className="text-xs text-danger mt-1">{editErroIdMotorista}</p>}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <select
                            value={editIdVeiculo}
                            onChange={(e) => {
                              setEditIdVeiculo(e.target.value);
                              if (editErroIdVeiculo) setEditErroIdVeiculo('');
                            }}
                            onBlur={() => setEditErroIdVeiculo(validarCampoObrigatorio(editIdVeiculo, 'Veículo') || '')}
                            className={`w-full border rounded px-2 py-1 text-xs ${editErroIdVeiculo ? 'border-danger' : 'border-border'}`}
                          >
                            <option value="">Selecione...</option>
                            {veiculos.map((v) => (
                              <option key={v.idVeiculo} value={v.idVeiculo}>
                                #{v.idVeiculo} - {v.placa} ({v.tipoVeiculo})
                              </option>
                            ))}
                          </select>
                          {editErroIdVeiculo && <p className="text-xs text-danger mt-1">{editErroIdVeiculo}</p>}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => salvarEdicao(r.idRecebimento!)} className="text-muted hover:text-accent p-1 mr-1">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={cancelarEdicao} className="text-muted p-1">
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-4 font-mono text-muted">#{r.idRecebimento}</td>
                      <td className="p-4 font-medium text-foreground">{new Date(r.dataHoraChegada).toLocaleString('pt-BR')}</td>
                      <td className="p-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                          r.statusRecebimento === 'CONCLUIDO' ? 'bg-accent/20 text-accent' :
                          r.statusRecebimento === 'CANCELADO' ? 'bg-danger/20 text-danger' :
                          'bg-warning/20 text-warning'
                        }`}>
                          {r.statusRecebimento || 'EM_CONFERENCIA'}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-muted">#{r.idNotaFiscal}</td>
                      <td className="p-4 font-mono text-muted">#{r.idFuncionario}</td>
                      <td className="p-4 font-mono text-muted">#{r.idMotorista}</td>
                      <td className="p-4 font-mono text-muted">#{r.idVeiculo}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => iniciarEdicao(r)} className="text-muted hover:text-accent p-1 mr-1">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleExcluir(r.idRecebimento)} className="text-muted hover:text-danger p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
