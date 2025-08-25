import { describe, it, expect } from 'vitest';
import { norm, formatBRL, formatCurrency } from '../formatters';

describe('norm', () => {
  it('handles empty string', () => {
    expect(norm('')).toBe(0);
  });

  it('parses numbers with thousands and decimal separators', () => {
    expect(norm('1.234,56')).toBeCloseTo(1234.56);
    expect(norm('1.234.567,89')).toBeCloseTo(1234567.89);
  });

  it('ignores non numeric characters', () => {
    expect(norm('R$ 1.234,56 abc')).toBeCloseTo(1234.56);
    expect(norm('abc')).toBe(0);
  });

  it('trims surrounding spaces', () => {
    expect(norm(' 1.234,56 ')).toBeCloseTo(1234.56);
  });
});

describe('formatBRL', () => {
  it('returns empty string for empty value', () => {
    expect(formatBRL('')).toBe('');
  });

  it('formats numbers with separators correctly', () => {
    expect(formatBRL('1234567')).toBe('R$ 1.234.567');
    expect(formatBRL('1.234.567')).toBe('R$ 1.234.567');
  });

  it('strips non numeric characters before formatting', () => {
    expect(formatBRL('R$ 1.234,56')).toBe('R$ 123.456');
    expect(formatBRL('abc123456')).toBe('R$ 123.456');
  });

  it('handles values with surrounding spaces', () => {
    expect(formatBRL(' 1234567 ')).toBe('R$ 1.234.567');
  });
});

describe('formatCurrency', () => {
  it('formats number to Brazilian currency with cents', () => {
    expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
  });
});
