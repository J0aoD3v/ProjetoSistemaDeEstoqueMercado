import api from './api';
import { Veiculo } from '@/types';

export const veiculoService = {
  listarTodos: async (): Promise<Veiculo[]> => {
    const response = await api.get<Veiculo[]>('/veiculos');
    return response.data;
  },

  buscarPorId: async (id: number): Promise<Veiculo> => {
    const response = await api.get<Veiculo>(`/veiculos/${id}`);
    return response.data;
  },

  cadastrar: async (veiculo: Veiculo): Promise<Veiculo> => {
    const response = await api.post<Veiculo>('/veiculos', veiculo);
    return response.data;
  },

  atualizar: async (id: number, veiculo: Veiculo): Promise<Veiculo> => {
    const response = await api.put<Veiculo>(`/veiculos/${id}`, veiculo);
    return response.data;
  },

  excluir: async (id: number): Promise<void> => {
    await api.delete(`/veiculos/${id}`);
  },
};
