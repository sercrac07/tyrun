type ParseError = { success: false; errors: string[] }
type ParseSuccess<T> = { success: true; data: T }
export type ParseResult<T> = ParseError | ParseSuccess<T>

export interface T {
  string: (message?: string) => TyrunString
  number: (message?: string) => TyrunNumber
  boolean: (message?: string) => TyrunBoolean
  object: <S extends { [key: string]: Tyrun<any> }>(schema: S, message?: string) => TyrunObject<S>
  array: <T extends Tyrun<any>>(schema: T, message?: string) => TyrunArray<T>
}

export interface Tyrun<T> {
  parse(value: unknown): ParseResult<T>
}

export interface TyrunBase<T> extends Tyrun<T> {
  optional(): TyrunOptional<this>
  nullable(): TyrunNullable<this>
  nullish(): TyrunNullish<this>
}

export interface TyrunString extends TyrunBase<string> {
  min(length: number, message?: string): this
  max(length: number, message?: string): this
  regex(regex: RegExp, message?: string): this
}
export interface TyrunNumber extends TyrunBase<number> {
  min(amount: number, message?: string): this
  max(amount: number, message?: string): this
}
export interface TyrunBoolean extends TyrunBase<boolean> {}
export interface TyrunObject<S extends { [key: string]: Tyrun<any> }> extends TyrunBase<TypeFromShape<S>> {}
export interface TyrunArray<S extends Tyrun<any>> extends TyrunBase<Infer<S>[]> {
  min(length: number, message?: string): this
  max(length: number, message?: string): this
}
export interface TyrunOptional<S extends Tyrun<any>> extends Tyrun<Infer<S> | undefined> {
  readonly __isOptional: true
}
export interface TyrunNullable<S extends Tyrun<any>> extends Tyrun<Infer<S> | null> {}
export interface TyrunNullish<S extends Tyrun<any>> extends Tyrun<Infer<S> | null | undefined> {
  readonly __isOptional: true
}

type Merge<T extends { [key: string]: any }> = { [K in keyof T]: T[K] }

export type Infer<S extends Tyrun<any>> = S extends TyrunObject<infer Shape> ? TypeFromShape<Shape> : S extends Tyrun<infer T> ? T : never

export type TypeFromShape<S extends { [key: string]: Tyrun<any> }> = Merge<
  {
    [K in keyof S as S[K] extends TyrunOptional<any> ? never : K]-?: Infer<S[K]>
  } & {
    [K in keyof S as S[K] extends TyrunOptional<any> ? K : never]+?: Exclude<Infer<S[K]>, undefined>
  }
>
