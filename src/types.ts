import type { TyrunBaseType } from './types'
import { TyrunNullishType, TyrunOptionalType } from './types'

export * from './core/types'
export * from './primitives/types'
export * from './special/types'
export * from './structural/types'
export * from './utility/types'

/**
 * Infers the input type of the given schema.
 */
export type Input<T extends TyrunBaseType<any, any>> = T extends TyrunBaseType<infer I, any> ? I : never
/**
 * Infers the output type of the given schema.
 */
export type Output<T extends TyrunBaseType<any, any>> = T extends TyrunBaseType<any, infer O> ? O : never

/**
 * Builds an object input shape from a schema map, marking optional/nullish fields as optional.
 */
export type InputShape<T extends Record<string, TyrunBaseType<any, any>>> = Prettify<
  {
    [K in keyof T as T[K] extends TyrunOptionalType<any> | TyrunNullishType<any> ? never : K]-?: Input<T[K]>
  } & {
    [K in keyof T as T[K] extends TyrunOptionalType<any> | TyrunNullishType<any> ? K : never]+?: Input<T[K]>
  }
>
/**
 * Builds an object output shape from a schema map, marking optional/nullish fields as optional.
 */
export type OutputShape<T extends Record<string, TyrunBaseType<any, any>>> = Prettify<
  {
    [K in keyof T as T[K] extends TyrunOptionalType<any> | TyrunNullishType<any> ? never : K]-?: Output<T[K]>
  } & {
    [K in keyof T as T[K] extends TyrunOptionalType<any> | TyrunNullishType<any> ? K : never]+?: Output<T[K]>
  }
>

/**
 * Recursively composes input types of schemas into their intersection.
 */
export type InputIntersection<T extends TyrunBaseType<any, any>[]> = T extends [infer Head extends TyrunBaseType<any, any>, ...infer Tail extends TyrunBaseType<any, any>[]] ? Prettify<Input<Head> & InputIntersection<Tail>> : unknown
/**
 * Recursively composes output types of schemas into their intersection.
 */
export type OutputIntersection<T extends TyrunBaseType<any, any>[]> = T extends [infer Head extends TyrunBaseType<any, any>, ...infer Tail extends TyrunBaseType<any, any>[]] ? Prettify<Output<Head> & OutputIntersection<Tail>> : unknown

/**
 * A single validation issue reported by a schema.
 */
export type Issue = {
  /**
   * Machine-readable error code.
   */
  code: string
  /**
   * Human-readable error message.
   */
  error: string
  /**
   * Path segments to the offending value.
   */
  path: string[]
}

/**
 * Result of a safe parse execution.
 */
export type Result<O> = Success<O> | Fail
/**
 * Successful parse result holding the parsed data.
 */
export type Success<O> = { success: true; data: O }
/**
 * Failed parse result holding a list of issues.
 */
export type Fail = { success: false; issues: Issue[] }

/**
 * Partial issue configuration with extensible fields.
 */
export type ErrorConfig<T extends Record<string, any> = {}> = Partial<Issue> & T

/**
 * Validator function that checks an output-typed value.
 * Returns `undefined`/`null` when valid, or a string/partial `Issue` when invalid.
 */
export type Validator<O> = (value: O) => MaybePromise<string | Partial<Issue> | undefined | null>
/**
 * Processor function that transforms an output-typed value and returns the new value with the same type.
 */
export type Processor<O> = (value: O) => MaybePromise<O>
/**
 * Preprocessor function that converts a raw value into the schema's input type.
 */
export type Preprocessor<T, I> = (value: T) => MaybePromise<I>
/**
 * Default value or lazy factory used by `.default()`/`.fallback()`.
 */
export type Default<O> = O | (() => MaybePromise<O>)
/**
 * Function that maps one type to another, used by `mutate` schema.
 */
export type Mutator<From, To> = (value: From) => MaybePromise<To>

/**
 * Utility type representing a value or a promise of a value.
 */
export type MaybePromise<T> = T | Promise<T>
/**
 * Flattens intersections and preserves property inference for tooling ergonomics.
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {}
