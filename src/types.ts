import { IssueCode as IssueCodeValues } from './constants'
import { EmailConfig } from './primitives/string'

export type IssueCode = (typeof IssueCodeValues)[keyof typeof IssueCodeValues]

export type Issue = {
  message: string
  path: string[]
  code: IssueCode
}

type ParseError = { data?: never; errors: Issue[] }
type ParseSuccess<T> = { data: T; errors?: never }
export type ParseResult<T> = ParseError | ParseSuccess<T>

export interface T {
  /**
   * Validates that the input is a string.
   *
   * [API Reference](https://github.com/sercrac07/tyrun#string-validator)
   */
  string: (message?: string) => TyrunString
  /**
   * Validates that the input is a number.
   *
   * [API Reference](https://github.com/sercrac07/tyrun#number-validator)
   */
  number: (message?: string) => TyrunNumber
  /**
   * Validates that the input is a boolean.
   *
   * [API Reference](https://github.com/sercrac07/tyrun#boolean-validator)
   */
  boolean: (message?: string) => TyrunBoolean
  /**
   * Validates that the input is a date.
   *
   * [API Reference](https://github.com/sercrac07/tyrun#date-validator)
   */
  date: (message?: string) => TyrunDate
  /**
   * Validates that the input is a literal value.
   *
   * [API Reference](https://github.com/sercrac07/tyrun#literal-validator)
   */
  literal: <S extends string | number | boolean>(schema: S, message?: string) => TyrunLiteral<S>
  /**
   * Validates that the input is an object with the specified shape.
   *
   * [API Reference](https://github.com/sercrac07/tyrun#object-validator)
   */
  object: <S extends { [key: string]: Tyrun<any> }>(schema: S, message?: string) => TyrunObject<S>
  /**
   * Validates that the input is an array of the defined schema.
   *
   * [API Reference](https://github.com/sercrac07/tyrun#array-validator)
   */
  array: <S extends Tyrun<any>>(schema: S, message?: string) => TyrunArray<S>
  /**
   * Validates that the input is one of the defined enum values.
   *
   * [API Reference](https://github.com/sercrac07/tyrun#enum-validator)
   */
  enum: <S extends string | number>(schema: S[], message?: string) => TyrunEnum<S>
  /**
   * Validates that the input is an object of the defined schema.
   *
   * [API Reference](https://github.com/sercrac07/tyrun#record-validator)
   */
  record: <S extends Tyrun<any>>(schema: S, message?: string) => TyrunRecord<S>
  /**
   * Validates that the input is a tuple of the defined schemas.
   *
   * [API Reference](https://github.com/sercrac07/tyrun#tuple-validator)
   */
  tuple: <S extends Tyrun<any>[]>(schemas: [...S], message?: string) => TyrunTuple<S>
  /**
   * Validates that the input is one of the defined schemas.
   *
   * [API Reference](https://github.com/sercrac07/tyrun#union-validator)
   */
  union: <S extends Tyrun<any>>(schemas: S[]) => TyrunUnion<S>
  /**
   * Validates that the input is an intersection of the defined schemas.
   *
   * [API Reference](https://github.com/sercrac07/tyrun#intersection-validator)
   */
  intersection: <S extends TyrunObject<any> | TyrunRecord<any>>(schemas: S[]) => TyrunIntersection<S>
  /**
   * Validates that the input is an any value.
   *
   * [API Reference](https://github.com/sercrac07/tyrun#any-validator)
   */
  any: () => TyrunAny
  /**
   * Validates a lazy schema.
   *
   * [API Reference](https://github.com/sercrac07/tyrun#lazy-validator)
   */
  lazy: <S extends Tyrun<any>>(schema: () => S) => TyrunLazy<S>
  /**
   * Validates that the input is a file.
   *
   * [API Reference](https://github.com/sercrac07/tyrun#file-validator)
   */
  file: (message?: string) => TyrunFile
}

