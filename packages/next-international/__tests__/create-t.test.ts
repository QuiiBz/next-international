import { describe, expect, it } from 'vitest';
import { createT } from '../src/common/create-t';

describe('createT', () => {
  it('should fall back to scoped #other when locale SE selects #two and that form is missing', () => {
    const t = createT(
      {
        localeContent: {
          'world.welcome#one': 'Hej 1',
          'world.welcome#other': 'Hej {count}',
        },
        locale: 'SE',
      },
      'world',
    );

    expect(t('welcome', { count: 2 })).toBe('Hej 2');
  });
});
