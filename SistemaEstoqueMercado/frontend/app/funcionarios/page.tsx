'use client';

import { useEffect, useState, useCallback } from 'react';
import { Funcionario } from '@/types';
import { funcionarioService } from '@/services/funcionarioService';
import { Plus, Trash2, Edit, AlertCircle, X, Check } from 'lucide-react';
import axios from 'axios';
import { formatMatricula } from '@/utils/masks';
import { validarMatricula, validarCampoObrigatorio } from '@/utils/validators';

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroGeral, setErroGeral] = useState('');

  const [matricula, setMatricula] = useState('');
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  const [erroMatricula, setErroMatricula] = useState('');
  const [erroNome, setErroNome] = useState('');
  const [erroCargo, setErroCargo] = useState('');

  const [editMatricula, setEditMatricula] = useState('');
  const [editNome, setEditNome] = useState('');
  const [editCargo, setEditCargo] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [editErroMatricula, setEditErroMatricula] = useState('');
  const [editErroNome, setEditErroNome] = useState('');
  const [editErroCargo, setEditErroCargo] = useState('');

  const carregarFuncionarios = useCallback(async () => {
    try {
      const data = await funcionarioService.listarTodos();
      setFuncionarios(data);
      setErroGeral('');
    } catch {
      setErroGeral('Não foi possível carregar a lista de funcionários.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await carregarFuncionarios();
    })();
  }, [carregarFuncionarios]);

  const mapearErroBackend = (mensagem: string) => {
    const msg = mensagem.toLowerCase();
    if (msg.includes('matrícula') || msg.includes('matricula')) {
      setErroMatricula(mensagem);
      setErroNome('');
      setErroCargo('');
    } else if (msg.includes('nome')) {
      setErroNome(mensagem);
      setErroMatricula('');
      setErroCargo('');
    } else if (msg.includes('cargo')) {
      setErroCargo(mensagem);
      setErroMatricula('');
      setErroNome('');
    } else {
      setErroGeral(mensagem);
    }
  };

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();

    const errMatricula = validarMatricula(matricula);
    const errNome = validarCampoObrigatorio(nome, 'Nome');
    const errCargo = validarCampoObrigatorio(cargo, 'Cargo');

    setErroMatricula(errMatricula ?? '');
    setErroNome(errNome ?? '');
    setErroCargo(errCargo ?? '');

    if (errMatricula || errNome || errCargo) return;

    try {
      await funcionarioService.cadastrar({ matricula, nome, cargo });
      setMatricula('');
      setNome('');
      setCargo('');
      setMostrarForm(false);
      setErroMatricula('');
      setErroNome('');
      setErroCargo('');
      await carregarFuncionarios();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        mapearErroBackend(err.response.data.mensagem);
      } else {
        setErroGeral('Erro ao cadastrar funcionário.');
      }
    }
  };

  const handleExcluir = async (id?: number) => {
    if (!id || !confirm('Deseja excluir este funcionário?')) return;
    try {
      await funcionarioService.excluir(id);
      await carregarFuncionarios();
    } catch {
      setErroGeral('Erro ao excluir funcionário.');
    }
  };

  const iniciarEdicao = (func: Funcionario) => {
    setEditandoId(func.idFuncionario ?? null);
    setEditMatricula(func.matricula);
    setEditNome(func.nome);
    setEditCargo(func.cargo);
    setEditErroMatricula('');
    setEditErroNome('');
    setEditErroCargo('');
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditMatricula('');
    setEditNome('');
    setEditCargo('');
    setEditErroMatricula('');
    setEditErroNome('');
    setEditErroCargo('');
  };

  const salvarEdicao = async (id: number) => {
    const errMatricula = validarMatricula(editMatricula);
    const errNome = validarCampoObrigatorio(editNome, 'Nome');
    const errCargo = validarCampoObrigatorio(editCargo, 'Cargo');

    setEditErroMatricula(errMatricula ?? '');
    setEditErroNome(errNome ?? '');
    setEditErroCargo(errCargo ?? '');

    if (errMatricula || errNome || errCargo) return;

    try {
      await funcionarioService.atualizar(id, {
        matricula: editMatricula,
        nome: editNome,
        cargo: editCargo,
      });
      cancelarEdicao();
      await carregarFuncionarios();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        setErroGeral(err.response.data.mensagem);
      } else {
        setErroGeral('Erro ao atualizar funcionário.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Funcionários</h1>
          <p className="mt-1 text-base text-muted">Gestão dos colaboradores do mercado</p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="flex items-center justify-center gap-2 rounded-lg bg-info px-4 py-2.5 font-semibold text-foreground shadow-sm transition-colors hover:bg-info-hover"
        >
          <Plus className="w-4 h-4" />
          {mostrarForm ? 'Fechar Formulário' : 'Novo Funcionário'}
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
          <h2 className="text-lg font-semibold text-foreground border-b pb-2">Cadastrar Funcionário</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Matrícula</label>
              <input
                type="text"
                required
                value={formatMatricula(matricula)}
                onChange={(e) => {
                  setMatricula(formatMatricula(e.target.value));
                  setErroMatricula(/[^A-Za-z0-9-]/.test(e.target.value) ? 'Digite apenas letras e números.' : '');
                }}
                onBlur={() => setErroMatricula(validarMatricula(matricula) ?? '')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none ${erroMatricula ? 'border-danger' : 'border-border'}`}
                placeholder="FUNC-001"
                maxLength={8}
              />
              {erroMatricula && <p className="text-xs text-danger mt-1">{erroMatricula}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Nome</label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  setErroNome('');
                }}
                onBlur={() => setErroNome(validarCampoObrigatorio(nome, 'Nome') ?? '')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none ${erroNome ? 'border-danger' : 'border-border'}`}
                placeholder="João Silva"
              />
              {erroNome && <p className="text-xs text-danger mt-1">{erroNome}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Cargo</label>
              <input
                type="text"
                required
                value={cargo}
                onChange={(e) => {
                  setCargo(e.target.value);
                  setErroCargo('');
                }}
                onBlur={() => setErroCargo(validarCampoObrigatorio(cargo, 'Cargo') ?? '')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none ${erroCargo ? 'border-danger' : 'border-border'}`}
                placeholder="Operador de Caixa"
              />
              {erroCargo && <p className="text-xs text-danger mt-1">{erroCargo}</p>}
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
          <div className="p-8 text-center text-muted">Carregando funcionários...</div>
        ) : funcionarios.length === 0 ? (
          <div className="p-8 text-center text-muted flex flex-col items-center gap-2">
            Nenhum funcionário cadastrado.
          </div>
        ) : (
          <table className="w-full min-w-[700px] border-collapse text-left text-base">
            <thead className="border-b border-border bg-surface text-xs font-bold uppercase tracking-wider text-foreground">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Matrícula</th>
                <th className="p-4">Nome</th>
                <th className="p-4">Cargo</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {funcionarios.map((f) => (
                <tr key={f.idFuncionario} className="transition-colors hover:bg-surface-hover">
                  {editandoId === f.idFuncionario ? (
                    <>
                      <td className="p-4 font-mono text-muted">#{f.idFuncionario}</td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={editMatricula}
                          onChange={(e) => {
                            setEditMatricula(e.target.value);
                            setEditErroMatricula(/[^A-Za-z0-9-]/.test(e.target.value) ? 'Digite apenas letras e números.' : '');
                          }}
                          onBlur={() => setEditErroMatricula(validarMatricula(editMatricula) ?? '')}
                          className={`w-full border rounded px-2 py-1 text-sm ${editErroMatricula ? 'border-danger' : 'border-border'}`}
                        />
                        {editErroMatricula && <p className="text-xs text-danger mt-1">{editErroMatricula}</p>}
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={editNome}
                          onChange={(e) => {
                            setEditNome(e.target.value);
                            setEditErroNome('');
                          }}
                          onBlur={() => setEditErroNome(validarCampoObrigatorio(editNome, 'Nome') ?? '')}
                          className={`w-full border rounded px-2 py-1 text-sm ${editErroNome ? 'border-danger' : 'border-border'}`}
                        />
                        {editErroNome && <p className="text-xs text-danger mt-1">{editErroNome}</p>}
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={editCargo}
                          onChange={(e) => {
                            setEditCargo(e.target.value);
                            setEditErroCargo('');
                          }}
                          onBlur={() => setEditErroCargo(validarCampoObrigatorio(editCargo, 'Cargo') ?? '')}
                          className={`w-full border rounded px-2 py-1 text-sm ${editErroCargo ? 'border-danger' : 'border-border'}`}
                        />
                        {editErroCargo && <p className="text-xs text-danger mt-1">{editErroCargo}</p>}
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => salvarEdicao(f.idFuncionario!)} className="text-muted hover:text-accent p-1 mr-1">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={cancelarEdicao} className="text-muted p-1">
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-4 font-mono text-muted">#{f.idFuncionario}</td>
                      <td className="p-4 font-mono text-foreground">{f.matricula}</td>
                      <td className="p-4 text-foreground font-medium">{f.nome}</td>
                      <td className="p-4 text-muted">{f.cargo}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => iniciarEdicao(f)} className="text-muted hover:text-accent p-1 mr-1">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleExcluir(f.idFuncionario)} className="text-muted hover:text-danger p-1">
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
