import { describe, it, expect } from 'vitest';
import { analyzeLocalMessage } from '../localMessageAnalyzer';

describe('analyzeLocalMessage', () => {
  it('detects rural-only messages without 30% reference', () => {
    const message = 'Para a cidade Teste, trabalhamos apenas com imóveis rurais.';
    const analysis = analyzeLocalMessage(message);

    expect(analysis.type).toBe('limit_30_rural');
    expect(analysis.cidade).toBe('Teste');
    expect(analysis.needsRuralConfirmation).toBe(true);
    expect(analysis.shouldLimitTo30Percent).toBe(true);
  });
});
