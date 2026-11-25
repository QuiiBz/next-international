import { describe, expect, it } from 'vitest';
import { flattenLocale } from '../src';

describe('flattenLocale', () => {
  it('should flatten nested and flat keys in order', () => {
    const locale = flattenLocale({
      hello: 'Hello',
      namespace: {
        hello: 'Hello',
        subnamespace: {
          weather: "Today's weather is {weather}",
        },
      },
      'only.exists.in.en': 'EN locale',
    });

    expect(Object.entries(locale)).toEqual([
      ['hello', 'Hello'],
      ['namespace.hello', 'Hello'],
      ['namespace.subnamespace.weather', "Today's weather is {weather}"],
      ['only.exists.in.en', 'EN locale'],
    ]);
  });

  it('should keep the last value of a duplicated key', () => {
    const locale = flattenLocale({
      'namespace.hello': 'Hello',
      namespace: {
        hello: 'Hello World!',
      },
    });

    expect(locale).toEqual({
      'namespace.hello': 'Hello World!',
    });
  });

  it('should overwrite a nested key without moving its position', () => {
    const locale = flattenLocale({
      namespace: {
        hello: 'Hello',
        goodbye: 'Goodbye',
      },
      'namespace.hello': 'Hello World!',
    });

    expect(Object.entries(locale)).toEqual([
      ['namespace.hello', 'Hello World!'],
      ['namespace.goodbye', 'Goodbye'],
    ]);
  });

  it('should prepend the prefix to flat and nested keys without changing the input', () => {
    const input = Object.freeze({
      hello: 'Hello',
      namespace: Object.freeze({ hello: 'Hello World!' }),
    });

    expect(flattenLocale(input, 'prefix.')).toEqual({
      'prefix.hello': 'Hello',
      'prefix.namespace.hello': 'Hello World!',
    });
    expect(input).toEqual({ hello: 'Hello', namespace: { hello: 'Hello World!' } });
  });

  it('should keep __proto__ as an own data property', () => {
    const locale = flattenLocale(JSON.parse('{"__proto__":"Translation","hello":"Hello"}'));

    expect(Object.getOwnPropertyDescriptor(locale, '__proto__')).toEqual({
      value: 'Translation',
      writable: true,
      enumerable: true,
      configurable: true,
    });
    expect(Object.getPrototypeOf(locale)).toBe(Object.prototype);
    expect(Object.entries(locale)).toEqual([
      ['__proto__', 'Translation'],
      ['hello', 'Hello'],
    ]);
  });

  it('should flatten a large locale in under one second', () => {
    const locale = Object.fromEntries(Array.from({ length: 5600 }, (_, index) => [`key${index}`, `Value ${index}`]));

    const start = performance.now();
    const result = flattenLocale(locale);
    const duration = performance.now() - start;

    expect(result).toEqual(locale);
    expect(duration).toBeLessThan(1000);
  });
});
