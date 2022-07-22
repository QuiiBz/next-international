export interface BaseLocale {
  hello: string;
}

export type LocaleValue = string | number;
export type Locale = Record<string, LocaleValue>;

export type LocaleKeys<
  LocaleType extends BaseLocale,
  Scope extends Scopes<LocaleType> | undefined,
  Key extends string = Extract<keyof LocaleType, string>,
> = Scope extends undefined ? Key : Key extends `${Scope}.${infer Test}` ? Test : never;

export type Locales = Record<string, () => Promise<any>>;

export type LocaleContext<LocaleType extends BaseLocale> = {
  localeContent: LocaleType;
};

export type Params<Value extends LocaleValue> = Value extends ''
  ? []
  : // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Value extends `${infer Head}{${infer Param}}${infer Tail}`
  ? [Param, ...Params<Tail>]
  : [];

export type ParamsObject<Value extends LocaleValue> = Record<Params<Value>[number], LocaleValue>;

export type ExtractScopes<
  Value extends string,
  Prev extends string | undefined = undefined,
> = Value extends `${infer Head}.${infer Tail}`
  ? [
      Prev extends string ? `${Prev}.${Head}` : Head,
      ...ExtractScopes<Tail, Prev extends string ? `${Prev}.${Head}` : Head>,
    ]
  : [];

export type Scopes<LocaleType extends BaseLocale> = ExtractScopes<Extract<keyof LocaleType, string>>[number];

export type ScopedValue<
  LocaleType extends BaseLocale,
  Scope extends Scopes<LocaleType> | undefined,
  Key extends LocaleKeys<LocaleType, Scope>,
  // @ts-ignore
> = Scope extends undefined ? LocaleType[Key] : LocaleType[`${Scope}.${Key}`];
