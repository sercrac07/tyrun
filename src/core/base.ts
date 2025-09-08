import type { MaybePromise, ParseResult, TyrunBase, TyrunMeta, TyrunMutation, TyrunNullable, TyrunNullish, TyrunOptional } from '../types'
import { MutationSchema } from '../utilities/mutation'
import { NullableSchema } from '../utilities/nullable'
import { NullishSchema } from '../utilities/nullish'
import { OptionalSchema } from '../utilities/optional'

export abstract class BaseSchema<T> implements TyrunBase<T> {
  public readonly meta: TyrunMeta = { name: null, description: null }
  protected validators: [(value: T) => MaybePromise<boolean>, string][] = []
  protected transformers: ((value: T) => MaybePromise<T>)[] = []

  protected runValidators(value: T): string[] {
    const errors: string[] = []
    for (const [val, mes] of this.validators) {
      const res = val(value)
      if (res instanceof Promise) continue
      if (!res) errors.push(mes)
    }
    return errors
  }
  protected async runValidatorsAsync(value: T): Promise<string[]> {
    const errors: string[] = []
    for (const [val, mes] of this.validators) {
      const res = await val(value)
      if (!res) errors.push(mes)
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

  constructor() {}

  public abstract parse(value: unknown): ParseResult<T>
  public abstract parseAsync(value: unknown): Promise<ParseResult<T>>

  public refine(predicate: (value: T) => MaybePromise<boolean>, message: string = 'Refinement failed'): this {
    this.validators.push([predicate, message])
    return this
  }
  public transform(transformer: (value: T) => MaybePromise<T>): this {
    this.transformers.push(transformer)
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

  public name(name: string) {
    this.meta.name = name
    return this
  }
  public description(description: string) {
    this.meta.description = description
    return this
  }
}
