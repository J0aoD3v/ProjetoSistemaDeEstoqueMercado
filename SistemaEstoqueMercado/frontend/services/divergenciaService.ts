import api from './api';
import { Divergencia } from '@/types';

export const divergenciaService = {
  listarTodos: async (): Promise<Divergencia[]> => {
    const response = await api.get<Divergencia[]>('/divergencias');
    return response.data;
  },

  buscarPorId: async (id: number): Promise<Divergencia> => {
    const response = await api.get<Divergencia>(`/divergencias/${id}`);
    return response.data;
  },

  listarPorItemRecebimento: async (idItemRecebimento: number): Promise<Divergencia[]> => {
    const response = await api.get<Divergencia[]>(`/divergencias/item/${idItemRecebimento}`);
    return response.data;
  },

  cadastrar: async (divergencia: Divergencia): Promise<Divergencia> => {
    const response = await api.post<Divergencia>('/divergencias', divergencia);
    return response.data;
  },

  atualizar: async (id: number, divergencia: Divergencia): Promise<Divergencia> => {
    const response = await api.put<Divergencia>(`/divergencias/${id}`, divergencia);
    return response.data;
  },

  excluir: async (id: number): Promise<void> => {
    await api.delete(`/divergencias/${id}`);
  },
};
