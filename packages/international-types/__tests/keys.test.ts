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
        'scope.nested.hello_zero': 'Hello 0';
        'scope.nested.hello_one': 'Hello 1';
        'scope.nested.hello_two': 'Hello 2';
        'scope.nested.hello_few': 'Hello few';
        'scope.nested.hello_many': 'Hello many';
        'scope.nested.hello_other': 'Hello other';
      },
      'scope.nested'
    >;

    tsd.expectType<'demo' | 'another.demo' | 'hello'>(value);
  });
});
