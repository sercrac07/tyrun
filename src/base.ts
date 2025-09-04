import { NullableSchema } from './nullable'
import { NullishSchema } from './nullish'
import { OptionalSchema } from './optional'
import type { ParseResult, TyrunBase, TyrunMeta, TyrunNullable, TyrunNullish, TyrunOptional } from './types'

export class BaseSchema<T> implements TyrunBase<T> {
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

  public parse(_value: unknown): ParseResult<T> {
    throw new Error('Method must be implemented in sub classes.')
  }

  public optional(): TyrunOptional<this> {
    const schema = new OptionalSchema(this)
    schema.meta = this.meta
    return schema
  }
  public nullable(): TyrunNullable<this> {
    const schema = new NullableSchema(this)
    schema.meta = this.meta
    return schema
  }
  public nullish(): TyrunNullish<this> {
    const schema = new NullishSchema(this)
    schema.meta = this.meta
    return schema
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
