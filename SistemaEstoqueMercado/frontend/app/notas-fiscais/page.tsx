'use client';

import { useEffect, useState } from 'react';
import { NotaFiscal } from '@/types';
import { notaFiscalService } from '@/services/notaFiscalService';
import { Plus, Trash2, FileText, AlertCircle, X } from 'lucide-react';
import axios from 'axios';
import { formatNFeKey } from '@/utils/masks';
import { validarNFeKey, validarCampoObrigatorio, validarNumeroPositivo } from '@/utils/validators';

export default function NotasFiscaisPage() {
  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroGeral, setErroGeral] = useState('');

  const [numeroNf, setNumeroNf] = useState('');
  const [serie, setSerie] = useState('');
  const [dataEmissao, setDataEmissao] = useState('');
  const [chaveAcessoNfe, setChaveAcessoNfe] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [idFornecedor, setIdFornecedor] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  const [erroNumeroNf, setErroNumeroNf] = useState('');
  const [erroSerie, setErroSerie] = useState('');
  const [erroChaveAcessoNfe, setErroChaveAcessoNfe] = useState('');
  const [erroValorTotal, setErroValorTotal] = useState('');
  const [erroIdFornecedor, setErroIdFornecedor] = useState('');

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editNumeroNf, setEditNumeroNf] = useState('');
  const [editSerie, setEditSerie] = useState('');
  const [editDataEmissao, setEditDataEmissao] = useState('');
  const [editChaveAcessoNfe, setEditChaveAcessoNfe] = useState('');
  const [editValorTotal, setEditValorTotal] = useState('');
  const [editIdFornecedor, setEditIdFornecedor] = useState('');
  const [mostrarEditForm, setMostrarEditForm] = useState(false);

  const [editErroNumeroNf, setEditErroNumeroNf] = useState('');
  const [editErroSerie, setEditErroSerie] = useState('');
  const [editErroChaveAcessoNfe, setEditErroChaveAcessoNfe] = useState('');
  const [editErroValorTotal, setEditErroValorTotal] = useState('');
  const [editErroIdFornecedor, setEditErroIdFornecedor] = useState('');

  const limparErros = () => {
    setErroNumeroNf('');
    setErroSerie('');
    setErroChaveAcessoNfe('');
    setErroValorTotal('');
    setErroIdFornecedor('');
  };

  const validarCampos = () => {
    let temErro = false;
    limparErros();

    const errNumero = validarCampoObrigatorio(numeroNf, 'Número NF');
    if (errNumero) { setErroNumeroNf(errNumero); temErro = true; }

    const errSerie = validarCampoObrigatorio(serie, 'Série');
    if (errSerie) { setErroSerie(errSerie); temErro = true; }

    const errChave = validarNFeKey(chaveAcessoNfe);
    if (errChave) { setErroChaveAcessoNfe(errChave); temErro = true; }

    const errValor = validarNumeroPositivo(valorTotal, 'Valor Total');
    if (errValor) { setErroValorTotal(errValor); temErro = true; }

    const errFornecedor = validarNumeroPositivo(idFornecedor, 'ID Fornecedor');
    if (errFornecedor) { setErroIdFornecedor(errFornecedor); temErro = true; }

    return !temErro;
  };

  const validarCamposEdicao = () => {
    let temErro = false;
    setEditErroNumeroNf('');
    setEditErroSerie('');
    setEditErroChaveAcessoNfe('');
    setEditErroValorTotal('');
    setEditErroIdFornecedor('');

    const errNumero = validarCampoObrigatorio(editNumeroNf, 'Número NF');
    if (errNumero) { setEditErroNumeroNf(errNumero); temErro = true; }

    const errSerie = validarCampoObrigatorio(editSerie, 'Série');
    if (errSerie) { setEditErroSerie(errSerie); temErro = true; }

    const errChave = validarNFeKey(editChaveAcessoNfe);
    if (errChave) { setEditErroChaveAcessoNfe(errChave); temErro = true; }

    const errValor = validarNumeroPositivo(editValorTotal, 'Valor Total');
    if (errValor) { setEditErroValorTotal(errValor); temErro = true; }

    const errFornecedor = validarNumeroPositivo(editIdFornecedor, 'ID Fornecedor');
    if (errFornecedor) { setEditErroIdFornecedor(errFornecedor); temErro = true; }

    return !temErro;
  };

  const buscarNotas = async () => {
    try {
      const data = await notaFiscalService.listarTodos();
      setNotas(data);
      setErroGeral('');
    } catch {
      setErroGeral('Não foi possível carregar a lista de notas fiscais.');
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
          setErroGeral('');
        }
      } catch {
        if (isMounted) {
          setErroGeral('Não foi possível carregar a lista de notas fiscais.');
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
    if (!validarCampos()) return;
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
      limparErros();
      setCarregando(true);
      await buscarNotas();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        const mensagem = err.response.data.mensagem.toLowerCase();
        if (mensagem.includes('chave') || mensagem.includes('nfe') || mensagem.includes('44')) {
          setErroChaveAcessoNfe(err.response.data.mensagem);
        } else if (mensagem.includes('valor') || mensagem.includes('total')) {
          setErroValorTotal(err.response.data.mensagem);
        } else if (mensagem.includes('fornecedor')) {
          setErroIdFornecedor(err.response.data.mensagem);
        } else if (mensagem.includes('número') || mensagem.includes('numero')) {
          setErroNumeroNf(err.response.data.mensagem);
        } else if (mensagem.includes('série') || mensagem.includes('serie')) {
          setErroSerie(err.response.data.mensagem);
        } else {
          setErroGeral(err.response.data.mensagem);
        }
      } else {
        setErroGeral('Erro ao cadastrar nota fiscal.');
      }
    }
  };

  const handleEditar = (nota: NotaFiscal) => {
    setEditandoId(nota.idNotaFiscal ?? null);
    setEditNumeroNf(nota.numeroNf);
    setEditSerie(nota.serie);
    setEditDataEmissao(nota.dataEmissao);
    setEditChaveAcessoNfe(nota.chaveAcessoNfe);
    setEditValorTotal(String(nota.valorTotal));
    setEditIdFornecedor(String(nota.idFornecedor));
    setMostrarEditForm(true);
    setEditErroNumeroNf('');
    setEditErroSerie('');
    setEditErroChaveAcessoNfe('');
    setEditErroValorTotal('');
    setEditErroIdFornecedor('');
    setErroGeral('');
  };

  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarCamposEdicao()) return;
    if (!editandoId) return;
    try {
      await notaFiscalService.atualizar(editandoId, {
        numeroNf: editNumeroNf,
        serie: editSerie,
        dataEmissao: editDataEmissao,
        chaveAcessoNfe: editChaveAcessoNfe,
        valorTotal: parseFloat(editValorTotal),
        idFornecedor: parseInt(editIdFornecedor),
      });
      setEditandoId(null);
      setMostrarEditForm(false);
      setCarregando(true);
      await buscarNotas();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        const mensagem = err.response.data.mensagem.toLowerCase();
        if (mensagem.includes('chave') || mensagem.includes('nfe') || mensagem.includes('44')) {
          setEditErroChaveAcessoNfe(err.response.data.mensagem);
        } else if (mensagem.includes('valor') || mensagem.includes('total')) {
          setEditErroValorTotal(err.response.data.mensagem);
        } else if (mensagem.includes('fornecedor')) {
          setEditErroIdFornecedor(err.response.data.mensagem);
        } else if (mensagem.includes('número') || mensagem.includes('numero')) {
          setEditErroNumeroNf(err.response.data.mensagem);
        } else if (mensagem.includes('série') || mensagem.includes('serie')) {
          setEditErroSerie(err.response.data.mensagem);
        } else {
          setErroGeral(err.response.data.mensagem);
        }
      } else {
        setErroGeral('Erro ao atualizar nota fiscal.');
      }
    }
  };

  const handleCancelarEdicao = () => {
    setEditandoId(null);
    setMostrarEditForm(false);
    setEditErroNumeroNf('');
    setEditErroSerie('');
    setEditErroChaveAcessoNfe('');
    setEditErroValorTotal('');
    setEditErroIdFornecedor('');
    setErroGeral('');
  };

  const handleExcluir = async (id?: number) => {
    if (!id || !confirm('Deseja excluir esta nota fiscal?')) return;
    try {
      await notaFiscalService.excluir(id);
      setCarregando(true);
      await buscarNotas();
    } catch {
      setErroGeral('Erro ao excluir nota fiscal.');
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

      {erroGeral && (
        <div className="flex items-center gap-3 rounded-lg border border-danger/50 bg-danger/10 p-4 font-medium text-danger">
          <AlertCircle className="w-5 h-5" />
          {erroGeral}
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
                onChange={(e) => { setNumeroNf(e.target.value); setErroNumeroNf(''); }}
                onBlur={() => {
                  const err = validarCampoObrigatorio(numeroNf, 'Número NF');
                  if (err) setErroNumeroNf(err);
                }}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none ${erroNumeroNf ? 'border-danger' : 'border-border'}`}
                placeholder="12345"
              />
              {erroNumeroNf && <p className="text-xs text-danger mt-1">{erroNumeroNf}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Série</label>
              <input
                type="text"
                required
                value={serie}
                onChange={(e) => { setSerie(e.target.value); setErroSerie(''); }}
                onBlur={() => {
                  const err = validarCampoObrigatorio(serie, 'Série');
                  if (err) setErroSerie(err);
                }}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none ${erroSerie ? 'border-danger' : 'border-border'}`}
                placeholder="1"
              />
              {erroSerie && <p className="text-xs text-danger mt-1">{erroSerie}</p>}
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
                onChange={(e) => { setChaveAcessoNfe(formatNFeKey(e.target.value)); setErroChaveAcessoNfe(''); }}
                onBlur={() => {
                  const err = validarNFeKey(chaveAcessoNfe);
                  if (err) setErroChaveAcessoNfe(err);
                }}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none ${erroChaveAcessoNfe ? 'border-danger' : 'border-border'}`}
                placeholder="chave de 44 dígitos"
                maxLength={44}
              />
              {erroChaveAcessoNfe && <p className="text-xs text-danger mt-1">{erroChaveAcessoNfe}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Valor Total (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                value={valorTotal}
                onChange={(e) => { setValorTotal(e.target.value); setErroValorTotal(''); }}
                onBlur={() => {
                  const err = validarNumeroPositivo(valorTotal, 'Valor Total');
                  if (err) setErroValorTotal(err);
                }}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none ${erroValorTotal ? 'border-danger' : 'border-border'}`}
                placeholder="0.00"
              />
              {erroValorTotal && <p className="text-xs text-danger mt-1">{erroValorTotal}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">ID Fornecedor</label>
              <input
                type="number"
                required
                value={idFornecedor}
                onChange={(e) => { setIdFornecedor(e.target.value); setErroIdFornecedor(''); }}
                onBlur={() => {
                  const err = validarNumeroPositivo(idFornecedor, 'ID Fornecedor');
                  if (err) setErroIdFornecedor(err);
                }}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none ${erroIdFornecedor ? 'border-danger' : 'border-border'}`}
                placeholder="1"
              />
              {erroIdFornecedor && <p className="text-xs text-danger mt-1">{erroIdFornecedor}</p>}
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" className="bg-info hover:bg-info-hover text-foreground px-6 py-2 rounded-lg font-medium text-sm">
              Salvar
            </button>
          </div>
        </form>
      )}

      {mostrarEditForm && editandoId && (
        <form onSubmit={handleSalvarEdicao} className="space-y-4 rounded-xl border border-border bg-background p-6 shadow-sm">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-lg font-semibold text-foreground">Editar Nota Fiscal</h2>
            <button type="button" onClick={handleCancelarEdicao} className="text-muted hover:text-danger">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Número NF</label>
              <input
                type="text"
                required
                value={editNumeroNf}
                onChange={(e) => { setEditNumeroNf(e.target.value); setEditErroNumeroNf(''); }}
                onBlur={() => {
                  const err = validarCampoObrigatorio(editNumeroNf, 'Número NF');
                  if (err) setEditErroNumeroNf(err);
                }}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none ${editErroNumeroNf ? 'border-danger' : 'border-border'}`}
                placeholder="12345"
              />
              {editErroNumeroNf && <p className="text-xs text-danger mt-1">{editErroNumeroNf}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Série</label>
              <input
                type="text"
                required
                value={editSerie}
                onChange={(e) => { setEditSerie(e.target.value); setEditErroSerie(''); }}
                onBlur={() => {
                  const err = validarCampoObrigatorio(editSerie, 'Série');
                  if (err) setEditErroSerie(err);
                }}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none ${editErroSerie ? 'border-danger' : 'border-border'}`}
                placeholder="1"
              />
              {editErroSerie && <p className="text-xs text-danger mt-1">{editErroSerie}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Data Emissão</label>
              <input
                type="date"
                required
                value={editDataEmissao}
                onChange={(e) => setEditDataEmissao(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted mb-1">Chave de Acesso NFE</label>
              <input
                type="text"
                required
                value={formatNFeKey(editChaveAcessoNfe)}
                onChange={(e) => { setEditChaveAcessoNfe(formatNFeKey(e.target.value)); setEditErroChaveAcessoNfe(''); }}
                onBlur={() => {
                  const err = validarNFeKey(editChaveAcessoNfe);
                  if (err) setEditErroChaveAcessoNfe(err);
                }}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none ${editErroChaveAcessoNfe ? 'border-danger' : 'border-border'}`}
                placeholder="chave de 44 dígitos"
                maxLength={44}
              />
              {editErroChaveAcessoNfe && <p className="text-xs text-danger mt-1">{editErroChaveAcessoNfe}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Valor Total (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                value={editValorTotal}
                onChange={(e) => { setEditValorTotal(e.target.value); setEditErroValorTotal(''); }}
                onBlur={() => {
                  const err = validarNumeroPositivo(editValorTotal, 'Valor Total');
                  if (err) setEditErroValorTotal(err);
                }}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none ${editErroValorTotal ? 'border-danger' : 'border-border'}`}
                placeholder="0.00"
              />
              {editErroValorTotal && <p className="text-xs text-danger mt-1">{editErroValorTotal}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">ID Fornecedor</label>
              <input
                type="number"
                required
                value={editIdFornecedor}
                onChange={(e) => { setEditIdFornecedor(e.target.value); setEditErroIdFornecedor(''); }}
                onBlur={() => {
                  const err = validarNumeroPositivo(editIdFornecedor, 'ID Fornecedor');
                  if (err) setEditErroIdFornecedor(err);
                }}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none ${editErroIdFornecedor ? 'border-danger' : 'border-border'}`}
                placeholder="1"
              />
              {editErroIdFornecedor && <p className="text-xs text-danger mt-1">{editErroIdFornecedor}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={handleCancelarEdicao} className="border border-border hover:bg-surface text-foreground px-6 py-2 rounded-lg font-medium text-sm">
              Cancelar
            </button>
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
                    <button onClick={() => handleEditar(n)} className="text-muted hover:text-info p-1 mr-1" title="Editar">
                      <Plus className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleExcluir(n.idNotaFiscal)} className="text-muted hover:text-danger p-1" title="Excluir">
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