export interface Tyrun<T> {
  meta: TyrunMeta
  __default: T | undefined
  /**
   * Validates the input value against the schema.
   *
   * All asyncronous validators and transformers will be ignored, and the schema will be validated synchronously.
   */
  parse(value: unknown): ParseResult<T>
  /**
   * Validates the input value against the schema asynchronously.
   */
  parseAsync(value: unknown): Promise<ParseResult<T>>
  /**
   * Sets the default value for the schema.
   */
  default(value: T): this
}

export interface TyrunMeta {
  name: string | null
  description: string | null
}

export interface TyrunBase<T> extends Tyrun<T> {
  /**
   * Allows the input value to be `undefined`.
   */
  optional(): TyrunOptional<this>
  /**
   * Allows the input value to be `null`.
   */
  nullable(): TyrunNullable<this>
  /**
   * Allows the input value to be `null` and `undefined`.
   */
  nullish(): TyrunNullish<this>
  /**
   * Sets the name of the schema.
   */
  name(name: string): this
  /**
   * Sets the description of the schema.
   */
  description(description: string): this
  /**
   * Add custom validation logic to the schema.
   */
  refine(predicate: (value: T) => MaybePromise<boolean>, message?: string): this
  /**
   * Transforms the input value after validation.
   */
  transform(transformer: (value: T) => MaybePromise<T>): this
  /**
   * Transforms the input value into a new value after the validation and transformation.
   */
  mutate<O>(mutation: (value: T) => MaybePromise<O>): TyrunMutation<this, O>
  /**
   * Preprocesses the input value before validation.
   */
  preprocess(preprocessor: (value: unknown) => MaybePromise<unknown>): this
}

