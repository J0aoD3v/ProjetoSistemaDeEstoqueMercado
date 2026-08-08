'use client';

import { useEffect, useState } from 'react';
import { Divergencia } from '@/types';
import { divergenciaService } from '@/services/divergenciaService';
import { AlertTriangle, AlertCircle } from 'lucide-react';

export default function DivergenciasPage() {
  const [divergencias, setDivergencias] = useState<Divergencia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let isMounted = true;

    const carregarDivergencias = async () => {
      try {
        const data = await divergenciaService.listarTodos();
        if (isMounted) {
          setDivergencias(data);
          setErro('');
        }
      } catch {
        if (isMounted) {
          setErro('Não foi possível carregar o relatório de divergências.');
        }
      } finally {
        if (isMounted) {
          setCarregando(false);
        }
      }
    };

    carregarDivergencias();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Relatório de Divergências</h1>
        <p className="mt-1 text-base text-slate-600 dark:text-slate-300">Diferenças encontradas entre a Nota Fiscal e a conferência física</p>
      </div>

      {erro && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 font-medium text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
          <AlertCircle className="w-5 h-5" />
          {erro}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        {carregando ? (
          <div className="p-8 text-center text-slate-500">Carregando divergências...</div>
        ) : divergencias.length === 0 ? (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
            <AlertTriangle className="w-10 h-10 text-slate-400" />
            Nenhuma divergência registrada no momento.
          </div>
        ) : (
          <table className="w-full min-w-[680px] border-collapse text-left text-base">
            <thead className="border-b border-slate-200 bg-slate-100 text-xs font-bold uppercase tracking-wider text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Qtd. Divergente</th>
                <th className="p-4">Observação</th>
                <th className="p-4">Item ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm dark:divide-slate-700">
              {divergencias.map((d) => (
                <tr key={d.idDivergencia} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/70">
                  <td className="p-4 font-mono text-slate-500">#{d.idDivergencia}</td>
                  <td className="p-4 font-semibold text-amber-800 dark:text-amber-300">{d.tipoDivergencia}</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{d.quantidadeDivergente}</td>
                  <td className="p-4 text-slate-600">{d.observacao || '-'}</td>
                  <td className="p-4 font-mono text-slate-500">#{d.idItemRecebimento}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
