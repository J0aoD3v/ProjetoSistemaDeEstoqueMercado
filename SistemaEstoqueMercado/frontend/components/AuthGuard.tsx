'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export const CHAVE_AUTENTICACAO = 'sistemaEstoque.autenticado';

export function definirAutenticacao(autenticado: boolean) {
  if (typeof window === 'undefined') {
    return;
  }
  if (autenticado) {
    localStorage.setItem(CHAVE_AUTENTICACAO, 'true');
  } else {
    localStorage.removeItem(CHAVE_AUTENTICACAO);
  }
  window.dispatchEvent(new Event('storage'));
}

function getSnapshot() {
  return (
    typeof window !== 'undefined' &&
    localStorage.getItem(CHAVE_AUTENTICACAO) === 'true'
  );
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const autenticado = useSyncExternalStore(subscribe, getSnapshot, () => false);

  const deveProteger = pathname !== '/login' && !autenticado;

  useEffect(() => {
    if (deveProteger) {
      router.replace('/login');
    }
  }, [deveProteger, router]);

  return <>{deveProteger ? null : children}</>;
}