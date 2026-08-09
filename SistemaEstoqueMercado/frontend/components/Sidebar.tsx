'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Package,
  Truck,
  AlertTriangle,
  Users,
  Home,
  User,
  PackageOpen,
  FileText,
  Car,
  MapPin,
  ClipboardList,
  Menu,
  X,
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Produtos', href: '/produtos', icon: Package },
  { name: 'Fornecedores', href: '/fornecedores', icon: Users },
  { name: 'Funcionários', href: '/funcionarios', icon: User },
  { name: 'Lotes', href: '/lotes', icon: PackageOpen },
  { name: 'Notas Fiscais', href: '/notas-fiscais', icon: FileText },
  { name: 'Recebimentos', href: '/recebimentos', icon: Truck },
  { name: 'Itens Receb.', href: '/itens-recebimento', icon: ClipboardList },
  { name: 'Motoristas', href: '/motoristas', icon: User },
  { name: 'Veículos', href: '/veiculos', icon: Car },
  { name: 'Localizações', href: '/localizacoes', icon: MapPin },
  { name: 'Divergências', href: '/divergencias', icon: AlertTriangle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);
  const [ultimoPathname, setUltimoPathname] = useState(pathname);

  if (ultimoPathname !== pathname) {
    setUltimoPathname(pathname);
    setAberto(false);
  }

  useEffect(() => {
    if (!aberto) return;
    const fecharTecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAberto(false);
    };
    document.addEventListener('keydown', fecharTecla);
    document.body.classList.add('overflow-hidden');
    return () => {
      document.removeEventListener('keydown', fecharTecla);
      document.body.classList.remove('overflow-hidden');
    };
  }, [aberto]);

  const renderNav = (onSelecionar?: () => void) =>
    menuItems.map((item) => {
      const Icon = item.icon;
      const isActive = pathname === item.href;
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={onSelecionar}
          aria-current={isActive ? 'page' : undefined}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            isActive
              ? 'bg-accent text-foreground'
              : 'text-muted hover:bg-surface-hover hover:text-foreground'
          }`}
        >
          <Icon className="w-5 h-5" />
          {item.name}
        </Link>
      );
    });

  return (
    <>
      {/* Cabeçalho mobile com hambúrguer */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background px-4 py-3 lg:hidden">
        <Link href="/" className="text-lg font-bold text-accent">
          Estoque Mercado
        </Link>
        <button
          onClick={() => setAberto(true)}
          aria-label="Abrir menu de navegação"
          aria-expanded={aberto}
          className="inline-flex items-center justify-center rounded-lg border border-border p-2 text-foreground"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Drawer mobile */}
      {aberto && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu de navegação">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setAberto(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col border-r border-border bg-background shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <span className="text-lg font-bold text-accent">Estoque Mercado</span>
              <button
                onClick={() => setAberto(false)}
                aria-label="Fechar menu"
                className="inline-flex items-center justify-center rounded-lg border border-border p-2 text-foreground"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
              {renderNav(() => setAberto(false))}
            </nav>
          </div>
        </div>
      )}

      {/* Sidebar desktop */}
      <aside className="hidden w-64 shrink-0 min-h-screen bg-background text-foreground p-4 border-r border-border lg:flex lg:flex-col">
        <div className="text-xl font-bold mb-8 px-4 text-accent border-b border-border pb-4">
          Estoque Mercado
        </div>
        <nav className="flex-1 space-y-1">{renderNav()}</nav>
      </aside>
    </>
  );
}