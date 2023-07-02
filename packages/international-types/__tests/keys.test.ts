import { assertType } from 'vitest';
import type { LocaleKeys } from '../';

describe('keys', () => {
  it('should return the keys', () => {
    const value = {} as LocaleKeys<
      {
        hello: 'Hello';
        'hello.world': 'Hello World';
      },
      undefined
    >;

    assertType<'hello' | 'hello.world'>(value);
  });

  it('should return the keys with scope', () => {
    const value = {} as LocaleKeys<
      {
        hello: 'Hello';
        'scope.demo': 'Nested scope';
        'scope.another.demo': 'Another nested scope';
      },
      'scope'
    >;

    assertType<'demo' | 'another.demo'>(value);
  });

  it('should return the keys with nested scope', () => {
    const value = {} as LocaleKeys<
      {
        hello: 'Hello';
        'scope.nested.demo': 'Nested scope';
        'scope.nested.another.demo': 'Another nested scope';
      },
      'scope.nested'
    >;

    assertType<'demo' | 'another.demo'>(value);
  });
});
