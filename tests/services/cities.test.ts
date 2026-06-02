import { describe, it, expect } from 'vitest';
import {
  buildCity,
  parseCity,
  reconcileCity,
  cityMatchKey,
  knownCityNamesInState,
  isValidStateCode,
} from '../../utils/cities';

describe('buildCity', () => {
  it('builds a canonical "City, ST" string', () => {
    const c = buildCity('Austin', 'TX');
    expect(c?.display).toBe('Austin, TX');
    expect(c?.state).toBe('TX');
  });

  it('normalizes whitespace and lowercases the state input', () => {
    const c = buildCity('  San   Francisco  ', 'ca');
    expect(c?.display).toBe('San Francisco, CA');
  });

  it('accepts real-world punctuation (periods, hyphens, apostrophes, accents)', () => {
    expect(buildCity('St. Louis', 'MO')?.display).toBe('St. Louis, MO');
    expect(buildCity('Winston-Salem', 'NC')?.display).toBe('Winston-Salem, NC');
    expect(buildCity("Coeur d'Alene", 'ID')?.display).toBe("Coeur d'Alene, ID");
    expect(buildCity('Española', 'NM')?.display).toBe('Española, NM');
  });

  it('rejects empty, invalid, or overly long city names', () => {
    expect(buildCity('', 'TX')).toBeNull();
    expect(buildCity('   ', 'TX')).toBeNull();
    expect(buildCity('123 Fake', 'TX')).toBeNull(); // starts with a digit
    expect(buildCity('A'.repeat(200), 'TX')).toBeNull();
  });

  it('rejects invalid state codes', () => {
    expect(buildCity('Austin', 'ZZ')).toBeNull();
    expect(buildCity('Austin', 'Texas')).toBeNull();
    expect(buildCity('Austin', '')).toBeNull();
  });
});

describe('dedup / reconciliation', () => {
  it('treats casing, spacing and periods as the same place (same key)', () => {
    expect(cityMatchKey('St. Louis', 'MO')).toBe(cityMatchKey('st louis', 'mo'));
    expect(cityMatchKey('New  York', 'NY')).toBe(cityMatchKey('new york', 'NY'));
  });

  it('keeps same-name cities in different states distinct', () => {
    expect(cityMatchKey('Portland', 'OR')).not.toBe(cityMatchKey('Portland', 'ME'));
  });

  it('reuses an existing spelling instead of creating a near-duplicate', () => {
    const known = ['Austin, TX', 'Cleveland, OH'];
    const candidate = buildCity('austin', 'TX')!;
    expect(reconcileCity(candidate, known)).toBe('Austin, TX');
  });

  it('returns the new display for a genuinely new city', () => {
    const known = ['Austin, TX'];
    const candidate = buildCity('Boise', 'ID')!;
    expect(reconcileCity(candidate, known)).toBe('Boise, ID');
  });
});

describe('parseCity & suggestions', () => {
  it('round-trips a canonical string', () => {
    expect(parseCity('Cleveland, OH')?.city).toBe('Cleveland');
    expect(parseCity('Cleveland, OH')?.state).toBe('OH');
  });

  it('returns null for malformed values', () => {
    expect(parseCity('Cleveland')).toBeNull();
    expect(parseCity('')).toBeNull();
  });

  it('lists known city names within a state', () => {
    const known = ['Austin, TX', 'Dallas, TX', 'Cleveland, OH'];
    expect(knownCityNamesInState(known, 'TX')).toEqual(['Austin', 'Dallas']);
    expect(knownCityNamesInState(known, 'OH')).toEqual(['Cleveland']);
    expect(knownCityNamesInState(known, 'CA')).toEqual([]);
  });
});

describe('isValidStateCode', () => {
  it('accepts states, DC and territories; rejects junk', () => {
    expect(isValidStateCode('ca')).toBe(true);
    expect(isValidStateCode('DC')).toBe(true);
    expect(isValidStateCode('PR')).toBe(true);
    expect(isValidStateCode('ZZ')).toBe(false);
  });
});
