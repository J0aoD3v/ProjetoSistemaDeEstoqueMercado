'use client';

import { useEffect, useState, useCallback } from 'react';
import { ItemRecebimento, Recebimento, Localizacao, Lote } from '@/types';
import { itemRecebimentoService } from '@/services/itemRecebimentoService';
import { recebimentoService } from '@/services/recebimentoService';
import { localizacaoService } from '@/services/localizacaoService';
import { loteService } from '@/services/loteService';
import { Plus, Trash2, Calculator, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { apenasNumerosDecimal } from '@/utils/masks';
import { validarCampoObrigatorio, validarNumeroPositivo } from '@/utils/validators';

export default function ItensRecebimentoPage() {
  const [itens, setItens] = useState<ItemRecebimento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroGeral, setErroGeral] = useState('');

  const [quantidadeDeclarada, setQuantidadeDeclarada] = useState('');
  const [quantidadeConferida, setQuantidadeConferida] = useState('');
  const [idRecebimento, setIdRecebimento] = useState('');
  const [idLote, setIdLote] = useState('');
  const [idLocalizacao, setIdLocalizacao] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  const [erroQuantidadeDeclarada, setErroQuantidadeDeclarada] = useState('');
  const [erroQuantidadeConferida, setErroQuantidadeConferida] = useState('');
  const [erroIdRecebimento, setErroIdRecebimento] = useState('');
  const [erroIdLote, setErroIdLote] = useState('');
  const [erroIdLocalizacao, setErroIdLocalizacao] = useState('');

  const [recebimentos, setRecebimentos] = useState<Recebimento[]>([]);
  const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);

  const limparErros = () => {
    setErroQuantidadeDeclarada('');
    setErroQuantidadeConferida('');
    setErroIdRecebimento('');
    setErroIdLote('');
    setErroIdLocalizacao('');
  };

  const buscarItens = useCallback(async () => {
    try {
      const data = await itemRecebimentoService.listarTodos();
      setItens(data);
      setErroGeral('');
    } catch {
      setErroGeral('Não foi possível carregar a lista de itens de recebimento.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await buscarItens();
    })();
  }, [buscarItens]);

  const carregarOpcoes = useCallback(async () => {
    try {
      const [recs, locs, lots] = await Promise.all([
        recebimentoService.listarTodos(),
        localizacaoService.listarTodos(),
        loteService.listarTodos(),
      ]);
      setRecebimentos(recs);
      setLocalizacoes(locs);
      setLotes(lots);
    } catch {
      setRecebimentos([]);
      setLocalizacoes([]);
      setLotes([]);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await carregarOpcoes();
    })();
  }, [carregarOpcoes]);

  const validarFormulario = (): boolean => {
    limparErros();
    let valido = true;

    const eQtdD = validarNumeroPositivo(quantidadeDeclarada, 'Quantidade declarada');
    if (eQtdD) {
      setErroQuantidadeDeclarada(eQtdD);
      valido = false;
    }

    const eQtdC = validarNumeroPositivo(quantidadeConferida, 'Quantidade conferida');
    if (eQtdC) {
      setErroQuantidadeConferida(eQtdC);
      valido = false;
    }

    const eRece = validarCampoObrigatorio(idRecebimento, 'Recebimento');
    if (eRece) {
      setErroIdRecebimento(eRece);
      valido = false;
    }

    const eLote = validarCampoObrigatorio(idLote, 'Lote');
    if (eLote) {
      setErroIdLote(eLote);
      valido = false;
    }

    const eLoc = validarCampoObrigatorio(idLocalizacao, 'Localização');
    if (eLoc) {
      setErroIdLocalizacao(eLoc);
      valido = false;
    }

    return valido;
  };

  const mapearErroBackend = (mensagem: string) => {
    const msg = mensagem.toLowerCase();
    limparErros();
    if (msg.includes('declarada')) {
      setErroQuantidadeDeclarada(mensagem);
    } else if (msg.includes('conferida')) {
      setErroQuantidadeConferida(mensagem);
    } else if (msg.includes('recebimento')) {
      setErroIdRecebimento(mensagem);
    } else if (msg.includes('lote')) {
      setErroIdLote(mensagem);
    } else if (msg.includes('localiza')) {
      setErroIdLocalizacao(mensagem);
    } else {
      setErroGeral(mensagem);
    }
  };

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) return;
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
      setMostrarForm(false);
      limparErros();
      setCarregando(true);
      await buscarItens();
    } catch (err) {
      limparErros();
      setErroGeral('');
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        mapearErroBackend(err.response.data.mensagem);
      } else {
        setErroGeral('Erro ao cadastrar item de recebimento.');
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
      setErroGeral('Erro ao excluir item.');
    }
  };

  const handleCalcularDivergencia = async () => {
    if (!validarFormulario()) return;
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
      setErroGeral('Erro ao calcular divergência.');
    }
  };

  const atuaNumero = (
    raw: string,
    setValor: (v: string) => void,
    setErro: (m: string) => void,
    limpoAtual: string
  ) => {
    const limpo = apenasNumerosDecimal(raw);
    if (raw !== limpo) {
      setErro('Digite apenas números.');
    } else if (limpoAtual) {
      setErro('');
    }
    setValor(limpo);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Itens de Recebimento</h1>
          <p className="mt-1 text-base text-muted">Gestão dos itens conferidos no recebimento</p>
        </div>
        <button
          onClick={() => {
            setMostrarForm(!mostrarForm);
            if (mostrarForm) limparErros();
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-info px-4 py-2.5 font-semibold text-foreground shadow-sm transition-colors hover:bg-info-hover"
        >
          <Plus className="w-4 h-4" />
          {mostrarForm ? 'Fechar Formulário' : 'Novo Item'}
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
          <h2 className="text-lg font-semibold text-foreground border-b pb-2">Cadastrar Item de Recebimento</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Qtd. Declarada</label>
              <input
                type="text"
                inputMode="decimal"
                required
                value={quantidadeDeclarada}
                onChange={(e) => atuaNumero(e.target.value, setQuantidadeDeclarada, setErroQuantidadeDeclarada, erroQuantidadeDeclarada)}
                onBlur={() => setErroQuantidadeDeclarada(validarNumeroPositivo(quantidadeDeclarada, 'Quantidade declarada') || '')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none ${erroQuantidadeDeclarada ? 'border-danger' : 'border-border'}`}
                placeholder="0"
              />
              {erroQuantidadeDeclarada && <p className="text-xs text-danger mt-1">{erroQuantidadeDeclarada}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Qtd. Conferida</label>
              <input
                type="text"
                inputMode="decimal"
                required
                value={quantidadeConferida}
                onChange={(e) => atuaNumero(e.target.value, setQuantidadeConferida, setErroQuantidadeConferida, erroQuantidadeConferida)}
                onBlur={() => setErroQuantidadeConferida(validarNumeroPositivo(quantidadeConferida, 'Quantidade conferida') || '')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none ${erroQuantidadeConferida ? 'border-danger' : 'border-border'}`}
                placeholder="0"
              />
              {erroQuantidadeConferida && <p className="text-xs text-danger mt-1">{erroQuantidadeConferida}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Recebimento</label>
              <select
                value={idRecebimento}
                onChange={(e) => {
                  setIdRecebimento(e.target.value);
                  if (erroIdRecebimento) setErroIdRecebimento('');
                }}
                onBlur={() => setErroIdRecebimento(validarCampoObrigatorio(idRecebimento, 'Recebimento') || '')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none ${erroIdRecebimento ? 'border-danger' : 'border-border'}`}
              >
                <option value="">Selecione o recebimento...</option>
                {recebimentos.map((r) => (
                  <option key={r.idRecebimento} value={r.idRecebimento}>
                    #{r.idRecebimento} - {r.statusRecebimento}
                  </option>
                ))}
              </select>
              {erroIdRecebimento && <p className="text-xs text-danger mt-1">{erroIdRecebimento}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Lote</label>
              <select
                value={idLote}
                onChange={(e) => {
                  setIdLote(e.target.value);
                  if (erroIdLote) setErroIdLote('');
                }}
                onBlur={() => setErroIdLote(validarCampoObrigatorio(idLote, 'Lote') || '')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none ${erroIdLote ? 'border-danger' : 'border-border'}`}
              >
                <option value="">Selecione o lote...</option>
                {lotes.map((l) => (
                  <option key={l.idLote} value={l.idLote}>
                    {l.numeroLote} (#{l.idLote} - Produto {l.idProduto})
                  </option>
                ))}
              </select>
              {erroIdLote && <p className="text-xs text-danger mt-1">{erroIdLote}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Localização</label>
              <select
                value={idLocalizacao}
                onChange={(e) => {
                  setIdLocalizacao(e.target.value);
                  if (erroIdLocalizacao) setErroIdLocalizacao('');
                }}
                onBlur={() => setErroIdLocalizacao(validarCampoObrigatorio(idLocalizacao, 'Localização') || '')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none ${erroIdLocalizacao ? 'border-danger' : 'border-border'}`}
              >
                <option value="">Selecione a localização...</option>
                {localizacoes.map((l) => (
                  <option key={l.idLocalizacao} value={l.idLocalizacao}>
                    {l.codigoPosicao} (#{l.idLocalizacao})
                  </option>
                ))}
              </select>
              {erroIdLocalizacao && <p className="text-xs text-danger mt-1">{erroIdLocalizacao}</p>}
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