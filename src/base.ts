import { NullableSchema } from './nullable'
import { NullishSchema } from './nullish'
import { OptionalSchema } from './optional'
import type { ParseResult, TyrunBase, TyrunMeta, TyrunNullable, TyrunNullish, TyrunOptional } from './types'

export abstract class BaseSchema<T> implements TyrunBase<T> {
  public readonly meta: TyrunMeta = { name: null, description: null }
  protected validators: ((value: T) => null | string)[] = []

  protected runValidators(value: T) {
    const errors: string[] = []
    this.validators.forEach(val => {
      const res = val(value)
      if (res) errors.push(res)
    })
    return errors
  }

  constructor() {}

  public abstract parse(_value: unknown): ParseResult<T>

  public optional(): TyrunOptional<this> {
    return new OptionalSchema(this)
  }
  public nullable(): TyrunNullable<this> {
    return new NullableSchema(this)
  }
  public nullish(): TyrunNullish<this> {
    return new NullishSchema(this)
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
