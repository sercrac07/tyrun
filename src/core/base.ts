import { IssueCode } from '../constants'
import type { Issue, IssueCode as IssueCodeType, MaybePromise, ParseResult, TyrunBase, TyrunMeta, TyrunMutation, TyrunNullable, TyrunNullish, TyrunOptional } from '../types'
import { MutationSchema } from '../utilities/mutation'
import { NullableSchema } from '../utilities/nullable'
import { NullishSchema } from '../utilities/nullish'
import { OptionalSchema } from '../utilities/optional'

export abstract class BaseSchema<T> implements TyrunBase<T> {
  public __default: T | undefined = undefined
  public meta: TyrunMeta = { name: null, description: null }
  protected validators: [(value: T) => MaybePromise<boolean>, string, IssueCodeType | undefined][] = []
  protected transformers: ((value: T) => MaybePromise<T>)[] = []
  protected preprocessors: ((value: unknown) => MaybePromise<unknown>)[] = []

  protected runValidators(value: T): Issue[] {
    const errors: Issue[] = []
    for (const [val, mes, code] of this.validators) {
      const res = val(value)
      if (res instanceof Promise) continue
      if (!res) errors.push({ message: mes, path: [], code: code ?? IssueCode.RefinementFailed })
    }
    return errors
  }
  protected async runValidatorsAsync(value: T): Promise<Issue[]> {
    const errors: Issue[] = []
    for (const [val, mes, code] of this.validators) {
      const res = await val(value)
      if (!res) errors.push({ message: mes, path: [], code: code ?? IssueCode.RefinementFailed })
    }
    return errors
  }
  protected runTransformers(value: T): T {
    let v = value
    for (const transformer of this.transformers) {
      const res = transformer(v)
      if (res instanceof Promise) continue
      v = res
    }
    return v
  }
  protected async runTransformersAsync(value: T): Promise<T> {
    let v = value
    for (const transformer of this.transformers) {
      v = await transformer(v)
    }
    return v
  }
  protected runPreprocessors(value: unknown): unknown {
    let v = value
    for (const preprocessor of this.preprocessors) {
      const res = preprocessor(v)
      if (res instanceof Promise) continue
      v = res
    }
    return v
  }
  protected async runPreprocessorsAsync(value: unknown): Promise<unknown> {
    let v = value
    for (const preprocessor of this.preprocessors) {
      v = await preprocessor(v)
    }
    return v
  }

  constructor() {}

  public abstract parse(value: unknown): ParseResult<T>
  public abstract parseAsync(value: unknown): Promise<ParseResult<T>>

  public refine(predicate: (value: T) => MaybePromise<boolean>, message: string = 'Refinement failed'): this {
    this.validators.push([predicate, message, undefined])
    return this
  }
  public transform(transformer: (value: T) => MaybePromise<T>): this {
    this.transformers.push(transformer)
    return this
  }
  public preprocess(preprocessor: (value: unknown) => MaybePromise<unknown>): this {
    this.preprocessors.push(preprocessor)
    return this
  }

  public optional(): TyrunOptional<this> {
    return new OptionalSchema(this)
  }
  public nullable(): TyrunNullable<this> {
    return new NullableSchema(this)
  }
  public nullish(): TyrunNullish<this> {
    return new NullishSchema(this)
  }
  public mutate<O>(mutation: (value: T) => MaybePromise<O>): TyrunMutation<this, O> {
    return new MutationSchema(this, mutation)
  }

  public default(value: T): this {
    this.__default = value
    return this
  }

  public name(name: string) {
    this.meta.name = name
    return this
  }
  public description(description: string) {
    this.meta.description = description
    return this
  }
}
