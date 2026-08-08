import api from './api';
import { ItemRecebimento } from '@/types';

export const itemRecebimentoService = {
  listarTodos: async (): Promise<ItemRecebimento[]> => {
    const response = await api.get<ItemRecebimento[]>('/itens-recebimento');
    return response.data;
  },

  buscarPorId: async (id: number): Promise<ItemRecebimento> => {
    const response = await api.get<ItemRecebimento>(`/itens-recebimento/${id}`);
    return response.data;
  },

  listarPorRecebimento: async (idRecebimento: number): Promise<ItemRecebimento[]> => {
    const response = await api.get<ItemRecebimento[]>(`/itens-recebimento/recebimento/${idRecebimento}`);
    return response.data;
  },

  cadastrar: async (item: ItemRecebimento): Promise<ItemRecebimento> => {
    const response = await api.post<ItemRecebimento>('/itens-recebimento', item);
    return response.data;
  },

  atualizar: async (id: number, item: ItemRecebimento): Promise<ItemRecebimento> => {
    const response = await api.put<ItemRecebimento>(`/itens-recebimento/${id}`, item);
    return response.data;
  },

  excluir: async (id: number): Promise<void> => {
    await api.delete(`/itens-recebimento/${id}`);
  },

  calcularDivergencia: async (item: ItemRecebimento): Promise<number> => {
    const response = await api.post<number>('/itens-recebimento/calcular-divergencia', item);
    return response.data;
  },
};
