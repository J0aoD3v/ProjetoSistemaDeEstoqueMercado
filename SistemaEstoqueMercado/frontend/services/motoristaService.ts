import api from './api';
import { Motorista } from '@/types';

export const motoristaService = {
  listarTodos: async (): Promise<Motorista[]> => {
    const response = await api.get<Motorista[]>('/motoristas');
    return response.data;
  },

  buscarPorId: async (id: number): Promise<Motorista> => {
    const response = await api.get<Motorista>(`/motoristas/${id}`);
    return response.data;
  },

  cadastrar: async (motorista: Motorista): Promise<Motorista> => {
    const response = await api.post<Motorista>('/motoristas', motorista);
    return response.data;
  },

  atualizar: async (id: number, motorista: Motorista): Promise<Motorista> => {
    const response = await api.put<Motorista>(`/motoristas/${id}`, motorista);
    return response.data;
  },

  excluir: async (id: number): Promise<void> => {
    await api.delete(`/motoristas/${id}`);
  },
};
