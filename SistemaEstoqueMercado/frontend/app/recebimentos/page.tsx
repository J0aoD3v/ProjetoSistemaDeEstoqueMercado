'use client';

import { useEffect, useState } from 'react';
import { Recebimento } from '@/types';
import { recebimentoService } from '@/services/recebimentoService';
import { Truck, AlertCircle } from 'lucide-react';

export default function RecebimentosPage() {
  const [recebimentos, setRecebimentos] = useState<Recebimento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let isMounted = true;

    const carregarRecebimentos = async () => {
      try {
        const data = await recebimentoService.listarTodos();
        if (isMounted) {
          setRecebimentos(data);
          setErro('');
        }
      } catch {
        if (isMounted) {
          setErro('Não foi possível carregar a lista de recebimentos.');
        }
      } finally {
        if (isMounted) {
          setCarregando(false);
        }
      }
    };

    carregarRecebimentos();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Recebimento de Mercadorias</h1>
        <p className="mt-1 text-base text-slate-600 dark:text-slate-300">Acompanhe as cargas e conferências de notas fiscais</p>
      </div>

      {erro && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 font-medium text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
          <AlertCircle className="w-5 h-5" />
          {erro}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        {carregando ? (
          <div className="p-8 text-center text-slate-500">Carregando recebimentos...</div>
        ) : recebimentos.length === 0 ? (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
            <Truck className="w-10 h-10 text-slate-400" />
            Nenhum recebimento registrado no momento.
          </div>
        ) : (
          <table className="w-full min-w-170 border-collapse text-left text-base">
            <thead className="border-b border-slate-200 bg-slate-100 text-xs font-bold uppercase tracking-wider text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Data/Hora Chegada</th>
                <th className="p-4">Status</th>
                <th className="p-4">NF ID</th>
                <th className="p-4">Funcionário ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm dark:divide-slate-700">
              {recebimentos.map((r) => (
                <tr key={r.idRecebimento} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/70">
                  <td className="p-4 font-mono text-slate-500">#{r.idRecebimento}</td>
                  <td className="p-4 font-medium text-slate-900 dark:text-white">{new Date(r.dataHoraChegada).toLocaleString('pt-BR')}</td>
                  <td className="p-4">
                    <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900 dark:bg-amber-950/60 dark:text-amber-200">
                      {r.statusRecebimento || 'EM_CONFERENCIA'}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-600">#{r.idNotaFiscal}</td>
                  <td className="p-4 font-mono text-slate-600">#{r.idFuncionario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
