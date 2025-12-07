import type { Default, Preprocessor, Processor, Result, Validator } from '../types'

export type TyrunBaseConfig<E extends Record<string, any>, I, O> = {
  default: Default<O> | undefined
  fallback: Default<O> | undefined
  validators: Validator<O>[]
  processors: Processor<O>[]
  preprocessors: Preprocessor<any, I>[]
} & E

export interface TyrunBaseType<I, O> {
  /**
   * Unique identifier for the schema used internally for discrimination and debugging.
   */
  readonly type: string
  /**
   * Parses the input and returns the output type.
   * Throws `TyrunError` if any validator fails.
   *
   * Note: Using async validators/processors will throw `TyrunRuntimeError`.
   * Use `parseAsync` when async behavior is required.
   */
  parse(input: unknown): O
  /**
   * Asynchronously parses the input and returns the output type.
   * Throws `TyrunError` if any validator fails.
   */
  parseAsync(input: unknown): Promise<O>
  /**
   * Safely parses the input and returns a `Result` instead of throwing.
   * Wraps `parse` in a try-catch block.
   *
   * Note: Using async validators/processors will throw `TyrunRuntimeError`.
   * Use `safeParseAsync` when async behavior is required.
   */
  safeParse(input: unknown): Result<O>
  /**
   * Asynchronously and safely parses the input and returns a `Result` instead of throwing.
   * Wraps `parseAsync` in a try-catch block.
   */
  safeParseAsync(input: unknown): Promise<Result<O>>
  /**
   * Appends a validator function to the schema.
   * Validator receives the output-typed value and returns `undefined` when valid or an error string/partial `Issue` when invalid.
   *
   * @example
   *
   * ```ts
   * const schema = t.string()
   *   .validate(v => v.length > 0 ? undefined : 'String is empty')
   *   .validate(v => v.length <= 10 ? undefined : { code: 'string.tooLong', error: 'String must be at most 10 characters long', path: [] })
   * ```
   */
  validate(validator: Validator<O>): this
  /**
   * Appends a processor function to the schema.
   * Processor receives the output-typed value and returns the transformed value of the same type.
   *
   * @example
   *
   * ```ts
   * const schema = t.string().process(v => v.toUpperCase())
   * ```
   */
  process(processor: Processor<O>): this
  /**
   * Appends a preprocessor function to the schema.
   * Preprocessor receives the raw input value and returns the input-typed value.
   *
   * By default, the given value will be typed as `unknown` but you can override it by specifying the input type.
   *
   * @example
   *
   * ```ts
   * const schema = t.string()
   *   .preprocess(value => String(value))
   *   .preprocess<string>(value => value.trim())
   * ```
   */
  preprocess<T = unknown>(preprocessor: Preprocessor<T, I>): this
  /**
   * Configures a default value that will be used when the input is undefined.
   * The default can be supplied either as a static value or as a function that will be invoked lazily (only when needed) to produce the value at runtime.
   *
   * @example
   *
   * ```ts
   * const schema = t.string().default('default value')
   * // or
   * const schema = t.string().default(() => 'default value')
   * ```
   */
  default(value: Default<O>): this
  /**
   * Configures a default value that will be used when the parsing fails.
   * The fallback can be supplied either as a static value or as a function that will be invoked lazily (only when needed) to produce the value at runtime.
   *
   * @example
   *
   * ```ts
   * const schema = t.string().fallback('fallback value')
   * // or
   * const schema = t.string().fallback(() => 'fallback value')
   * ```
   */
  fallback(value: Default<O>): this
  /**
   * Deeply clones the schema, including configuration and pipelines (validators, processors, preprocessors, defaults and fallbacks).
   */
  clone(): TyrunBaseType<I, O>
}
