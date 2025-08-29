import { NullableSchema } from './nullable'
import { NullishSchema } from './nullish'
import { OptionalSchema } from './optional'
import type { ParseResult, TyrunBase, TyrunNullable, TyrunNullish, TyrunOptional } from './types'

export class BaseSchema<T> implements TyrunBase<T> {
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

  parse(_value: unknown): ParseResult<T> {
    throw new Error('Method must be implemented in sub classes.')
  }

  optional(): TyrunOptional<this> {
    return new OptionalSchema(this)
  }
  nullable(): TyrunNullable<this> {
    return new NullableSchema(this)
  }
  nullish(): TyrunNullish<this> {
    return new NullishSchema(this)
  }
}
