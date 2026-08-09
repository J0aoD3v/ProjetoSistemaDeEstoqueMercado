import api from './api';
import type {
  EntidadeMeta,
  ResultadoImportacao,
  ResumoExportacao,
  ValidacaoImportacao,
} from '@/types/Dados';

function formData(entidade: string, arquivo: File): FormData {
  const form = new FormData();
  form.append('entidade', entidade);
  form.append('arquivo', arquivo);
  return form;
}

export const dadosService = {
  obterEntidades: async (): Promise<EntidadeMeta[]> => {
    const resposta = await api.get<EntidadeMeta[]>('/dados/entidades');
    return resposta.data;
  },

  validarImportacao: async (entidade: string, arquivo: File): Promise<ValidacaoImportacao> => {
    const resposta = await api.post<ValidacaoImportacao>('/dados/importar/validar', formData(entidade, arquivo), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return resposta.data;
  },

  importar: async (entidade: string, arquivo: File): Promise<ResultadoImportacao> => {
    const resposta = await api.post<ResultadoImportacao>('/dados/importar', formData(entidade, arquivo), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return resposta.data;
  },

  resumoExportacao: async (entidade: string): Promise<ResumoExportacao> => {
    const resposta = await api.get<ResumoExportacao>('/dados/exportar/resumo', { params: { entidade } });
    return resposta.data;
  },

  exportarCSV: async (entidade: string): Promise<void> => {
    const resposta = await api.get('/dados/exportar', {
      params: { entidade },
      responseType: 'blob',
    });
    const url = URL.createObjectURL(resposta.data as Blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${entidade}_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },
};