import api from './api';
import { Funcionario } from '@/types';

export const funcionarioService = {
  listarTodos: async (): Promise<Funcionario[]> => {
    const response = await api.get<Funcionario[]>('/funcionarios');
    return response.data;
  },

  buscarPorId: async (id: number): Promise<Funcionario> => {
    const response = await api.get<Funcionario>(`/funcionarios/${id}`);
    return response.data;
  },

  cadastrar: async (funcionario: Funcionario): Promise<Funcionario> => {
    const response = await api.post<Funcionario>('/funcionarios', funcionario);
    return response.data;
  },

  atualizar: async (id: number, funcionario: Funcionario): Promise<Funcionario> => {
    const response = await api.put<Funcionario>(`/funcionarios/${id}`, funcionario);
    return response.data;
  },

  excluir: async (id: number): Promise<void> => {
    await api.delete(`/funcionarios/${id}`);
  },
};