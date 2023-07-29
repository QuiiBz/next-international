// This is only a subset of languages tags, but probably the most common ones
// https://en.wikipedia.org/wiki/IETF_language_tag
export type LanguageTag =
  | 'af'
  | 'am'
  | 'ar'
  | 'arn'
  | 'as'
  | 'az'
  | 'ba'
  | 'be'
  | 'bg'
  | 'bn'
  | 'bo'
  | 'br'
  | 'bs'
  | 'ca'
  | 'co'
  | 'cs'
  | 'cy'
  | 'da'
  | 'de'
  | 'dsb'
  | 'dv'
  | 'el'
  | 'en'
  | 'es'
  | 'et'
  | 'eu'
  | 'fa'
  | 'fi'
  | 'fil'
  | 'fo'
  | 'fr'
  | 'fy'
  | 'ga'
  | 'gd'
  | 'gl'
  | 'gsw'
  | 'gu'
  | 'ha'
  | 'he'
  | 'hi'
  | 'hr'
  | 'hsb'
  | 'hu'
  | 'hy'
  | 'id'
  | 'ig'
  | 'ii'
  | 'is'
  | 'it'
  | 'iu'
  | 'ja'
  | 'ka'
  | 'kk'
  | 'kl'
  | 'km'
  | 'kn'
  | 'ko'
  | 'kok'
  | 'ckb'
  | 'ky'
  | 'lb'
  | 'lo'
  | 'lt'
  | 'lv'
  | 'mi'
  | 'mk'
  | 'ml'
  | 'mn'
  | 'moh'
  | 'mr'
  | 'ms'
  | 'mt'
  | 'my'
  | 'nb'
  | 'ne'
  | 'nl'
  | 'nn'
  | 'no'
  | 'st'
  | 'oc'
  | 'or'
  | 'pa'
  | 'pl'
  | 'prs'
  | 'ps'
  | 'pt'
  | 'quc'
  | 'qu'
  | 'rm'
  | 'ro'
  | 'ru'
  | 'rw'
  | 'sa'
  | 'sah'
  | 'se'
  | 'si'
  | 'sk'
  | 'sl'
  | 'sma'
  | 'smj'
  | 'smn'
  | 'sms'
  | 'sq'
  | 'sr'
  | 'sv'
  | 'sw'
  | 'syc'
  | 'ta'
  | 'te'
  | 'tg'
  | 'th'
  | 'tk'
  | 'tn'
  | 'tr'
  | 'tt'
  | 'tzm'
  | 'ug'
  | 'uk'
  | 'ur'
  | 'uz'
  | 'vi'
  | 'wo'
  | 'xh'
  | 'yo'
  | 'zh'
  | 'zu'
  // eslint-disable-next-line @typescript-eslint/ban-types
  | (string & {});

export type LocaleValue = string | number | boolean | null | undefined | Date;
export type BaseLocale = Record<string, LocaleValue>;
export type ImportedLocales = { [C in LanguageTag]?: () => Promise<any> };
export type ExplicitLocales = { [C in LanguageTag]?: BaseLocale };

export type LocaleKeys<
  Locale extends BaseLocale,
  Scope extends Scopes<Locale> | undefined,
  Key extends string = Extract<keyof Locale, string>,
> = Scope extends undefined ? RemovePlural<Key> : Key extends `${Scope}.${infer Test}` ? RemovePlural<Test> : never;

type Delimiter = `=${number}` | 'other';

type ExtractParams<Value extends LocaleValue> = Value extends ''
  ? []
  : Value extends `${string}{${infer Param}}${infer Tail}`
  ? [Param, ...ExtractParams<Tail>]
  : [];

export type Params<Value extends LocaleValue> = Value extends ''
  ? []
  : // Plural with 3 cases
  Value extends `{${infer Param}, plural, ${Delimiter} {${infer Content}} ${Delimiter} {${infer Content2}} ${Delimiter} {${infer Content3}}}`
  ? [Param, ...ExtractParams<Content>, ...ExtractParams<Content2>, ...ExtractParams<Content3>]
  : // Plural with 2 cases
  Value extends `{${infer Param}, plural, ${Delimiter} {${infer Content}} ${Delimiter} {${infer Content2}}}`
  ? [Param, ...ExtractParams<Content>, ...ExtractParams<Content2>]
  : // Simple cases (e.g `This is a {param}`)
  Value extends `${string}{${infer Param}}${infer Tail}`
  ? [Param, ...Params<Tail>]
  : [];

export type GetParams<Value extends LocaleValue> = Value extends ''
  ? []
  : Value extends `${string}{${infer Param}}${infer Tail}`
  ? [Param, ...Params<Tail>]
  : [];

export type ParamsObject<Value extends LocaleValue> = Record<Params<Value>[number], LocaleValue>;

type ExtractScopes<
  Value extends string,
  Prev extends string | undefined = undefined,
