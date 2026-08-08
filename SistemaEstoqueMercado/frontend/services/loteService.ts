import api from './api';
import { Lote } from '@/types';

export const loteService = {
  listarTodos: async (): Promise<Lote[]> => {
    const response = await api.get<Lote[]>('/lotes');
    return response.data;
  },

  buscarPorId: async (id: number): Promise<Lote> => {
    const response = await api.get<Lote>(`/lotes/${id}`);
    return response.data;
  },

  listarPorProduto: async (idProduto: number): Promise<Lote[]> => {
    const response = await api.get<Lote[]>(`/lotes/produto/${idProduto}`);
    return response.data;
  },

  cadastrar: async (lote: Lote): Promise<Lote> => {
    const response = await api.post<Lote>('/lotes', lote);
    return response.data;
  },

  atualizar: async (id: number, lote: Lote): Promise<Lote> => {
    const response = await api.put<Lote>(`/lotes/${id}`, lote);
    return response.data;
  },

  excluir: async (id: number): Promise<void> => {
    await api.delete(`/lotes/${id}`);
  },
};