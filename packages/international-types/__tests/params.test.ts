import * as tsd from 'vite-plugin-vitest-typescript-assert/tsd';
import type { LocaleValue, ParamsObject } from '../index';

describe('param', () => {
  it('should extract param', () => {
    const value = {} as ParamsObject<'Hello {world}'>;

    tsd.expectType<{
      world: LocaleValue;
    }>(value);
  });

  it('should extract multiple params', () => {
    const value = {} as ParamsObject<'{username}: {age}'>;

    tsd.expectType<{
      username: LocaleValue;
      age: LocaleValue;
    }>(value);
  });
});
