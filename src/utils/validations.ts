
import { norm } from './formatters';

export interface FormValidation {
  emprestimoValue: number;
  garantiaValue: number;
  emprestimoExcedeGarantia: boolean;
  parcelasValidas: boolean;
  emprestimoForaRange: boolean;
  formularioValido: boolean;
}

/**
 * Valida CPF brasileiro
 */
export const validateCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Valida os dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
};

/**
 * Valida CNPJ brasileiro
 */
export const validateCNPJ = (cnpj: string): boolean => {
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  
  if (cleanCNPJ.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;
  
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weights1[i];
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  
  if (digit1 !== parseInt(cleanCNPJ.charAt(12))) return false;
  
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weights2[i];
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  
  if (digit2 !== parseInt(cleanCNPJ.charAt(13))) return false;
  
  return true;
};

/**
 * Valida email
 */
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida telefone brasileiro
 */
export const validatePhone = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Aceita 10 ou 11 dígitos (com ou sem 9º dígito)
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

/**
 * Formata telefone brasileiro
 */
export const formatPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 11) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`;
  } else if (cleanPhone.length === 10) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`;
  }
  
  return phone;
};

/**
 * Formata CPF
 */
export const formatCPF = (cpf: string): string => {
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length <= 11) {
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  return cpf;
};

export const validateForm = (
  emprestimo: string,
  garantia: string,
  parcelas: number,
  amortizacao: string,
  cidade: string,
  nomeCompleto?: string,
  email?: string,
  telefone?: string
): FormValidation => {
  const emprestimoValue = norm(emprestimo);
  const garantiaValue = norm(garantia);
  
  // Empréstimo deve estar entre 100k e 5M
  const emprestimoForaRange = emprestimoValue < 100000 || emprestimoValue > 5000000;
  
  // Garantia deve ser pelo menos 2x o empréstimo
  const emprestimoExcedeGarantia = emprestimoValue > (garantiaValue / 2);
  
  // Parcelas devem estar entre 36 e 180
  const parcelasValidas = parcelas >= 36 && parcelas <= 180;
  
  // Validações básicas
  const dadosBasicosValidos = 
    emprestimoValue >= 100000 &&
    emprestimoValue <= 5000000 &&
    garantiaValue > 0 && 
    parcelasValidas && 
    amortizacao && 
    cidade;
  
  // Validações de contato (quando fornecidas)
  const contatoValido = !nomeCompleto || !email || !telefone || (
    nomeCompleto.length >= 3 &&
    validateEmail(email) &&
    validatePhone(telefone)
  );
  
  const formularioValido = 
    dadosBasicosValidos &&
    !emprestimoExcedeGarantia &&
    !emprestimoForaRange &&
    contatoValido;

  return {
    emprestimoValue,
    garantiaValue,
    emprestimoExcedeGarantia,
    parcelasValidas,
    emprestimoForaRange,
    formularioValido
  };
};
