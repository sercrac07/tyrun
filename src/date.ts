import { BaseSchema } from './base'
import type { ParseResult, TyrunDate } from './types'

export class DateSchema extends BaseSchema<Date> implements TyrunDate {
  public readonly type = 'date'
  protected __coerce = false

  constructor(private message: string = 'Value must be a date') {
    super()
  }

  public override parse(value: unknown): ParseResult<Date> {
    if (this.__coerce) value = new Date(value as any)

    if (!(value instanceof Date)) return { success: false, errors: [this.message] }

    const errors = this.runValidators(value)
    if (errors.length) return { success: false, errors }

    const v = this.runTransformers(value)
    return { success: true, data: v }
  }
  public coerce(): this {
    this.__coerce = true
    return this
  }

  public min(date: Date, message: string = `Value must be greater than ${date.toDateString()}`) {
    this.validators.push(value => (value >= date ? null : message))
    return this
  }
  public max(date: Date, message: string = `Value must be less than ${date.toDateString()}`) {
    this.validators.push(value => (value <= date ? null : message))
    return this
  }
}
