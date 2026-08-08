'use client';

import { useEffect, useState, useCallback } from 'react';
import { Motorista } from '@/types';
import { motoristaService } from '@/services/motoristaService';
import { Plus, Trash2, User, AlertCircle, X, Pencil } from 'lucide-react';
import axios from 'axios';
import { formatCPF } from '@/utils/masks';
import { validarCPF, validarCampoObrigatorio } from '@/utils/validators';

export default function MotoristasPage() {
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroGeral, setErroGeral] = useState('');

  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [cnh, setCnh] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  const [erroCpf, setErroCpf] = useState('');
  const [erroNome, setErroNome] = useState('');
  const [erroCnh, setErroCnh] = useState('');

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editCpf, setEditCpf] = useState('');
  const [editNome, setEditNome] = useState('');
  const [editCnh, setEditCnh] = useState('');
  const [editErroCpf, setEditErroCpf] = useState('');
  const [editErroNome, setEditErroNome] = useState('');
  const [editErroCnh, setEditErroCnh] = useState('');

  const carregarMotoristas = useCallback(async () => {
    try {
      setCarregando(true);
      const data = await motoristaService.listarTodos();
      setMotoristas(data);
      setErroGeral('');
    } catch {
      setErroGeral('Não foi possível carregar a lista de motoristas.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await carregarMotoristas();
    })();
  }, [carregarMotoristas]);

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    const msgCpf = validarCPF(cpf);
    const msgNome = validarCampoObrigatorio(nome, 'Nome');
    const msgCnh = validarCampoObrigatorio(cnh, 'CNH');

    setErroCpf(msgCpf || '');
    setErroNome(msgNome || '');
    setErroCnh(msgCnh || '');

    if (msgCpf || msgNome || msgCnh) return;

    try {
      await motoristaService.cadastrar({ cpf, nome, cnh });
      setCpf('');
      setNome('');
      setCnh('');
      setMostrarForm(false);
      setErroCpf('');
      setErroNome('');
      setErroCnh('');
      await carregarMotoristas();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        const msg = err.response.data.mensagem;
        if (msg.toLowerCase().includes('cpf')) setErroCpf(msg);
        else if (msg.toLowerCase().includes('nome')) setErroNome(msg);
        else if (msg.toLowerCase().includes('cnh')) setErroCnh(msg);
        else setErroGeral(msg);
      } else {
        setErroGeral('Erro ao cadastrar motorista.');
      }
    }
  };

  const handleExcluir = async (id?: number) => {
    if (!id || !confirm('Deseja excluir este motorista?')) return;
    try {
      await motoristaService.excluir(id);
      await carregarMotoristas();
    } catch {
      setErroGeral('Erro ao excluir motorista.');
    }
  };

  const iniciarEdicao = (m: Motorista) => {
    setEditandoId(m.idMotorista ?? null);
    setEditCpf(m.cpf);
    setEditNome(m.nome);
    setEditCnh(m.cnh);
    setEditErroCpf('');
    setEditErroNome('');
    setEditErroCnh('');
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditCpf('');
    setEditNome('');
    setEditCnh('');
    setEditErroCpf('');
    setEditErroNome('');
    setEditErroCnh('');
  };

  const salvarEdicao = async (id: number) => {
    const msgCpf = validarCPF(editCpf);
    const msgNome = validarCampoObrigatorio(editNome, 'Nome');
    const msgCnh = validarCampoObrigatorio(editCnh, 'CNH');

    setEditErroCpf(msgCpf || '');
    setEditErroNome(msgNome || '');
    setEditErroCnh(msgCnh || '');

    if (msgCpf || msgNome || msgCnh) return;

    try {
      await motoristaService.atualizar(id, { cpf: editCpf, nome: editNome, cnh: editCnh });
      cancelarEdicao();
      await carregarMotoristas();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        const msg = err.response.data.mensagem;
        if (msg.toLowerCase().includes('cpf')) setEditErroCpf(msg);
        else if (msg.toLowerCase().includes('nome')) setEditErroNome(msg);
        else if (msg.toLowerCase().includes('cnh')) setEditErroCnh(msg);
        else setErroGeral(msg);
      } else {
        setErroGeral('Erro ao atualizar motorista.');
      }
    }
  };

  const handleBlurCpf = (valor: string, setErro: (msg: string) => void) => {
    const msg = validarCPF(valor);
    setErro(msg || '');
  };

  const handleBlurNome = (valor: string, setErro: (msg: string) => void) => {
    const msg = validarCampoObrigatorio(valor, 'Nome');
    setErro(msg || '');
  };

  const handleBlurCnh = (valor: string, setErro: (msg: string) => void) => {
    const msg = validarCampoObrigatorio(valor, 'CNH');
    setErro(msg || '');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Motoristas</h1>
          <p className="mt-1 text-base text-muted">Gestão dos motoristas cadastrados</p>
        </div>
        <button
          onClick={() => { setMostrarForm(!mostrarForm); setErroCpf(''); setErroNome(''); setErroCnh(''); }}
          className="flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-semibold text-foreground shadow-sm transition-colors hover:bg-accent-hover"
        >
          <Plus className="w-4 h-4" />
          {mostrarForm ? 'Fechar Formulário' : 'Novo Motorista'}
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
          <h2 className="text-lg font-semibold text-foreground border-b pb-2">Cadastrar Motorista</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">CPF</label>
              <input
                type="text"
                required
                value={formatCPF(cpf)}
                onChange={(e) => {
                  setCpf(formatCPF(e.target.value));
                  setErroCpf(/[^\d.-]/.test(e.target.value) ? 'Digite apenas números.' : '');
                }}
                onBlur={() => handleBlurCpf(cpf, setErroCpf)}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 outline-none ${erroCpf ? 'border-danger focus:ring-danger' : 'border-border focus:ring-accent'}`}
                placeholder="000.000.000-00"
                maxLength={14}
              />
              {erroCpf && <p className="text-xs text-danger mt-1">{erroCpf}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Nome</label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => { setNome(e.target.value); setErroNome(''); }}
                onBlur={() => handleBlurNome(nome, setErroNome)}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 outline-none ${erroNome ? 'border-danger focus:ring-danger' : 'border-border focus:ring-accent'}`}
                placeholder="João da Silva"
              />
              {erroNome && <p className="text-xs text-danger mt-1">{erroNome}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">CNH</label>
              <input
                type="text"
                required
                value={cnh}
                onChange={(e) => { setCnh(e.target.value); setErroCnh(''); }}
                onBlur={() => handleBlurCnh(cnh, setErroCnh)}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 outline-none ${erroCnh ? 'border-danger focus:ring-danger' : 'border-border focus:ring-accent'}`}
                placeholder="12345678901"
              />
              {erroCnh && <p className="text-xs text-danger mt-1">{erroCnh}</p>}
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
          <div className="p-8 text-center text-muted">Carregando motoristas...</div>
        ) : motoristas.length === 0 ? (
          <div className="p-8 text-center text-muted flex flex-col items-center gap-2">
            <User className="w-10 h-10 text-muted" />
            Nenhum motorista cadastrado.
          </div>
        ) : (
          <table className="w-full min-w-150 border-collapse text-left text-base">
            <thead className="border-b border-border bg-surface text-xs font-bold uppercase tracking-wider text-foreground">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">CPF</th>
                <th className="p-4">Nome</th>
                <th className="p-4">CNH</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {motoristas.map((m) => (
                <tr key={m.idMotorista} className="transition-colors hover:bg-surface-hover">
                  {editandoId === m.idMotorista ? (
                    <>
                      <td className="p-4 font-mono text-muted">#{m.idMotorista}</td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={formatCPF(editCpf)}
onChange={(e) => {
                          setEditCpf(formatCPF(e.target.value));
                          setEditErroCpf(/[^\d.-]/.test(e.target.value) ? 'Digite apenas números.' : '');
                        }}
                        onBlur={() => handleBlurCpf(editCpf, setEditErroCpf)}
                          className={`w-full border rounded px-2 py-1 text-xs ${editErroCpf ? 'border-danger' : 'border-border'}`}
                        />
                        {editErroCpf && <p className="text-xs text-danger mt-1">{editErroCpf}</p>}
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={editNome}
                          onChange={(e) => { setEditNome(e.target.value); setEditErroNome(''); }}
                          onBlur={() => handleBlurNome(editNome, setEditErroNome)}
                          className={`w-full border rounded px-2 py-1 text-xs ${editErroNome ? 'border-danger' : 'border-border'}`}
                        />
                        {editErroNome && <p className="text-xs text-danger mt-1">{editErroNome}</p>}
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={editCnh}
                          onChange={(e) => { setEditCnh(e.target.value); setEditErroCnh(''); }}
                          onBlur={() => handleBlurCnh(editCnh, setEditErroCnh)}
                          className={`w-full border rounded px-2 py-1 text-xs ${editErroCnh ? 'border-danger' : 'border-border'}`}
                        />
                        {editErroCnh && <p className="text-xs text-danger mt-1">{editErroCnh}</p>}
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => salvarEdicao(m.idMotorista!)} className="text-muted hover:text-accent p-1 mr-1">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={cancelarEdicao} className="text-muted p-1">
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-4 font-mono text-muted">#{m.idMotorista}</td>
                      <td className="p-4 font-mono text-foreground">{m.cpf}</td>
                      <td className="p-4 text-foreground font-medium">{m.nome}</td>
                      <td className="p-4 font-mono text-muted">{m.cnh}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => iniciarEdicao(m)} className="text-muted hover:text-accent p-1 mr-1">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleExcluir(m.idMotorista)} className="text-muted hover:text-danger p-1">
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
