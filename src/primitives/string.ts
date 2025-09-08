import { BaseSchema } from '../core/base'
import type { ParseResult, TyrunString } from '../types'

export class StringSchema extends BaseSchema<string> implements TyrunString {
  public readonly type = 'string'
  protected __coerce = false

  constructor(private message: string = 'Value must be a string') {
    super()
  }

  public override parse(value: unknown): ParseResult<string> {
    if (this.__coerce) value = String(value)

    if (typeof value !== 'string') return { success: false, errors: [this.message] }

    const errors = this.runValidators(value)
    if (errors.length) return { success: false, errors }

    const v = this.runTransformers(value)
    return { success: true, data: v }
  }
  public coerce(): this {
    this.__coerce = true
    return this
  }

  public min(length: number, message: string = `Value must be at least ${length} characters long`): this {
    this.validators.push(v => (v.length >= length ? null : message))
    return this
  }
  public max(length: number, message: string = `Value must be at most ${length} characters long`): this {
    this.validators.push(v => (v.length <= length ? null : message))
    return this
  }

  public regex(regex: RegExp, message: string = `Value does not match regex: ${regex}`): this {
    this.validators.push(v => (regex.test(v) ? null : message))
    return this
  }
}
