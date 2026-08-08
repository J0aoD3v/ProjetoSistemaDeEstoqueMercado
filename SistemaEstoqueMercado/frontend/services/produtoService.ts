import api from './api';
import { Produto } from '@/types';

export const produtoService = {
  listarTodos: async (): Promise<Produto[]> => {
    const response = await api.get<Produto[]>('/produtos');
    return response.data;
  },

  buscarPorId: async (id: number): Promise<Produto> => {
    const response = await api.get<Produto>(`/produtos/${id}`);
    return response.data;
  },

  cadastrar: async (produto: Produto): Promise<Produto> => {
    const response = await api.post<Produto>('/produtos', produto);
    return response.data;
  },

  atualizar: async (id: number, produto: Produto): Promise<Produto> => {
    const response = await api.put<Produto>(`/produtos/${id}`, produto);
    return response.data;
  },

  excluir: async (id: number): Promise<void> => {
    await api.delete(`/produtos/${id}`);
  },
};