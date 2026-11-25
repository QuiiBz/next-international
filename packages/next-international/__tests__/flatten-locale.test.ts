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

  it('should flatten a large locale in linear time', () => {
    const locale = Object.fromEntries(Array.from({ length: 5600 }, (_, index) => [`key${index}`, `Value ${index}`]));

    const start = performance.now();
    const result = flattenLocale(locale);
    const duration = performance.now() - start;

    expect(Object.keys(result)).toHaveLength(5600);
    expect(duration).toBeLessThan(1000);
  });
});