> = Value extends `${infer Head}.${infer Tail}`
  ? [
      Prev extends string ? `${Prev}.${Head}` : Head,
      ...ExtractScopes<Tail, Prev extends string ? `${Prev}.${Head}` : Head>,
    ]
  : [];

export type Scopes<Locale extends BaseLocale> = ExtractScopes<Extract<keyof Locale, string>>[number];

export type ScopedValue<
  Locale extends BaseLocale,
  Scope extends Scopes<Locale> | undefined,
  Key extends LocaleKeys<Locale, Scope>,
> = Scope extends undefined
  ? IsPlural<Key, Locale> extends true
    ? Locale[`${Key}#${PluralSuffix}`]
    : Locale[Key]
  : IsPlural<Key, Locale> extends true
  ? Locale[`${Scope}.${Key}#${PluralSuffix}`]
  : Locale[`${Scope}.${Key}`];

// From https://github.com/microsoft/TypeScript/issues/13298#issuecomment-885980381
type UnionToIntersection<U> = (U extends never ? never : (arg: U) => never) extends (arg: infer I) => void ? I : never;

type UnionToTuple<T> = UnionToIntersection<T extends never ? never : (t: T) => T> extends (_: never) => infer W
  ? [...UnionToTuple<Exclude<T, W>>, W]
  : [];

// Given a object type with string keys, return the "first" key.
// Because the key ordering is not guaranteed, this type should be used
// only when the key order is not important.
type SomeKey<T extends Record<string, any>> = UnionToTuple<keyof T>[0] extends string
  ? UnionToTuple<keyof T>[0]
  : never;

// Gets a single locale type from an object of the shape of BaseLocales.
export type GetLocaleType<Locales extends ImportedLocales | ExplicitLocales> = Locales extends ImportedLocales
  ? Awaited<ReturnType<NonNullable<Locales[SomeKey<Locales>]>>>['default']
  : NonNullable<Locales[SomeKey<Locales>]>;

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]];

type Leaves<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T]
  : '';

type FollowPath<T, P> = P extends `${infer U}.${infer R}`
  ? U extends keyof T
    ? FollowPath<T[U], R>
    : never
  : P extends keyof T
  ? T[P]
  : never;

export type FlattenLocale<Locale extends Record<string, unknown>> = {
  [K in Leaves<Locale>]: FollowPath<Locale, K>;
};

type PluralSuffix = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

type RemovePlural<Key extends string> = Key extends `${infer Head}#${PluralSuffix}` ? Head : Key;
type GetPlural<Key extends string, Locale extends BaseLocale> = `${Key}#${PluralSuffix}` &
  keyof Locale extends infer PluralKey
  ? PluralKey extends `${string}#${infer Plural extends PluralSuffix}`
    ? Plural
    : never
  : never;
type IsPlural<Key extends string, Locale extends BaseLocale> = `${Key}#${PluralSuffix}` & keyof Locale extends never
  ? false
  : true;

type GetCountUnion<
  Key extends string,
  Locale extends BaseLocale,
  Plural extends PluralSuffix = GetPlural<Key, Locale>,
> = Plural extends 'zero'
  ? 0
  : Plural extends 'one'
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    1 | 21 | 31 | 41 | 51 | 61 | 71 | 81 | 91 | 101 | (number & {})
  : Plural extends 'two'
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    2 | 22 | 32 | 42 | 52 | 62 | 72 | 82 | 92 | 102 | (number & {})
  : number;

type AddCount<T, Key extends string, Locale extends BaseLocale> = T extends []
  ? [
      {
        /**
         * The `count` depends on the plural tags defined in your locale,
         * and the current locale rules.
         *
         * - `zero` allows 0
         * - `one` autocompletes 1, 21, 31, 41... but allows any number
         * - `two` autocompletes 2, 22, 32, 42... but allows any number
         * - `few`, `many` and `other` allow any number
         *
         * @see https://www.unicode.org/cldr/charts/43/supplemental/language_plural_rules.html
         */
        count: GetCountUnion<Key, Locale>;
      },
    ]
  : T extends [infer R]
  ? [
      {
        /**
         * The `count` depends on the plural tags defined in your locale,
         * and the current locale rules.
         *
         * - `zero` allows 0
         * - `one` autocompletes 1, 21, 31, 41... but allows any number
         * - `two` autocompletes 2, 22, 32, 42... but allows any number
         * - `few`, `many` and `other` allow any number
         *
         * @see https://www.unicode.org/cldr/charts/43/supplemental/language_plural_rules.html
         */
        count: GetCountUnion<Key, Locale>;
      } & R,
    ]
  : never;

export type CreateParams<
  T,
  Locale extends BaseLocale,
  Scope extends Scopes<Locale> | undefined,
  Key extends LocaleKeys<Locale, Scope>,
  Value extends LocaleValue = ScopedValue<Locale, Scope, Key>,
> = IsPlural<Key, Locale> extends true
  ? AddCount<GetParams<Value>['length'] extends 0 ? [] : [T], Key, Locale>
  : GetParams<Value>['length'] extends 0
  ? []
  : [T];
