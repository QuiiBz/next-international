import * as tsd from 'vite-plugin-vitest-typescript-assert/tsd';
import type { Params } from '../dist';

describe('param', () => {
  it('should extract param', () => {
    const value = {} as Params<'Hello {world}'>;

    tsd.expectType<['world']>(value);
  });

  it('should extract multiple params', () => {
    const value = {} as Params<'{username}: {age}'>;

    tsd.expectType<['username', 'age']>(value);
  });
});
