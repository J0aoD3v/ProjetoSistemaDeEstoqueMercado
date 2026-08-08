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
        <h1 className="text-2xl font-bold text-slate-800">Recebimento de Mercadorias</h1>
        <p className="text-sm text-slate-500">Acompanhe as cargas e conferências de notas fiscais</p>
      </div>

      {erro && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          {erro}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {carregando ? (
          <div className="p-8 text-center text-slate-500">Carregando recebimentos...</div>
        ) : recebimentos.length === 0 ? (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
            <Truck className="w-10 h-10 text-slate-400" />
            Nenhum recebimento registrado no momento.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b text-xs font-semibold text-slate-500 uppercase">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Data/Hora Chegada</th>
                <th className="p-4">Status</th>
                <th className="p-4">NF ID</th>
                <th className="p-4">Funcionário ID</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {recebimentos.map((r) => (
                <tr key={r.idRecebimento} className="hover:bg-slate-50">
                  <td className="p-4 font-mono text-slate-500">#{r.idRecebimento}</td>
                  <td className="p-4 text-slate-800">{new Date(r.dataHoraChegada).toLocaleString('pt-BR')}</td>
                  <td className="p-4">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
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