import { describe, expect, it } from 'vitest';
import { createI18n } from '../src';

describe('createI18n', () => {
  it('should create i18n', () => {
    const result = createI18n({});

    expect(result.I18nProvider).toBeDefined();

    expect(result.getLocaleStaticProps).toBeDefined();
    expect(result.getLocaleStaticProps).toBeInstanceOf(Function);

    expect(result.getLocaleProps).toBeDefined();
    expect(result.getLocaleProps).toBeInstanceOf(Function);

    expect(result.useChangeLocale).toBeDefined();
    expect(result.useChangeLocale).toBeInstanceOf(Function);

    expect(result.useI18n).toBeDefined();
    expect(result.useI18n).toBeInstanceOf(Function);
  });
});
