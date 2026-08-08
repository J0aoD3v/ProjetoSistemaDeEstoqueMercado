'use client';

import { useEffect, useState, useCallback } from 'react';
import { Fornecedor } from '@/types';
import { fornecedorService } from '@/services/fornecedorService';
import { Plus, Trash2, Edit, AlertCircle, X, Check } from 'lucide-react';
import axios from 'axios';

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [cnpj, setCnpj] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [editCnpj, setEditCnpj] = useState('');
  const [editRazaoSocial, setEditRazaoSocial] = useState('');
  const [editNomeFantasia, setEditNomeFantasia] = useState('');

  const carregarFornecedores = useCallback(async () => {
    try {
      const data = await fornecedorService.listarTodos();
      setFornecedores(data);
      setErro('');
    } catch {
      setErro('Não foi possível carregar a lista de fornecedores.');
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
    try {
      await fornecedorService.cadastrar({ cnpj, razaoSocial, nomeFantasia });
      setCnpj('');
      setRazaoSocial('');
      setNomeFantasia('');
      setMostrarForm(false);
      await carregarFornecedores();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        alert(err.response.data.mensagem);
      } else {
        alert('Erro ao cadastrar fornecedor.');
      }
    }
  };

  const handleExcluir = async (id?: number) => {
    if (!id || !confirm('Deseja excluir este fornecedor?')) return;
    try {
      await fornecedorService.excluir(id);
      await carregarFornecedores();
    } catch {
      alert('Erro ao excluir fornecedor.');
    }
  };

  const iniciarEdicao = (f: Fornecedor) => {
    setEditandoId(f.idFornecedor ?? null);
    setEditCnpj(f.cnpj);
    setEditRazaoSocial(f.razaoSocial);
    setEditNomeFantasia(f.nomeFantasia);
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditCnpj('');
    setEditRazaoSocial('');
    setEditNomeFantasia('');
  };

  const salvarEdicao = async (id: number) => {
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
        alert(err.response.data.mensagem);
      } else {
        alert('Erro ao atualizar fornecedor.');
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
          onClick={() => setMostrarForm(!mostrarForm)}
          className="flex items-center justify-center gap-2 rounded-lg bg-info px-4 py-2.5 font-semibold text-foreground shadow-sm transition-colors hover:bg-info-hover"
        >
          <Plus className="w-4 h-4" />
          {mostrarForm ? 'Fechar Formulário' : 'Novo Fornecedor'}
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
          <h2 className="text-lg font-semibold text-foreground border-b pb-2">Cadastrar Fornecedor</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">CNPJ</label>
              <input
                type="text"
                required
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none"
                placeholder="00.000.000/0001-00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Razão Social</label>
              <input
                type="text"
                required
                value={razaoSocial}
                onChange={(e) => setRazaoSocial(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-info outline-none"
                placeholder="Distribuidora de Alimentos S.A."
              />
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
                          value={editCnpj}
                          onChange={(e) => setEditCnpj(e.target.value)}
                          className="w-full border border-border rounded px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={editRazaoSocial}
                          onChange={(e) => setEditRazaoSocial(e.target.value)}
                          className="w-full border border-border rounded px-2 py-1 text-sm"
                        />
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
                          <Check className="w-4 h-4" />
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
                          <Edit className="w-4 h-4" />
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









