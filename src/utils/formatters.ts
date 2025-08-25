
// Função para normalizar valores em formato brasileiro para Number
export const norm = (s: string) =>
  Number(s.replace(/\./g, '').replace(/,/g, '.').replace(/[^0-9.]/g, ''));

// Função para formatar valor em formato brasileiro
export const formatBRL = (value: string) => {
  const num = value.replace(/\D/g, '');
  if (!num) return '';

  return Number(num).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
};

// Função para formatar valores com formatação brasileira em tempo real
export const formatBRLInput = (value: string) => {
  const num = value.replace(/\D/g, '');
  if (!num) return '';

  const amount = Number(num) / 100;
  return amount.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
