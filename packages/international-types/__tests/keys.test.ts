import * as tsd from 'vite-plugin-vitest-typescript-assert/tsd';
import type { LocaleKeys } from '../';

describe('keys', () => {
  it('should return the keys', () => {
    const keys = {} as LocaleKeys<
      {
        hello: 'Hello';
        'hello.world': 'Hello World';
      },
      undefined
    >;

    tsd.expectType<'hello' | 'hello.world'>(keys);
  });

  it('should return the keys with scope', () => {
    const keys = {} as LocaleKeys<
      {
        hello: 'Hello';
        'scope.demo': 'Nested scope';
        'scope.another.demo': 'Another nested scope';
      },
      'scope'
    >;

    tsd.expectType<'demo' | 'another.demo'>(keys);
    tsd.expectType<'demo' | 'another.demo'>(keys);
  });

  it('should return the keys with nested scope', () => {
    const keys = {} as LocaleKeys<
      {
        hello: 'Hello';
        'scope.nested.demo': 'Nested scope';
        'scope.nested.another.demo': 'Another nested scope';
      },
      'scope.nested'
    >;

    tsd.expectType<'demo' | 'another.demo'>(keys);
    tsd.expectType<'demo' | 'another.demo'>(keys);
  });
});
