export type LocaleValue = string | number;
export type Locale = Record<string, LocaleValue>;

export type LocaleKeys<LocaleType extends Locale> = keyof LocaleType;
export type Locales = Record<string, () => Promise<any>>;

export type LocaleContext<LocaleType extends Locale> = {
  localeContent: LocaleType;
};

export type Params<Value extends LocaleValue> = Value extends ''
  ? []
  : // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Value extends `${infer Head}{${infer Param}}${infer Tail}`
  ? [Param, ...Params<Tail>]
  : [];

export type ParamsObject<Value extends LocaleValue> = Record<Params<Value>[number], LocaleValue>;

export type ParamsOption<
  Value extends string,
  ParamArray extends string[] = Params<Value>,
> = ParamArray['length'] extends 0 ? never : ParamsObject<Value>;
