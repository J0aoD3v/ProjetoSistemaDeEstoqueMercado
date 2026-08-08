'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

  return (
    <aside className="w-64 shrink-0 bg-background text-foreground min-h-screen p-4 flex flex-col border-r border-border">
      <div className="text-xl font-bold mb-8 px-4 text-accent border-b border-border pb-4">
        Estoque Mercado
      </div>
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
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
        })}
      </nav>
    </aside>
  );
}