export interface TyrunString extends TyrunBase<string> {
  readonly type: 'string'
  /**
   * Coerces the input value to a string.
   */
  coerce(): this
  /**
   * Sets the minimum length of the string.
   */
  min(length: number, message?: string): this
  /**
   * Sets the maximum length of the string.
   */
  max(length: number, message?: string): this
  /**
   * Sets a regular expression to match the string.
   */
  regex(regex: RegExp, message?: string): this
  /**
   * Validates that the input is an email address.
   */
  email(message?: string): this
  email(config: EmailConfig): this
}
export interface TyrunNumber extends TyrunBase<number> {
  readonly type: 'number'
  /**
   * Coerces the input value to a number.
   */
  coerce(): this
  /**
   * Sets the minimum value of the number.
   */
  min(amount: number, message?: string): this
  /**
   * Sets the maximum value of the number.
   */
  max(amount: number, message?: string): this
}
export interface TyrunBoolean extends TyrunBase<boolean> {
  readonly type: 'boolean'
  /**
   * Coerces the input value to a boolean.
   */
  coerce(): this
}
export interface TyrunDate extends TyrunBase<Date> {
  readonly type: 'date'
  /**
   * Coerces the input value to a date.
   */
  coerce(): this
  /**
   * Sets the minimum date of the date.
   */
  min(date: Date, message?: string): this
  /**
   * Sets the maximum date of the date.
   */
  max(date: Date, message?: string): this
}
export interface TyrunLiteral<S extends string | number | boolean> extends TyrunBase<S> {
  readonly type: 'literal'
  /**
   * The literal value.
   */
  readonly value: S
}
export interface TyrunObject<S extends { [key: string]: Tyrun<any> }> extends TyrunBase<TypeFromShape<S>> {
  readonly type: 'object'
  /**
   * The inner schema of the object.
   */
  readonly inner: S
}
export interface TyrunArray<S extends Tyrun<any>> extends TyrunBase<Output<S>[]> {
  readonly type: 'array'
  /**
   * The inner schema of the array.
   */
  readonly inner: S
  /**
   * Sets the minimum length of the array.
   */
  min(length: number, message?: string): this
  /**
   * Sets the maximum length of the array.
   */
  max(length: number, message?: string): this
}
export interface TyrunEnum<S extends string | number> extends TyrunBase<S> {
  readonly type: 'enum'
  /**
   * The enum values.
   */
  readonly values: S[]
}
export interface TyrunRecord<S extends Tyrun<any>> extends TyrunBase<{ [key: string]: Output<S> }> {
  readonly type: 'record'
  /**
   * The inner schema of the record.
   */
  readonly inner: S
}
export interface TyrunTuple<S extends Tyrun<any>[]> extends TyrunBase<{ [key in keyof S]: Output<S[key]> }> {
  readonly type: 'tuple'
  /**
   * The inner schema of the tuple.
   */
  readonly inner: S
}
export interface TyrunUnion<S extends Tyrun<any>> extends TyrunBase<Output<S>> {
  readonly type: 'union'
}
export interface TyrunIntersection<S extends TyrunObject<any> | TyrunRecord<any>> extends TyrunBase<UnionToIntersection<Output<S>>> {
  readonly type: 'intersection'
}
export interface TyrunAny extends TyrunBase<any> {
  readonly type: 'any'
}
export interface TyrunLazy<S extends Tyrun<any>> extends TyrunBase<Output<S>> {
  readonly type: 'lazy'
  /**
   * The inner schema of the lazy.
   */
  readonly inner: S
}
export interface TyrunFile extends TyrunBase<File> {
  readonly type: 'file'
  /**
   * Sets the minimum size of the file (in bytes).
   */
  min(size: number, message?: string): this
  /**
   * Sets the maximum size of the file (in bytes).
   */
  max(size: number, message?: string): this
  /**
   * Sets the accepted file types.
   */
  types(types: string[], message?: string): this
}
export interface TyrunOptional<S extends Tyrun<any>> extends Tyrun<Output<S> | undefined> {
  readonly type: 'optional'
  readonly __isOptional: true
  /**
   * The inner schema of the optional.
   */
  readonly inner: S
  /**
   * Transforms the input value into a new value after the validation and transformation.
   */
  mutate<O>(mutation: (value: Output<S> | undefined) => MaybePromise<O>): TyrunMutation<this, O>
}
export interface TyrunNullable<S extends Tyrun<any>> extends Tyrun<Output<S> | null> {
  readonly type: 'nullable'
  /**
   * The inner schema of the nullable.
   */
  readonly inner: S
  /**
   * Transforms the input value into a new value after the validation and transformation.
   */
  mutate<O>(mutation: (value: Output<S> | null) => MaybePromise<O>): TyrunMutation<this, O>
}
export interface TyrunNullish<S extends Tyrun<any>> extends Tyrun<Output<S> | null | undefined> {
  readonly type: 'nullish'
  readonly __isOptional: true
  /**
   * The inner schema of the nullish.
   */
  readonly inner: S
  /**
   * Transforms the input value into a new value after the validation and transformation.
   */
  mutate<O>(mutation: (value: Output<S> | null | undefined) => MaybePromise<O>): TyrunMutation<this, O>
}
export interface TyrunMutation<I extends TyrunBase<any> | TyrunOptional<any> | TyrunNullable<any> | TyrunNullish<any>, O> extends Tyrun<O> {
  __default: Output<I> | undefined
  readonly type: 'mutation'
  /**
   * The inner schema of the mutation.
   */
  readonly inner: I
  /**
   * Sets the default value of the mutation.
   */
  default(value: Output<I>): this
}

type Flatten<T> = T extends Record<any, any> ? { [K in keyof T]: T[K] } : T
export type MaybePromise<T> = T | Promise<T>
export type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never

/**
 * Infers the output type of a schema.
 */
export type Output<S extends Tyrun<any>> = S extends TyrunMutation<any, infer O> ? O : S extends Tyrun<infer T> ? T : never
/**
 * Infers the input type of a schema.
 */
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
  : S extends TyrunIntersection<infer S>
  ? Input<S>
  : S extends TyrunLazy<infer S>
  ? Input<S>
  : S extends TyrunTuple<infer S>
  ? { [key in keyof S]: Input<S[key]> }
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
