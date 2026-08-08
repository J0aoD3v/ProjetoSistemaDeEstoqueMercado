import api from './api';
import { Fornecedor } from '@/types';

export const fornecedorService = {
  listarTodos: async (): Promise<Fornecedor[]> => {
    const response = await api.get<Fornecedor[]>('/fornecedores');
    return response.data;
  },

  cadastrar: async (fornecedor: Fornecedor): Promise<Fornecedor> => {
    const response = await api.post<Fornecedor>('/fornecedores', fornecedor);
    return response.data;
  },

  excluir: async (id: number): Promise<void> => {
    await api.delete(`/fornecedores/${id}`);
  },
};