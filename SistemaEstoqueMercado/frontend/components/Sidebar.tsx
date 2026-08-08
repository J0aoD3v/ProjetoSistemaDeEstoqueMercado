'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, Truck, FileText, AlertTriangle, Users, Home } from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Produtos', href: '/produtos', icon: Package },
  { name: 'Fornecedores', href: '/fornecedores', icon: Users },
  { name: 'Recebimentos', href: '/recebimentos', icon: Truck },
  { name: 'Divergências', href: '/divergencias', icon: AlertTriangle },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-slate-950 text-white min-h-screen p-4 flex flex-col border-r border-slate-800">
      <div className="text-xl font-bold mb-8 px-4 text-emerald-400 border-b border-slate-800 pb-4">
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
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-200 hover:bg-slate-800 hover:text-white'
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
