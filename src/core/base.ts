import type { ParseResult, TyrunBase, TyrunMeta, TyrunMutation, TyrunNullable, TyrunNullish, TyrunOptional } from '../types'
import { MutationSchema } from '../utilities/mutation'
import { NullableSchema } from '../utilities/nullable'
import { NullishSchema } from '../utilities/nullish'
import { OptionalSchema } from '../utilities/optional'

export abstract class BaseSchema<T> implements TyrunBase<T> {
  public readonly meta: TyrunMeta = { name: null, description: null }
  protected validators: ((value: T) => null | string)[] = []
  protected transformers: ((value: T) => T)[] = []

  protected runValidators(value: T) {
    const errors: string[] = []
    this.validators.forEach(val => {
      const res = val(value)
      if (res) errors.push(res)
    })
    return errors
  }
  protected runTransformers(value: T) {
    return this.transformers.reduce((acc, transformer) => transformer(acc), value)
  }

  constructor() {}

  public abstract parse(_value: unknown): ParseResult<T>

  public refine(predicate: (value: T) => boolean, message: string = 'Refinement failed'): this {
    this.validators.push(v => (predicate(v) ? null : message))
    return this
  }
  public transform(transformer: (value: T) => T): this {
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
  public mutate<O>(mutation: (value: T) => O): TyrunMutation<this, O> {
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
