type ParseError = { success: false; errors: string[] }
type ParseSuccess<T> = { success: true; data: T }
export type ParseResult<T> = ParseError | ParseSuccess<T>

export interface T {
  string: (message?: string) => TyrunString
  number: (message?: string) => TyrunNumber
  boolean: (message?: string) => TyrunBoolean
  object: <S extends { [key: string]: Tyrun<any> }>(schema: S, message?: string) => TyrunObject<S>
  array: <S extends Tyrun<any>>(schema: S, message?: string) => TyrunArray<S>
  enum: <S extends string | number>(schema: S[], message?: string) => TyrunEnum<S>
  record: <S extends Tyrun<any>>(schema: S, message?: string) => TyrunRecord<S>
  union: <S extends Tyrun<any>>(schemas: S[]) => TyrunUnion<S>
}

export interface Tyrun<T> {
  readonly meta: TyrunMeta
  parse(value: unknown): ParseResult<T>
}

export interface TyrunMeta {
  name: string | null
  description: string | null
}

export interface TyrunBase<T> extends Tyrun<T> {
  optional(): TyrunOptional<this>
  nullable(): TyrunNullable<this>
  nullish(): TyrunNullish<this>
  name(name: string): this
  description(description: string): this
  refine(predicate: (value: T) => boolean, message?: string): this
  transform(transformer: (value: T) => T): this
  mutate<O>(mutation: (value: T) => O): TyrunMutation<this, O>
}

export interface TyrunString extends TyrunBase<string> {
  readonly type: 'string'
  coerce(): this
  min(length: number, message?: string): this
  max(length: number, message?: string): this
  regex(regex: RegExp, message?: string): this
}
export interface TyrunNumber extends TyrunBase<number> {
  readonly type: 'number'
  coerce(): this
  min(amount: number, message?: string): this
  max(amount: number, message?: string): this
}
export interface TyrunBoolean extends TyrunBase<boolean> {
  readonly type: 'boolean'
  coerce(): this
}
export interface TyrunObject<S extends { [key: string]: Tyrun<any> }> extends TyrunBase<TypeFromShape<S>> {
  readonly type: 'object'
  readonly inner: S
}
export interface TyrunArray<S extends Tyrun<any>> extends TyrunBase<Output<S>[]> {
  readonly type: 'array'
  readonly inner: S
  min(length: number, message?: string): this
  max(length: number, message?: string): this
}
export interface TyrunEnum<S extends string | number> extends TyrunBase<S> {
  readonly type: 'enum'
  readonly values: S[]
}
export interface TyrunRecord<S extends Tyrun<any>> extends TyrunBase<{ [key: string]: Output<S> }> {
  readonly type: 'record'
  readonly inner: S
}
export interface TyrunUnion<S extends Tyrun<any>> extends TyrunBase<Output<S>> {
  readonly type: 'union'
}
export interface TyrunOptional<S extends Tyrun<any>> extends Tyrun<Output<S> | undefined> {
  readonly type: 'optional'
  readonly __isOptional: true
}
export interface TyrunNullable<S extends Tyrun<any>> extends Tyrun<Output<S> | null> {
  readonly type: 'nullable'
}
export interface TyrunNullish<S extends Tyrun<any>> extends Tyrun<Output<S> | null | undefined> {
  readonly type: 'nullish'
  readonly __isOptional: true
}
export interface TyrunMutation<I extends TyrunBase<any>, O> extends Tyrun<O> {
  readonly type: 'mutation'
  readonly inner: I
}

type Flatten<T> = T extends Record<any, any> ? { [K in keyof T]: Flatten<T[K]> } : T

export type Output<S extends Tyrun<any>> = S extends Tyrun<infer T> ? T : never
export type Input<S extends Tyrun<any>> = S extends TyrunObject<infer Shape>
  ? TypeFromShapeInput<Shape>
  : S extends TyrunArray<infer T>
  ? Input<T>[]
  : S extends TyrunRecord<infer T>
  ? { [key: string]: Input<T> }
  : S extends TyrunMutation<infer I, any>
  ? Input<I>
  : S extends TyrunUnion<infer S>
  ? Input<S>
  : S extends Tyrun<infer T>
  ? T
  : never

export type TypeFromShape<S extends { [key: string]: Tyrun<any> }> = Flatten<
  {
    [K in keyof S as S[K] extends TyrunOptional<any> | TyrunNullish<any> ? never : K]-?: Output<S[K]>
  } & {
    [K in keyof S as S[K] extends TyrunOptional<any> | TyrunNullish<any> ? K : never]+?: Exclude<Output<S[K]>, undefined>
  }
>
export type TypeFromShapeInput<S extends { [key: string]: Tyrun<any> }> = Flatten<
  {
    [K in keyof S as S[K] extends TyrunOptional<any> | TyrunNullish<any> ? never : K]-?: Input<S[K]>
  } & {
    [K in keyof S as S[K] extends TyrunOptional<any> | TyrunNullish<any> ? K : never]+?: Exclude<Input<S[K]>, undefined>
  }
>
