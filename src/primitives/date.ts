import { BaseSchema } from '../core/base'
import type { ParseResult, TyrunDate } from '../types'

export class DateSchema extends BaseSchema<Date> implements TyrunDate {
  public readonly type = 'date'
  protected __coerce = false

  constructor(private message: string = 'Value must be a date') {
    super()
  }

  public override parse(value: unknown): ParseResult<Date> {
    if (this.__coerce) value = new Date(value as any)

    if (!(value instanceof Date)) return { errors: [this.message] }

    const errors = this.runValidators(value)
    if (errors.length) return { errors }

    const v = this.runTransformers(value)
    return { data: v }
  }
  public override async parseAsync(value: unknown): Promise<ParseResult<Date>> {
    if (this.__coerce) value = new Date(value as any)

    if (!(value instanceof Date)) return { errors: [this.message] }

    const errors = await this.runValidatorsAsync(value)
    if (errors.length) return { errors }

    const v = await this.runTransformersAsync(value)
    return { data: v }
  }
  public coerce(): this {
    this.__coerce = true
    return this
  }

  public min(date: Date, message: string = `Value must be greater than ${date.toDateString()}`) {
    this.validators.push([value => value >= date, message])
    return this
  }
  public max(date: Date, message: string = `Value must be lower than ${date.toDateString()}`) {
    this.validators.push([value => value <= date, message])
    return this
  }
}
