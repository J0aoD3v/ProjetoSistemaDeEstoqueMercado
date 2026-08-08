import api from './api';
import { Divergencia } from '@/types';

export const divergenciaService = {
  listarTodos: async (): Promise<Divergencia[]> => {
    const response = await api.get<Divergencia[]>('/divergencias');
    return response.data;
  },
};