'use client';

import { 
  Package, 
  Truck, 
  AlertTriangle, 
  Users, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const stats = [
    { name: 'Produtos Ativos', value: '124', icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Recebimentos Hoje', value: '12', icon: Truck, color: 'text-warning', bg: 'bg-warning/10' },
    { name: 'Divergências Abertas', value: '3', icon: AlertTriangle, color: 'text-danger', bg: 'bg-danger/10' },
    { name: 'Fornecedores Ativos', value: '45', icon: Users, color: 'text-accent', bg: 'bg-accent/10' },
  ];

  const recentActivities = [
    { id: 1, type: 'recebimento', title: 'Carga de Fornecedor ABC', time: 'Há 2 horas', status: 'Concluído', statusColor: 'text-accent' },
    { id: 2, type: 'divergencia', title: 'Divergência no Item SKU-123', time: 'Há 5 horas', status: 'Em Análise', statusColor: 'text-warning' },
    { id: 3, type: 'recebimento', title: 'Carga de Fornecedor XYZ', time: 'Há 1 dia', status: 'Agendado', statusColor: 'text-blue-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-1 text-base text-muted">Bem-vindo ao Sistema de Gestão de Estoque e Recebimento.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="relative overflow-hidden rounded-xl border border-border bg-background p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`rounded-lg ${stat.bg} p-3`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted">{stat.name}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium text-muted">
              <TrendingUp className="mr-1 h-3 w-3 text-accent" />
              <span className="text-accent">+12%</span>
              <span className="ml-1">em relação ao mês anterior</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-xl border border-border bg-background shadow-sm">
          <div className="flex items-center justify-between border-b border-border p-6">
            <h2 className="text-lg font-semibold text-foreground">Atividade Recente</h2>
            <BarChart3 className="h-5 w-5 text-muted" />
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-border">
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="py-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`rounded-full p-2 ${activity.type === 'recebimento' ? 'bg-blue-500/10' : 'bg-danger/10'}`}>
                          {activity.type === 'recebimento' ? (
                            <Truck className="h-4 w-4 text-blue-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-danger" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{activity.title}</p>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-muted" />
                            <p className="text-xs text-muted">{activity.time}</p>
                          </div>
                        </div>
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-wider ${activity.statusColor}`}>
                        {activity.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <Link
                href="/recebimentos"
                className="flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-surface transition-colors"
              >
                Ver todas as atividades
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-border bg-background shadow-sm">
          <div className="border-b border-border p-6">
            <h2 className="text-lg font-semibold text-foreground">Ações Rápidas</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 p-6">
            <Link
              href="/recebimentos"
              className="flex flex-col items-center gap-3 rounded-xl border border-border p-6 text-center transition-all hover:border-warning hover:bg-warning/5 group"
            >
              <div className="rounded-full bg-warning/10 p-3 group-hover:bg-warning/20">
                <Truck className="h-6 w-6 text-warning" />
              </div>
              <span className="text-sm font-medium">Novo Recebimento</span>
            </Link>
            <Link
              href="/produtos"
              className="flex flex-col items-center gap-3 rounded-xl border border-border p-6 text-center transition-all hover:border-blue-500 hover:bg-blue-500/5 group"
            >
              <div className="rounded-full bg-blue-500/10 p-3 group-hover:bg-blue-500/20">
                <Package className="h-6 w-6 text-blue-500" />
              </div>
              <span className="text-sm font-medium">Cadastrar Produto</span>
            </Link>
            <Link
              href="/divergencias"
              className="flex flex-col items-center gap-3 rounded-xl border border-border p-6 text-center transition-all hover:border-danger hover:bg-danger/5 group"
            >
              <div className="rounded-full bg-danger/10 p-3 group-hover:bg-danger/20">
                <AlertTriangle className="h-6 w-6 text-danger" />
              </div>
              <span className="text-sm font-medium">Ver Divergências</span>
            </Link>
            <Link
              href="/fornecedores"
              className="flex flex-col items-center gap-3 rounded-xl border border-border p-6 text-center transition-all hover:border-accent hover:bg-accent/5 group"
            >
              <div className="rounded-full bg-accent/10 p-3 group-hover:bg-accent/20">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <span className="text-sm font-medium">Gerir Fornecedores</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
