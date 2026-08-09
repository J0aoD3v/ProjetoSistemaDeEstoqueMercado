'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { Loader2, Lock } from 'lucide-react';
import { definirAutenticacao } from '@/components/AuthGuard';
import api, { CHAVE_TOKEN } from '@/services/api';

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [entrando, setEntrando] = useState(false);

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!usuario.trim() || !senha.trim()) {
      setErro('Informe usuário e senha.');
      return;
    }

    setEntrando(true);
    try {
      const resposta = await api.post<{ token: string }>('/auth/login', {
        usuario: usuario.trim(),
        senha,
      });
      localStorage.setItem(CHAVE_TOKEN, resposta.data.token);
      definirAutenticacao(true);
      router.replace('/');
    } catch (erro) {
      const axiosErro = erro as AxiosError<{ mensagem?: string }>;
      setErro(
        axiosErro.response?.data?.mensagem ??
          'Não foi possível entrar. Verifique a conexão e tente novamente.',
      );
      setEntrando(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <Lock className="h-6 w-6 text-accent" />
          </div>
          <h1 className="text-xl font-bold">Estoque Mercado</h1>
          <p className="mt-1 text-sm text-muted">Acesso restrito aos administradores</p>
        </div>

        <form className="space-y-4" onSubmit={entrar}>
          <div>
            <label htmlFor="usuario" className="mb-1 block text-sm font-medium">
              Usuário
            </label>
            <input
              id="usuario"
              name="usuario"
              type="text"
              autoComplete="username"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              placeholder="admin"
            />
          </div>

          <div>
            <label htmlFor="senha" className="mb-1 block text-sm font-medium">
              Senha
            </label>
            <input
              id="senha"
              name="senha"
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              placeholder="••••••"
            />
          </div>

          {erro && <p className="text-sm text-danger">{erro}</p>}

          <button
            type="submit"
            disabled={entrando}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {entrando ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted">
          <Link href="/" className="hover:text-foreground">
            Voltar ao início
          </Link>
        </p>
      </div>
    </div>
  );
}