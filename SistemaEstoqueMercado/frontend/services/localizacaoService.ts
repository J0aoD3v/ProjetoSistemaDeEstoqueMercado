import api from './api';
import { Localizacao } from '@/types';

export const localizacaoService = {
  listarTodos: async (): Promise<Localizacao[]> => {
    const response = await api.get<Localizacao[]>('/localizacoes');
    return response.data;
  },

  buscarPorId: async (id: number): Promise<Localizacao> => {
    const response = await api.get<Localizacao>(`/localizacoes/${id}`);
    return response.data;
  },

  cadastrar: async (localizacao: Localizacao): Promise<Localizacao> => {
    const response = await api.post<Localizacao>('/localizacoes', localizacao);
    return response.data;
  },

  atualizar: async (id: number, localizacao: Localizacao): Promise<Localizacao> => {
    const response = await api.put<Localizacao>(`/localizacoes/${id}`, localizacao);
    return response.data;
  },

  excluir: async (id: number): Promise<void> => {
    await api.delete(`/localizacoes/${id}`);
  },
};
