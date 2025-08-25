import { describe, it, expect } from 'vitest';
import { norm, formatBRL, formatBRLInput } from '../formatters';

const NBSP = '\u00A0';


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
    expect(formatBRL('1234567')).toBe(`R$${NBSP}1.234.567,00`);
    expect(formatBRL('1.234.567')).toBe(`R$${NBSP}1.234.567,00`);
  });

  it('strips non numeric characters before formatting', () => {
    expect(formatBRL('R$ 1.234,56')).toBe(`R$${NBSP}123.456,00`);
    expect(formatBRL('abc123456')).toBe(`R$${NBSP}123.456,00`);
  });

  it('handles values with surrounding spaces', () => {
    expect(formatBRL(' 1234567 ')).toBe(`R$${NBSP}1.234.567,00`);
  });
});

describe('formatBRLInput', () => {
  it('formats input preserving cents', () => {
    expect(formatBRLInput('1')).toBe('0,01');
    expect(formatBRLInput('123456')).toBe('1.234,56');
  });
});

describe('formatCurrency', () => {
  it('formats number to Brazilian currency with cents', () => {
    expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
  });
});
