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

  it('should extract params from plural', () => {
    const value = {} as ParamsObject<'{value, plural, =1 {1 item left} other {Many items left}}'>;

    tsd.expectType<{
      value: LocaleValue;
    }>(value);
  });

  it('should extract two params from plural', () => {
    const value = {} as ParamsObject<'{value, plural, =1 {{items} item left} other {{items} items left}}'>;

    tsd.expectType<{
      value: LocaleValue;
      items: LocaleValue;
    }>(value);
  });

  it('should extract multiple params from plural', () => {
    const value =
      {} as ParamsObject<'{value, plural, =0 {{items} left} =1 {{items} item left} other {{items} items left}}'>;

    tsd.expectType<{
      value: LocaleValue;
      items: LocaleValue;
    }>(value);
  });

  it('should extract multiple params from plural with different params', () => {
    const value =
      {} as ParamsObject<'{value, plural, =0 {{items} left} =1 {{items} item left} other {You have too many {custom}}}'>;

    tsd.expectType<{
      value: LocaleValue;
      items: LocaleValue;
      custom: LocaleValue;
    }>(value);
  });
});
