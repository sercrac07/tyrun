import { CODES, ERRORS } from '../constants'
import { TyrunRuntimeError } from '../errors'
import type { Default, Issue, MaybePromise, Preprocessor, Processor, Result, Validator } from '../types'
import type { TyrunBaseConfig, TyrunBaseType } from './types'

export abstract class TyrunBaseSchema<I, O, C extends Record<string, any>> implements TyrunBaseType<I, O> {
  public abstract readonly type: string

  protected __config: TyrunBaseConfig<C, I, O>

  constructor(config: TyrunBaseConfig<C, I, O>) {
    this.__config = { ...config, validators: [...config.validators], processors: [...config.processors], preprocessors: [...config.preprocessors] }
  }

  public abstract parse(input: unknown): O
  public abstract parseAsync(input: unknown): Promise<O>
  public abstract safeParse(input: unknown): Result<O>
  public abstract safeParseAsync(input: unknown): Promise<Result<O>>

  public validate(validator: Validator<O>): this {
    this.__config.validators.push(validator)
    return this
  }
  public process(processor: Processor<O>): this {
    this.__config.processors.push(processor)
    return this
  }
  public preprocess<T = unknown>(preprocessor: Preprocessor<T, I>): this {
    this.__config.preprocessors.push(preprocessor)
    return this
  }
  public default(value: Default<O>): this {
    this.__config.default = value
    return this
  }
  public fallback(value: Default<O>): this {
    this.__config.fallback = value
    return this
  }

  protected runValidators(input: O): Issue[] {
    const issues: Issue[] = []
    for (const validator of this.__config.validators) {
      const result = validator(input)
      if (result instanceof Promise) throw new TyrunRuntimeError('Async validator must be parsed with an async parser')
      if (result) issues.push(this.buildIssue(CODES.BASE.VALIDATOR_ERROR, ERRORS.BASE.VALIDATOR_ERROR, [], result))
    }
    return issues
  }
  protected async runValidatorsAsync(input: O): Promise<Issue[]> {
    const issues: Issue[] = []
    for (const validator of this.__config.validators) {
      const result = await validator(input)
      if (result) issues.push(this.buildIssue(CODES.BASE.VALIDATOR_ERROR, ERRORS.BASE.VALIDATOR_ERROR, [], result))
    }
    return issues
  }
  protected runProcessors(input: O): O {
    let processed = input
    for (const processor of this.__config.processors) {
      const value = processor(processed)
      if (value instanceof Promise) throw new TyrunRuntimeError('Async processor must be parsed with an async parser')
      processed = value
    }
    return processed
  }
  protected async runProcessorsAsync(input: O): Promise<O> {
    let processed = input
    for (const processor of this.__config.processors) {
      const value = await processor(processed)
      processed = value
    }
    return processed
  }
  protected runPreprocessors(input: unknown): unknown {
    let preprocessed = input
    for (const preprocessor of this.__config.preprocessors) {
      const value = preprocessor(preprocessed)
      if (value instanceof Promise) throw new TyrunRuntimeError('Async preprocessor must be parsed with an async parser')
      preprocessed = value
    }
    return preprocessed
  }
  protected async runPreprocessorsAsync(input: unknown): Promise<unknown> {
    let preprocessed = input
    for (const preprocessor of this.__config.preprocessors) {
      const value = await preprocessor(preprocessed)
      preprocessed = value
    }
    return preprocessed
  }
  protected runDefault(): O {
    if (typeof this.__config.default! === 'function') {
      const value = (this.__config.default as () => MaybePromise<O>)()
      if (value instanceof Promise) throw new TyrunRuntimeError('Async default value must be parsed with an async parser')
      return value
    }
    return this.__config.default!
  }
  protected async runDefaultAsync(): Promise<O> {
    if (typeof this.__config.default! === 'function') {
      const value = await (this.__config.default as () => MaybePromise<O>)()
      return value
    }
    return this.__config.default!
  }
  protected runFallback(): O {
    if (typeof this.__config.fallback! === 'function') {
      const value = (this.__config.fallback as () => MaybePromise<O>)()
      if (value instanceof Promise) throw new TyrunRuntimeError('Async fallback value must be parsed with an async parser')
      return value
    }
    return this.__config.fallback!
  }
  protected async runFallbackAsync(): Promise<O> {
    if (typeof this.__config.fallback! === 'function') {
      const value = await (this.__config.fallback as () => MaybePromise<O>)()
      return value
    }
    return this.__config.fallback!
  }

  public abstract clone(): TyrunBaseSchema<I, O, C>

  protected buildIssue(code: string, error: string, path: string[], value?: string | Partial<Issue>): Issue {
    if (typeof value === 'string') return { code, error: value, path }
    return { code, error, path, ...(value ?? {}) }
  }
}
