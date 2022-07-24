import { describe, expect, it, vi } from 'vitest';
import { error, warn } from '../src/helpers/log';

describe('log', () => {
  it('should log warn', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => null);

    warn('This is a warn');

    expect(console.warn).toHaveBeenCalledWith('[next-international] This is a warn');
    spy.mockClear();
  });

  it('should log error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => null);

    error('This is an error');

    expect(console.error).toHaveBeenCalledWith('[next-international] This is an error');
    spy.mockClear();
  });
});
