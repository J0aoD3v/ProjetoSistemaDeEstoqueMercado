'use client';

import { useEffect, useState, useCallback } from 'react';
import { Divergencia, ItemRecebimento } from '@/types';
import { divergenciaService } from '@/services/divergenciaService';
import { itemRecebimentoService } from '@/services/itemRecebimentoService';
import { Plus, Trash2, Edit, AlertTriangle, AlertCircle, X, Check } from 'lucide-react';
import axios from 'axios';
import { apenasNumerosDecimal } from '@/utils/masks';
import { validarCampoObrigatorio, validarNumeroPositivo } from '@/utils/validators';

export default function DivergenciasPage() {
  const [divergencias, setDivergencias] = useState<Divergencia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroGeral, setErroGeral] = useState('');

  const [tipoDivergencia, setTipoDivergencia] = useState('');
  const [quantidadeDivergente, setQuantidadeDivergente] = useState('');
  const [observacao, setObservacao] = useState('');
  const [idItemRecebimento, setIdItemRecebimento] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  const [erroTipoDivergencia, setErroTipoDivergencia] = useState('');
  const [erroQuantidadeDivergente, setErroQuantidadeDivergente] = useState('');
  const [erroIdItemRecebimento, setErroIdItemRecebimento] = useState('');

  const [itemsRecebimento, setItemsRecebimento] = useState<ItemRecebimento[]>([]);

  const [editTipoDivergencia, setEditTipoDivergencia] = useState('');
  const [editQuantidadeDivergente, setEditQuantidadeDivergente] = useState('');
  const [editObservacao, setEditObservacao] = useState('');
  const [editIdItemRecebimento, setEditIdItemRecebimento] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [editErroTipoDivergencia, setEditErroTipoDivergencia] = useState('');
  const [editErroQuantidadeDivergente, setEditErroQuantidadeDivergente] = useState('');
  const [editErroIdItemRecebimento, setEditErroIdItemRecebimento] = useState('');

  const limparErros = () => {
    setErroTipoDivergencia('');
    setErroQuantidadeDivergente('');
    setErroIdItemRecebimento('');
  };

  const carregarDivergencias = useCallback(async () => {
    try {
      const data = await divergenciaService.listarTodos();
      setDivergencias(data);
      setErroGeral('');
    } catch {
      setErroGeral('Não foi possível carregar o relatório de divergências.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await carregarDivergencias();
    })();
  }, [carregarDivergencias]);

  useEffect(() => {
    itemRecebimentoService.listarTodos().then(setItemsRecebimento).catch(() => setItemsRecebimento([]));
  }, []);

  const validarFormulario = (): boolean => {
    limparErros();
    let valido = true;

    const eTipo = validarCampoObrigatorio(tipoDivergencia, 'Tipo de divergência');
    if (eTipo) { setErroTipoDivergencia(eTipo); valido = false; }

    const eQtd = validarNumeroPositivo(quantidadeDivergente, 'Quantidade divergente');
    if (eQtd) { setErroQuantidadeDivergente(eQtd); valido = false; }

    const eItem = validarCampoObrigatorio(idItemRecebimento, 'Item de recebimento');
    if (eItem) { setErroIdItemRecebimento(eItem); valido = false; }

    return valido;
  };

  const validarFormularioEdicao = (): boolean => {
    setEditErroTipoDivergencia('');
    setEditErroQuantidadeDivergente('');
    setEditErroIdItemRecebimento('');
    let valido = true;

    const eTipo = validarCampoObrigatorio(editTipoDivergencia, 'Tipo de divergência');
    if (eTipo) { setEditErroTipoDivergencia(eTipo); valido = false; }

    const eQtd = validarNumeroPositivo(editQuantidadeDivergente, 'Quantidade divergente');
    if (eQtd) { setEditErroQuantidadeDivergente(eQtd); valido = false; }

    const eItem = validarCampoObrigatorio(editIdItemRecebimento, 'Item de recebimento');
    if (eItem) { setEditErroIdItemRecebimento(eItem); valido = false; }

    return valido;
  };

  const mapearErroBackend = (mensagem: string) => {
    const msg = mensagem.toLowerCase();
    limparErros();
    if (msg.includes('tipo')) {
      setErroTipoDivergencia(mensagem);
    } else if (msg.includes('quantidade')) {
      setErroQuantidadeDivergente(mensagem);
    } else if (msg.includes('item')) {
      setErroIdItemRecebimento(mensagem);
    } else {
      setErroGeral(mensagem);
    }
  };

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    try {
      await divergenciaService.cadastrar({
        tipoDivergencia,
        quantidadeDivergente: parseFloat(quantidadeDivergente),
        observacao,
        idItemRecebimento: parseInt(idItemRecebimento),
      });
      setTipoDivergencia('');
      setQuantidadeDivergente('');
      setObservacao('');
      setIdItemRecebimento('');
      setMostrarForm(false);
      limparErros();
      await carregarDivergencias();
    } catch (err) {
      limparErros();
      setErroGeral('');
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        mapearErroBackend(err.response.data.mensagem);
      } else {
        setErroGeral('Erro ao cadastrar divergência.');
      }
    }
  };

  const handleExcluir = async (id?: number) => {
    if (!id || !confirm('Deseja excluir esta divergência?')) return;
    try {
      await divergenciaService.excluir(id);
      await carregarDivergencias();
    } catch {
      setErroGeral('Erro ao excluir divergência.');
    }
  };

  const iniciarEdicao = (d: Divergencia) => {
    setEditandoId(d.idDivergencia ?? null);
    setEditTipoDivergencia(d.tipoDivergencia);
    setEditQuantidadeDivergente(String(d.quantidadeDivergente));
    setEditObservacao(d.observacao || '');
    setEditIdItemRecebimento(String(d.idItemRecebimento));
    setEditErroTipoDivergencia('');
    setEditErroQuantidadeDivergente('');
    setEditErroIdItemRecebimento('');
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditTipoDivergencia('');
    setEditQuantidadeDivergente('');
    setEditObservacao('');
    setEditIdItemRecebimento('');
    setEditErroTipoDivergencia('');
    setEditErroQuantidadeDivergente('');
    setEditErroIdItemRecebimento('');
  };

  const salvarEdicao = async (id: number) => {
    if (!validarFormularioEdicao()) return;
    try {
      await divergenciaService.atualizar(id, {
        tipoDivergencia: editTipoDivergencia,
        quantidadeDivergente: parseFloat(editQuantidadeDivergente),
        observacao: editObservacao,
        idItemRecebimento: parseInt(editIdItemRecebimento),
      });
      cancelarEdicao();
      await carregarDivergencias();
    } catch (err) {
      setErroGeral('');
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        const msg = err.response.data.mensagem.toLowerCase();
        if (msg.includes('tipo')) {
          setEditErroTipoDivergencia(err.response.data.mensagem);
        } else if (msg.includes('quantidade')) {
          setEditErroQuantidadeDivergente(err.response.data.mensagem);
        } else if (msg.includes('item')) {
          setEditErroIdItemRecebimento(err.response.data.mensagem);
        } else {
          setErroGeral(err.response.data.mensagem);
        }
      } else {
        setErroGeral('Erro ao atualizar divergência.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Relatório de Divergências</h1>
          <p className="mt-1 text-base text-muted">Diferenças encontradas entre a Nota Fiscal e a conferência física</p>
        </div>
        <button
          onClick={() => {
            setMostrarForm(!mostrarForm);
            if (mostrarForm) limparErros();
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-warning px-4 py-2.5 font-semibold text-foreground shadow-sm transition-colors hover:bg-warning-hover"
        >
          <Plus className="w-4 h-4" />
          {mostrarForm ? 'Fechar Formulário' : 'Nova Divergência'}
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
          <h2 className="text-lg font-semibold text-foreground border-b pb-2">Cadastrar Divergência</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Tipo de Divergência</label>
              <select
                value={tipoDivergencia}
                onChange={(e) => {
                  setTipoDivergencia(e.target.value);
                  if (erroTipoDivergencia) setErroTipoDivergencia('');
                }}
                onBlur={() => setErroTipoDivergencia(validarCampoObrigatorio(tipoDivergencia, 'Tipo de divergência') || '')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none ${erroTipoDivergencia ? 'border-danger' : 'border-border'}`}
              >
                <option value="">Selecione...</option>
                <option value="FALTA">Falta</option>
                <option value="SOBRA">Sobra</option>
                <option value="AVARIA">Avarias</option>
              </select>
              {erroTipoDivergencia && <p className="text-xs text-danger mt-1">{erroTipoDivergencia}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Quantidade Divergente</label>
              <input
                type="text"
                inputMode="decimal"
                required
                value={quantidadeDivergente}
                onChange={(e) => {
                  const limpo = apenasNumerosDecimal(e.target.value);
                  if (e.target.value !== limpo) {
                    setErroQuantidadeDivergente('Digite apenas números.');
                  } else if (erroQuantidadeDivergente) {
                    setErroQuantidadeDivergente('');
                  }
                  setQuantidadeDivergente(limpo);
                }}
                onBlur={() => setErroQuantidadeDivergente(validarNumeroPositivo(quantidadeDivergente, 'Quantidade divergente') || '')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none ${erroQuantidadeDivergente ? 'border-danger' : 'border-border'}`}
                placeholder="0"
              />
              {erroQuantidadeDivergente && <p className="text-xs text-danger mt-1">{erroQuantidadeDivergente}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Item de Recebimento</label>
              <select
                value={idItemRecebimento}
                onChange={(e) => {
                  setIdItemRecebimento(e.target.value);
                  if (erroIdItemRecebimento) setErroIdItemRecebimento('');
                }}
                onBlur={() => setErroIdItemRecebimento(validarCampoObrigatorio(idItemRecebimento, 'Item de recebimento') || '')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none ${erroIdItemRecebimento ? 'border-danger' : 'border-border'}`}
              >
                <option value="">Selecione o item...</option>
                {itemsRecebimento.map((i) => (
                  <option key={i.idItemRecebimento} value={i.idItemRecebimento}>
                    #{i.idItemRecebimento} - Recebimento #{i.idRecebimento}
                  </option>
                ))}
              </select>
              {erroIdItemRecebimento && <p className="text-xs text-danger mt-1">{erroIdItemRecebimento}</p>}
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-muted mb-1">Observação</label>
              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                rows={2}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning outline-none"
                placeholder="Detalhes da divergência..."
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
          <div className="p-8 text-center text-muted">Carregando divergências...</div>
        ) : divergencias.length === 0 ? (
          <div className="p-8 text-center text-muted flex flex-col items-center gap-2">
            <AlertTriangle className="w-10 h-10 text-muted" />
            Nenhuma divergência registrada no momento.
          </div>
        ) : (
          <table className="w-full min-w-175 border-collapse text-left text-base">
            <thead className="border-b border-border bg-surface text-xs font-bold uppercase tracking-wider text-foreground">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Qtd. Divergente</th>
                <th className="p-4">Observação</th>
                <th className="p-4">Item ID</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {divergencias.map((d) => (
                <tr key={d.idDivergencia} className="transition-colors hover:bg-surface-hover">
                  {editandoId === d.idDivergencia ? (
                    <>
                      <td className="p-4 font-mono text-muted">#{d.idDivergencia}</td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={editTipoDivergencia}
                          onChange={(e) => {
                            setEditTipoDivergencia(e.target.value);
                            if (editErroTipoDivergencia) setEditErroTipoDivergencia('');
                          }}
                          onBlur={() => setEditErroTipoDivergencia(validarCampoObrigatorio(editTipoDivergencia, 'Tipo de divergência') || '')}
                          className={`w-full border border-border rounded px-2 py-1 text-xs ${editErroTipoDivergencia ? 'border-red-500' : 'border-border'}`}
                        />
                        {editErroTipoDivergencia && <p className="text-xs text-danger mt-1">{editErroTipoDivergencia}</p>}
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={editQuantidadeDivergente}
                          onChange={(e) => {
                            const limpo = apenasNumerosDecimal(e.target.value);
                            if (e.target.value !== limpo) {
                              setEditErroQuantidadeDivergente('Digite apenas números.');
                            } else if (editErroQuantidadeDivergente) {
                              setEditErroQuantidadeDivergente('');
                            }
                            setEditQuantidadeDivergente(limpo);
                          }}
                          onBlur={() => setEditErroQuantidadeDivergente(validarNumeroPositivo(editQuantidadeDivergente, 'Quantidade divergente') || '')}
                          className={`w-full border border-border rounded px-2 py-1 text-xs ${editErroQuantidadeDivergente ? 'border-red-500' : 'border-border'}`}
                        />
                        {editErroQuantidadeDivergente && <p className="text-xs text-danger mt-1">{editErroQuantidadeDivergente}</p>}
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={editObservacao}
                          onChange={(e) => setEditObservacao(e.target.value)}
                          className="w-full border border-border rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-4">
                        <select
                          value={editIdItemRecebimento}
                          onChange={(e) => {
                            setEditIdItemRecebimento(e.target.value);
                            if (editErroIdItemRecebimento) setEditErroIdItemRecebimento('');
                          }}
                          onBlur={() => setEditErroIdItemRecebimento(validarCampoObrigatorio(editIdItemRecebimento, 'Item de recebimento') || '')}
                          className={`w-full border border-border rounded px-2 py-1 text-xs ${editErroIdItemRecebimento ? 'border-red-500' : 'border-border'}`}
                        >
                          <option value="">Selecione...</option>
                          {itemsRecebimento.map((i) => (
                            <option key={i.idItemRecebimento} value={i.idItemRecebimento}>
                              #{i.idItemRecebimento} - Recebimento #{i.idRecebimento}
                            </option>
                          ))}
                        </select>
                        {editErroIdItemRecebimento && <p className="text-xs text-danger mt-1">{editErroIdItemRecebimento}</p>}
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => salvarEdicao(d.idDivergencia!)} className="text-muted hover:text-accent p-1 mr-1">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={cancelarEdicao} className="text-muted p-1">
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-4 font-mono text-muted">#{d.idDivergencia}</td>
                      <td className="p-4 font-semibold text-warning">{d.tipoDivergencia}</td>
                      <td className="p-4 font-bold text-foreground">{d.quantidadeDivergente}</td>
                      <td className="p-4 text-muted">{d.observacao || '-'}</td>
                      <td className="p-4 font-mono text-muted">#{d.idItemRecebimento}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => iniciarEdicao(d)} className="text-muted hover:text-accent p-1 mr-1">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleExcluir(d.idDivergencia)} className="text-muted hover:text-danger p-1">
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