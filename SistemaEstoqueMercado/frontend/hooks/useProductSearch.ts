'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@/services/api';
import { Produto } from '@/types';

interface UseProductSearchOptions {
  onSelect?: (produto: Produto) => void;
  minLength?: number;
  debounceMs?: number;
}

export function useProductSearch(options: UseProductSearchOptions = {}) {
  const { onSelect, minLength = 1, debounceMs = 300 } = options;
  const [termo, setTermo] = useState('');
  const [sugestoes, setSugestoes] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [aberto, setAberto] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const buscar = useCallback(async (valor: string) => {
    if (valor.length < minLength) {
      setSugestoes([]);
      setAberto(false);
      return;
    }

    setCarregando(true);
    try {
      const response = await api.get<Produto[]>('/produtos/buscar', {
        params: { termo: valor },
      });
      setSugestoes(response.data);
      setAberto(response.data.length > 0);
    } catch {
      setSugestoes([]);
      setAberto(false);
    } finally {
      setCarregando(false);
    }
  }, [minLength]);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => buscar(termo), debounceMs);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [termo, buscar, debounceMs]);

  const selecionar = useCallback((produto: Produto) => {
    setTermo(produto.sku);
    setAberto(false);
    setSugestoes([]);
    onSelect?.(produto);
  }, [onSelect]);

  const fechar = useCallback(() => {
    setAberto(false);
  }, []);

  return {
    termo,
    setTermo,
    sugestoes,
    carregando,
    aberto,
    selecionar,
    fechar,
    buscar,
  };
}
