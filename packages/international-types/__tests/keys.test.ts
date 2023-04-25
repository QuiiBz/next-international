import * as tsd from 'vite-plugin-vitest-typescript-assert/tsd';
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

    tsd.expectType<'hello' | 'hello.world'>(value);
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

    tsd.expectType<'demo' | 'another.demo'>(value);
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

    tsd.expectType<'demo' | 'another.demo'>(value);
  });

  it('should return keys without plural suffix', () => {
    const value = {} as LocaleKeys<
      {
        hello: 'Hello';
        'scope.nested.demo': 'Nested scope';
        'scope.nested.another.demo': 'Another nested scope';
        'scope.nested.hello#zero': 'Hello 0';
        'scope.nested.hello#one': 'Hello 1';
        'scope.nested.hello#two': 'Hello 2';
        'scope.nested.hello#few': 'Hello few';
        'scope.nested.hello#many': 'Hello many';
        'scope.nested.hello#other': 'Hello other';
      },
      'scope.nested'
    >;

    tsd.expectType<'demo' | 'another.demo' | 'hello'>(value);
  });
});
