import { BaseSchema } from './base'
import type { ParseResult, TyrunNumber } from './types'

export class NumberSchema extends BaseSchema<number> implements TyrunNumber {
  constructor(private message: string = 'Value must be a number') {
    super()
  }

  public override parse(value: unknown): ParseResult<number> {
    if (typeof value !== 'number') return { success: false, errors: [this.message] }

    const errors = this.runValidators(value)
    if (errors.length) return { success: false, errors }
    return { success: true, data: value }
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
