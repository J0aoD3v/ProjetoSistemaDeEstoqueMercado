'use client';

import { useEffect, useState } from 'react';
import { Motorista } from '@/types';
import { motoristaService } from '@/services/motoristaService';
import { Plus, Trash2, User, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function MotoristasPage() {
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [cnh, setCnh] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  const buscarMotoristas = async () => {
    try {
      const data = await motoristaService.listarTodos();
      setMotoristas(data);
      setErro('');
    } catch {
      setErro('Não foi possível carregar a lista de motoristas.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const carregarInicial = async () => {
      try {
        const data = await motoristaService.listarTodos();
        if (isMounted) {
          setMotoristas(data);
          setErro('');
        }
      } catch {
        if (isMounted) {
          setErro('Não foi possível carregar a lista de motoristas.');
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
      await motoristaService.cadastrar({ cpf, nome, cnh });
      setCpf('');
      setNome('');
      setCnh('');
      setMostrarForm(false);
      setCarregando(true);
      await buscarMotoristas();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        alert(err.response.data.mensagem);
      } else {
        alert('Erro ao cadastrar motorista.');
      }
    }
  };

  const handleExcluir = async (id?: number) => {
    if (!id || !confirm('Deseja excluir este motorista?')) return;
    try {
      await motoristaService.excluir(id);
      setCarregando(true);
      await buscarMotoristas();
    } catch {
      alert('Erro ao excluir motorista.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Motoristas</h1>
          <p className="mt-1 text-base text-muted">Gestão dos motoristas cadastrados</p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-semibold text-foreground shadow-sm transition-colors hover:bg-accent-hover"
        >
          <Plus className="w-4 h-4" />
          {mostrarForm ? 'Fechar Formulário' : 'Novo Motorista'}
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
          <h2 className="text-lg font-semibold text-foreground border-b pb-2">Cadastrar Motorista</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">CPF</label>
              <input
                type="text"
                required
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none"
                placeholder="000.000.000-00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Nome</label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none"
                placeholder="João da Silva"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">CNH</label>
              <input
                type="text"
                required
                value={cnh}
                onChange={(e) => setCnh(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none"
                placeholder="12345678901"
              />
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
                  <td className="p-4 font-mono text-muted">#{m.idMotorista}</td>
                  <td className="p-4 font-mono text-foreground">{m.cpf}</td>
                  <td className="p-4 text-foreground font-medium">{m.nome}</td>
                  <td className="p-4 font-mono text-muted">{m.cnh}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleExcluir(m.idMotorista)} className="text-muted hover:text-danger p-1">
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









