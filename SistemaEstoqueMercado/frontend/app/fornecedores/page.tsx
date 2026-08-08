'use client';

import { useEffect, useState, useCallback } from 'react';
import { Fornecedor } from '@/types';
import { fornecedorService } from '@/services/fornecedorService';
import { Plus, Trash2, Pencil, AlertCircle, X } from 'lucide-react';
import axios from 'axios';
import { formatCNPJ } from '@/utils/masks';
import { validarCNPJ, validarCampoObrigatorio } from '@/utils/validators';

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroGeral, setErroGeral] = useState('');

  const [cnpj, setCnpj] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  const [erroCnpj, setErroCnpj] = useState('');
  const [erroRazaoSocial, setErroRazaoSocial] = useState('');

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editCnpj, setEditCnpj] = useState('');
  const [editRazaoSocial, setEditRazaoSocial] = useState('');
  const [editNomeFantasia, setEditNomeFantasia] = useState('');
  const [editErroCnpj, setEditErroCnpj] = useState('');
  const [editErroRazaoSocial, setEditErroRazaoSocial] = useState('');

  const carregarFornecedores = useCallback(async () => {
    try {
      setCarregando(true);
      const data = await fornecedorService.listarTodos();
      setFornecedores(data);
      setErroGeral('');
    } catch {
      setErroGeral('Não foi possível carregar a lista de fornecedores.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await carregarFornecedores();
    })();
  }, [carregarFornecedores]);

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    const msgCnpj = validarCNPJ(cnpj);
    const msgRazao = validarCampoObrigatorio(razaoSocial, 'Razão Social');

    setErroCnpj(msgCnpj || '');
    setErroRazaoSocial(msgRazao || '');

    if (msgCnpj || msgRazao) return;

    try {
      await fornecedorService.cadastrar({ cnpj, razaoSocial, nomeFantasia });
      setCnpj('');
      setRazaoSocial('');
      setNomeFantasia('');
      setMostrarForm(false);
      setErroCnpj('');
      setErroRazaoSocial('');
      await carregarFornecedores();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        const msg = err.response.data.mensagem;
        if (msg.toLowerCase().includes('cnpj')) setErroCnpj(msg);
        else if (msg.toLowerCase().includes('razão') || msg.toLowerCase().includes('razao')) setErroRazaoSocial(msg);
        else setErroGeral(msg);
      } else {
        setErroGeral('Erro ao cadastrar fornecedor.');
      }
    }
  };

  const handleExcluir = async (id?: number) => {
    if (!id || !confirm('Deseja excluir este fornecedor?')) return;
    try {
      await fornecedorService.excluir(id);
      await carregarFornecedores();
    } catch {
      setErroGeral('Erro ao excluir fornecedor.');
    }
  };

  const iniciarEdicao = (f: Fornecedor) => {
    setEditandoId(f.idFornecedor ?? null);
    setEditCnpj(f.cnpj);
    setEditRazaoSocial(f.razaoSocial);
    setEditNomeFantasia(f.nomeFantasia || '');
    setEditErroCnpj('');
    setEditErroRazaoSocial('');
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditCnpj('');
    setEditRazaoSocial('');
    setEditNomeFantasia('');
    setEditErroCnpj('');
    setEditErroRazaoSocial('');
  };

  const salvarEdicao = async (id: number) => {
    const msgCnpj = validarCNPJ(editCnpj);
    const msgRazao = validarCampoObrigatorio(editRazaoSocial, 'Razão Social');

    setEditErroCnpj(msgCnpj || '');
    setEditErroRazaoSocial(msgRazao || '');

    if (msgCnpj || msgRazao) return;

    try {
      await fornecedorService.atualizar(id, {
        cnpj: editCnpj,
        razaoSocial: editRazaoSocial,
        nomeFantasia: editNomeFantasia,
      });
      cancelarEdicao();
      await carregarFornecedores();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        const msg = err.response.data.mensagem;
        if (msg.toLowerCase().includes('cnpj')) setEditErroCnpj(msg);
        else if (msg.toLowerCase().includes('razão') || msg.toLowerCase().includes('razao')) setEditErroRazaoSocial(msg);
        else setErroGeral(msg);
      } else {
        setErroGeral('Erro ao atualizar fornecedor.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Fornecedores</h1>
          <p className="mt-1 text-base text-muted">Gestão dos parceiros e distribuidores do mercado</p>
        </div>
        <button
          onClick={() => { setMostrarForm(!mostrarForm); setErroCnpj(''); setErroRazaoSocial(''); }}
          className="flex items-center justify-center gap-2 rounded-lg bg-info px-4 py-2.5 font-semibold text-foreground shadow-sm transition-colors hover:bg-info-hover"
        >
          <Plus className="w-4 h-4" />
          {mostrarForm ? 'Fechar Formulário' : 'Novo Fornecedor'}
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
          <h2 className="text-lg font-semibold text-foreground border-b pb-2">Cadastrar Fornecedor</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">CNPJ</label>
              <input
                type="text"
                required
                value={formatCNPJ(cnpj)}
                onChange={(e) => {
                  setCnpj(formatCNPJ(e.target.value));
                  setErroCnpj(/[^\d./-]/.test(e.target.value) ? 'Digite apenas números.' : '');
                }}
                onBlur={() => setErroCnpj(validarCNPJ(cnpj) || '')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 outline-none ${erroCnpj ? 'border-danger focus:ring-danger' : 'border-border focus:ring-info'}`}
                placeholder="00.000.000/0001-00"
                maxLength={18}
              />
              {erroCnpj && <p className="text-xs text-danger mt-1">{erroCnpj}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Razão Social</label>
              <input
                type="text"
                required
                value={razaoSocial}
                onChange={(e) => { setRazaoSocial(e.target.value); setErroRazaoSocial(''); }}
                onBlur={() => setErroRazaoSocial(validarCampoObrigatorio(razaoSocial, 'Razão Social') || '')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 outline-none ${erroRazaoSocial ? 'border-danger focus:ring-danger' : 'border-border focus:ring-info'}`}
                placeholder="Distribuidora de Alimentos S.A."
              />
              {erroRazaoSocial && <p className="text-xs text-danger mt-1">{erroRazaoSocial}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Nome Fantasia</label>
              <input
                type="text"
                value={nomeFantasia}
                onChange={(e) => setNomeFantasia(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none"
                placeholder="Alimentos Brasil"
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
          <div className="p-8 text-center text-muted">Carregando fornecedores...</div>
        ) : fornecedores.length === 0 ? (
          <div className="p-8 text-center text-muted flex flex-col items-center gap-2">
            Nenhum fornecedor cadastrado.
          </div>
        ) : (
          <table className="w-full min-w-175 border-collapse text-left text-base">
            <thead className="border-b border-border bg-surface text-xs font-bold uppercase tracking-wider text-foreground">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">CNPJ</th>
                <th className="p-4">Razão Social</th>
                <th className="p-4">Nome Fantasia</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {fornecedores.map((f) => (
                <tr key={f.idFornecedor} className="transition-colors hover:bg-surface-hover">
                  {editandoId === f.idFornecedor ? (
                    <>
                      <td className="p-4 font-mono text-muted">#{f.idFornecedor}</td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={formatCNPJ(editCnpj)}
onChange={(e) => {
                          setEditCnpj(formatCNPJ(e.target.value));
                          setEditErroCnpj(/[^\d./-]/.test(e.target.value) ? 'Digite apenas números.' : '');
                        }}
                        onBlur={() => setEditErroCnpj(validarCNPJ(editCnpj) || '')}
                          className={`w-full border rounded px-2 py-1 text-sm ${editErroCnpj ? 'border-danger' : 'border-border'}`}
                        />
                        {editErroCnpj && <p className="text-xs text-danger mt-1">{editErroCnpj}</p>}
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={editRazaoSocial}
                          onChange={(e) => { setEditRazaoSocial(e.target.value); setEditErroRazaoSocial(''); }}
                          onBlur={() => setEditErroRazaoSocial(validarCampoObrigatorio(editRazaoSocial, 'Razão Social') || '')}
                          className={`w-full border rounded px-2 py-1 text-sm ${editErroRazaoSocial ? 'border-danger' : 'border-border'}`}
                        />
                        {editErroRazaoSocial && <p className="text-xs text-danger mt-1">{editErroRazaoSocial}</p>}
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={editNomeFantasia}
                          onChange={(e) => setEditNomeFantasia(e.target.value)}
                          className="w-full border border-border rounded px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => salvarEdicao(f.idFornecedor!)} className="text-muted hover:text-accent p-1 mr-1">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={cancelarEdicao} className="text-muted p-1">
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-4 font-mono text-muted">#{f.idFornecedor}</td>
                      <td className="p-4 font-mono text-foreground">{f.cnpj}</td>
                      <td className="p-4 text-foreground font-medium">{f.razaoSocial}</td>
                      <td className="p-4 text-muted">{f.nomeFantasia || '-'}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => iniciarEdicao(f)} className="text-muted hover:text-accent p-1 mr-1">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleExcluir(f.idFornecedor)} className="text-muted hover:text-danger p-1">
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
