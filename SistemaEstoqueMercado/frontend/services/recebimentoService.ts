import api from './api';
import { Recebimento } from '@/types';

export const recebimentoService = {
  listarTodos: async (): Promise<Recebimento[]> => {
    const response = await api.get<Recebimento[]>('/recebimentos');
    return response.data;
  },

  cadastrar: async (recebimento: Recebimento): Promise<Recebimento> => {
    const response = await api.post<Recebimento>('/recebimentos', recebimento);
    return response.data;
  },
};