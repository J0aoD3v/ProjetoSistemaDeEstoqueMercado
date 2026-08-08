import api from './api';
import { Recebimento } from '@/types';

export const recebimentoService = {
  listarTodos: async (): Promise<Recebimento[]> => {
    const response = await api.get<Recebimento[]>('/recebimentos');
    return response.data;
  },

  buscarPorId: async (id: number): Promise<Recebimento> => {
    const response = await api.get<Recebimento>(`/recebimentos/${id}`);
    return response.data;
  },

  cadastrar: async (recebimento: Recebimento): Promise<Recebimento> => {
    const response = await api.post<Recebimento>('/recebimentos', recebimento);
    return response.data;
  },

  atualizar: async (id: number, recebimento: Recebimento): Promise<Recebimento> => {
    const response = await api.put<Recebimento>(`/recebimentos/${id}`, recebimento);
    return response.data;
  },

  excluir: async (id: number): Promise<void> => {
    await api.delete(`/recebimentos/${id}`);
  },
};
