import * as tsd from 'vite-plugin-vitest-typescript-assert/tsd';
import type { Scopes } from '../';

describe('scopes', () => {
  it('should return the scopes', () => {
    const keys = {} as Scopes<{
      hello: 'Hello';
      'hello.world': 'Hello World';
    }>;

    tsd.expectType<'hello'>(keys);
  });

  it('should return the nested scopes', () => {
    const keys = {} as Scopes<{
      hello: 'Hello';
      'hello.world': 'Hello World';
      'scope.demo': 'Nested scope';
      'scope.another.demo': 'Another nested scope';
    }>;

    tsd.expectType<'hello' | 'scope' | 'scope.another'>(keys);
  });
});
