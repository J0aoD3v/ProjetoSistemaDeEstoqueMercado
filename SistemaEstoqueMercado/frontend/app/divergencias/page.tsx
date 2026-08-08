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
        <h1 className="text-2xl font-bold text-slate-800">Relatório de Divergências</h1>
        <p className="text-sm text-slate-500">Diferenças encontradas entre a Nota Fiscal e a conferência física</p>
      </div>

      {erro && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          {erro}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {carregando ? (
          <div className="p-8 text-center text-slate-500">Carregando divergências...</div>
        ) : divergencias.length === 0 ? (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
            <AlertTriangle className="w-10 h-10 text-slate-400" />
            Nenhuma divergência registrada no momento.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b text-xs font-semibold text-slate-500 uppercase">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Qtd. Divergente</th>
                <th className="p-4">Observação</th>
                <th className="p-4">Item ID</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {divergencias.map((d) => (
                <tr key={d.idDivergencia} className="hover:bg-slate-50">
                  <td className="p-4 font-mono text-slate-500">#{d.idDivergencia}</td>
                  <td className="p-4 font-medium text-amber-700">{d.tipoDivergencia}</td>
                  <td className="p-4 font-bold text-slate-800">{d.quantidadeDivergente}</td>
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