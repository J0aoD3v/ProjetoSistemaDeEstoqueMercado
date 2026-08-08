export function apenasNumeros(value: string): string {
  return value.replace(/\D/g, '');
}

export function apenasNumerosDecimal(value: string): string {
  const limpo = value.replace(/[^0-9.,]/g, '').replace(/,/g, '.');
  const primeiroPonto = limpo.indexOf('.');
  if (primeiroPonto === -1) return limpo;
  return limpo.slice(0, primeiroPonto + 1) + limpo.slice(primeiroPonto + 1).replace(/\./g, '');
}

export function formatCPF(value: string): string {
  const nums = apenasNumeros(value).slice(0, 11);
  return nums
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function formatCNPJ(value: string): string {
  const nums = apenasNumeros(value).slice(0, 14);
  return nums
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

export function formatPlate(value: string): string {
  const cleaned = apenasNumeros(value).replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 7);
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 7) {
    return cleaned.slice(0, 3) + '-' + cleaned.slice(3);
  }
  return cleaned.slice(0, 3) + '-' + cleaned.slice(3, 7);
}

export function formatNFeKey(value: string): string {
  return apenasNumeros(value).slice(0, 44);
}

export function formatMatricula(value: string): string {
  const cleaned = value.replace(/[^A-Za-z0-9\-]/g, '').toUpperCase();
  if (cleaned.startsWith('FUNC-')) {
    const nums = apenasNumeros(cleaned.slice(5)).slice(0, 3);
    return 'FUNC-' + nums;
  }
  const nums = apenasNumeros(cleaned).slice(0, 3);
  return 'FUNC-' + nums;
}

export function formatCodigoPosicao(value: string): string {
  const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  if (cleaned.length <= 1) return cleaned;
  if (cleaned.length <= 3) return cleaned + '-';
  return cleaned.slice(0, 1) + '-' + cleaned.slice(1, 3) + '-' + cleaned.slice(3, 5);
}
