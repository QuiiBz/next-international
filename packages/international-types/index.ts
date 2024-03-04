export type Param = string | number;
export type LocaleType = Record<string, string>;
export type LocalesObject = {
  [locale: string]: () => Promise<{ default: LocaleType }>;
};

type ExtractScopes<
  Value extends string,
  Prev extends string | undefined = undefined,
> = Value extends `${infer Head}.${infer Tail}`
  ? [
      Prev extends string ? `${Prev}.${Head}` : Head,
      ...ExtractScopes<Tail, Prev extends string ? `${Prev}.${Head}` : Head>,
    ]
  : [];

export type Scopes<
  Locale extends LocaleType,
  TheKeys extends string = Extract<keyof Locale, string>,
> = ExtractScopes<TheKeys>[number];

export type Keys<
  Locale extends LocaleType,
  Scope extends Scopes<Locale> | undefined,
  TheKeys extends string = Extract<keyof Locale, string>,
> = Scope extends undefined
  ? RemovePlural<TheKeys>
  : TheKeys extends `${Scope}.${infer Tail}`
  ? RemovePlural<Tail>
  : never;

export type ExtractParams<Value extends string> = Value extends ''
  ? []
  : Value extends `${string}{${infer Param}}${infer Tail}`
  ? [Param, ...ExtractParams<Tail>]
  : [];

export type PluralSuffix = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';
export type RemovePlural<Key extends string> = Key extends `${infer Head}#${PluralSuffix}` ? Head : Key;

export type IsPlural<
  Locale extends LocaleType,
  Scope extends Scopes<Locale> | undefined,
  Key extends string,
> = Scope extends undefined
  ? `${Key}#${PluralSuffix}` & keyof Locale extends never
    ? false
    : true
  : `${Scope}.${Key}#${PluralSuffix}` & keyof Locale extends never
  ? false
  : true;

export type GetPluralCount = number;

export type Params<
  Locale extends LocaleType,
  Scope extends Scopes<Locale> | undefined,
  Key extends Keys<Locale, Scope>,
  Plural extends boolean = IsPlural<Locale, Scope, Key>,
  Value extends string = Scope extends undefined
    ? Plural extends true
      ? Locale[`${Key}#${PluralSuffix}`]
      : Locale[Key]
    : Plural extends true
    ? Locale[`${Scope}.${Key}#${PluralSuffix}`]
    : Locale[`${Scope}.${Key}`],
  TheParams extends string[] = ExtractParams<Value>,
> = Plural extends true
  ? TheParams['length'] extends 0
    ? [{ count: GetPluralCount }]
    : [
        { count: GetPluralCount } & {
          [K in TheParams[number]]: Param;
        },
      ]
  : TheParams['length'] extends 0
  ? []
  : [
      {
        [K in TheParams[number]]: Param;
      },
    ];

type UnionToIntersection<U> = (U extends never ? never : (arg: U) => never) extends (arg: infer I) => void ? I : never;

type UnionToTuple<T> = UnionToIntersection<T extends never ? never : (t: T) => T> extends (_: never) => infer W
  ? [...UnionToTuple<Exclude<T, W>>, W]
  : [];

type SomeKey<T extends Record<string, any>> = UnionToTuple<keyof T>[0] extends string
  ? UnionToTuple<keyof T>[0]
  : never;

export type GetLocale<Locales extends LocalesObject> = Awaited<ReturnType<Locales[SomeKey<Locales>]>>['default'];
