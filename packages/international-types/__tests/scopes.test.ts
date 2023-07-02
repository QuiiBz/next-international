import { assertType } from 'vitest';

import type { Scopes } from '../';

describe('scopes', () => {
  it('should return the scopes', () => {
    const value = {} as Scopes<{
      hello: 'Hello';
      'hello.world': 'Hello World';
    }>;

    assertType<'hello'>(value);
  });

  it('should return the nested scopes', () => {
    const value = {} as Scopes<{
      hello: 'Hello';
      'hello.world': 'Hello World';
      'scope.demo': 'Nested scope';
      'scope.another.demo': 'Another nested scope';
    }>;

    assertType<'hello' | 'scope' | 'scope.another'>(value);
  });
});
