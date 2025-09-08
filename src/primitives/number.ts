import { BaseSchema } from '../core/base'
import type { ParseResult, TyrunNumber } from '../types'

export class NumberSchema extends BaseSchema<number> implements TyrunNumber {
  public readonly type = 'number'
  protected __coerce = false

  constructor(private message: string = 'Value must be a number') {
    super()
  }

  public override parse(value: unknown): ParseResult<number> {
    if (this.__coerce) value = Number(value)

    if (typeof value !== 'number') return { errors: [this.message] }

    const errors = this.runValidators(value)
    if (errors.length) return { errors }

    const v = this.runTransformers(value)
    return { data: v }
  }
  public coerce(): this {
    this.__coerce = true
    return this
  }

  public min(amount: number, message: string = `Value must be greater or equal than ${amount}`): this {
    this.validators.push(v => (v >= amount ? null : message))
    return this
  }
  public max(amount: number, message: string = `Value must be lower or equal than ${amount}`): this {
    this.validators.push(v => (v <= amount ? null : message))
    return this
  }
}
