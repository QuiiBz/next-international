export type LocaleValue = string | number | boolean | null | undefined | Date;
export type BaseLocale = Record<string, LocaleValue>;
export type ImportedLocales = Record<string, () => Promise<any>>;
export type ExplicitLocales = Record<string, BaseLocale>;

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
    ? Locale[`${Key}#${PluralSuffix}` & keyof Locale]
    : Locale[Key]
  : IsPlural<Key, Locale> extends true
  ? Locale[`${Scope}.${Key}#${PluralSuffix}` & keyof Locale]
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
  ? Awaited<ReturnType<Locales[SomeKey<Locales>]>>['default']
  : Locales[SomeKey<Locales>];

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
type IsPlural<Key extends string, Locale extends BaseLocale> = `${Key}#${PluralSuffix}` & keyof Locale extends never
  ? false
  : true;

type AddCount<T> = T extends [] ? [{ count: number }] : T extends [infer R] ? [{ count: number } & R] : never;

export type CreateParams<
  T,
  Locale extends BaseLocale,
  Scope extends Scopes<Locale> | undefined,
  Key extends LocaleKeys<Locale, Scope>,
  Value extends LocaleValue = ScopedValue<Locale, Scope, Key>,
> = IsPlural<Key, Locale> extends true
  ? AddCount<GetParams<Value>['length'] extends 0 ? [] : [T]>
  : GetParams<Value>['length'] extends 0
  ? []
  : [T];
