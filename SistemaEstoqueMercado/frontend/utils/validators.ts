const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const placaRegex = /^[A-Z]{3}-[0-9]{4}$|^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
const nfeKeyRegex = /^\d{44}$/;
const skuRegex = /^[A-Z0-9\-]+$/;
const codigoBarrasRegex = /^\d{8,14}$/;
const matriculaRegex = /^FUNC-[0-9]{3}$/;
const codigoPosicaoRegex = /^[A-Z0-9]+-[0-9]{2}-[0-9]{2}$/;

export function validarCPF(valor: string): string | null {
  const limpo = valor.replace(/\D/g, '');
  if (limpo.length === 0) return 'CPF é obrigatório.';
  if (limpo.length < 11) return 'CPF incompleto. Digite 11 números.';
  if (!cpfRegex.test(valor)) return 'Formato esperado: 000.000.000-00';
  return null;
}

export function validarCNPJ(valor: string): string | null {
  const limpo = valor.replace(/\D/g, '');
  if (limpo.length === 0) return 'CNPJ é obrigatório.';
  if (limpo.length < 14) return 'CNPJ incompleto. Digite 14 números.';
  if (!cnpjRegex.test(valor)) return 'Formato esperado: 00.000.000/0001-00';
  return null;
}

export function validarPlaca(valor: string): string | null {
  const limpo = valor.replace(/[^A-Za-z0-9\-]/g, '').toUpperCase();
  if (limpo.length === 0) return 'Placa é obrigatória.';
  if (!placaRegex.test(limpo)) return 'Formato esperado: ABC-1234 ou ABC1D23';
  return null;
}

export function validarNFeKey(valor: string): string | null {
  const limpo = valor.replace(/\D/g, '');
  if (limpo.length === 0) return 'Chave de acesso é obrigatória.';
  if (limpo.length !== 44) return `Chave deve conter 44 dígitos. (${limpo.length}/44)`;
  if (!nfeKeyRegex.test(limpo)) return 'Chave deve conter apenas números.';
  return null;
}

export function validarSKU(valor: string): string | null {
  if (!valor.trim()) return 'SKU é obrigatório.';
  if (!skuRegex.test(valor.toUpperCase())) return 'Use apenas letras maiúsculas, números e hífen.';
  return null;
}

export function validarCodigoBarras(valor: string): string | null {
  const limpo = valor.replace(/\D/g, '');
  if (limpo.length === 0) return 'Código de barras é obrigatório.';
  if (limpo.length < 8 || limpo.length > 14) return `Código deve ter entre 8 e 14 dígitos. (${limpo.length})`;
  if (!codigoBarrasRegex.test(limpo)) return 'Código de barras deve conter apenas números.';
  return null;
}

export function validarMatricula(valor: string): string | null {
  if (!valor.trim()) return 'Matrícula é obrigatória.';
  if (!matriculaRegex.test(valor.toUpperCase())) return 'Formato esperado: FUNC-001';
  return null;
}

export function validarCodigoPosicao(valor: string): string | null {
  const limpo = valor.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  if (limpo.length === 0) return 'Código da posição é obrigatório.';
  if (!codigoPosicaoRegex.test(limpo)) return 'Formato esperado: A-01-02';
  return null;
}

export function validarNumeroLote(valor: string): string | null {
  if (!valor.trim()) return 'Número do lote é obrigatório.';
  if (!skuRegex.test(valor.toUpperCase())) return 'Use apenas letras maiúsculas, números e hífen.';
  return null;
}

export function validarCampoObrigatorio(valor: string, nomeCampo: string): string | null {
  if (!valor.trim()) return `${nomeCampo} é obrigatório.`;
  return null;
}

function normalizarNumero(valor: string): string {
  return valor
    .trim()
    .replace(/\.(?=\d{3}(,|$))/g, '')
    .replace(',', '.');
}

export function validarNumeroPositivo(valor: string, nomeCampo: string): string | null {
  const limpo = valor.trim();
  if (limpo.length === 0) return `${nomeCampo} é obrigatório.`;
  const normalizado = normalizarNumero(limpo);
  if (!/^\d+(\.\d+)?$/.test(normalizado)) return `${nomeCampo} deve conter apenas números.`;
  const num = Number(normalizado);
  if (num <= 0) return `${nomeCampo} deve ser um número maior que zero.`;
  return null;
}

export function validarNumeroObrigatorio(valor: string, nomeCampo: string): string | null {
  const limpo = valor.trim();
  if (limpo.length === 0) return `${nomeCampo} é obrigatório.`;
  const normalizado = normalizarNumero(limpo);
  if (!/^\d+(\.\d+)?$/.test(normalizado)) return `${nomeCampo} deve conter apenas números.`;
  return null;
}

export function aplicouTipoErrado(valor: string, substituido: string, tipo: 'número' | 'letras'): string | null {
  if (valor !== substituido) return `Digite apenas ${tipo === 'número' ? 'números' : 'letras'}.`;
  return null;
}
