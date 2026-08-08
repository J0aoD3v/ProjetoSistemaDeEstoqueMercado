import api from './api';
import { NotaFiscal } from '@/types';

export const notaFiscalService = {
  listarTodos: async (): Promise<NotaFiscal[]> => {
    const response = await api.get<NotaFiscal[]>('/notas-fiscais');
    return response.data;
  },

  buscarPorId: async (id: number): Promise<NotaFiscal> => {
    const response = await api.get<NotaFiscal>(`/notas-fiscais/${id}`);
    return response.data;
  },

  cadastrar: async (notaFiscal: NotaFiscal): Promise<NotaFiscal> => {
    const response = await api.post<NotaFiscal>('/notas-fiscais', notaFiscal);
    return response.data;
  },

  atualizar: async (id: number, notaFiscal: NotaFiscal): Promise<NotaFiscal> => {
    const response = await api.put<NotaFiscal>(`/notas-fiscais/${id}`, notaFiscal);
    return response.data;
  },

  excluir: async (id: number): Promise<void> => {
    await api.delete(`/notas-fiscais/${id}`);
  },
};
