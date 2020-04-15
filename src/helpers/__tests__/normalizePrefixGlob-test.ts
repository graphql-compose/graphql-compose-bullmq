import { normalizePrefixGlob } from '../normalizePrefixGlob';

describe('normalizePrefixGlob', () => {
  it('check empty mask', () => {
    expect(normalizePrefixGlob('')).toBe('*:*:meta');
  });

  it('check simple mask', () => {
    expect(normalizePrefixGlob('bull*')).toBe('bull*:*:meta');
    expect(normalizePrefixGlob('bull')).toBe('bull:*:meta');
  });

  it('check mask with queue name prefix', () => {
    expect(normalizePrefixGlob('bull:metrics*')).toBe('bull:metrics*:meta');
  });

  it('check mask with queue name complete', () => {
    expect(normalizePrefixGlob('bull:metrics')).toBe('bull:metrics:meta');
    expect(normalizePrefixGlob('bull*:metrics')).toBe('bull*:metrics:meta');
  });

  it('check mask with prefix which contains semicolons', () => {
    expect(normalizePrefixGlob('my:service:bull:metrics')).toBe('my:service:bull:metrics:meta');
    expect(normalizePrefixGlob('my:service*:bull:metrics*')).toBe('my:service*:bull:metrics*:meta');
  });
});
