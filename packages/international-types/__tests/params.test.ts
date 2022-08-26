import * as tsd from 'vite-plugin-vitest-typescript-assert/tsd';
import type { Params } from '../';

describe('param', () => {
  it('should extract param', () => {
    const value = {} as Params<'Hello {world}'>;

    tsd.expectType<['world']>(value);
  });

  it('should extract multiple params', () => {
    const value = {} as Params<'{username}: {age}'>;

    tsd.expectType<['username', 'age']>(value);
  });

  it('should extract params from plural', () => {
    const value = {} as Params<'{value, plural, =1 {{value} item left} other {{value} items left}'>;

    tsd.expectType<['value']>(value);
  });
});
