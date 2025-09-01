import { BaseSchema } from './base'
import type { ParseResult, TyrunString } from './types'

export class StringSchema extends BaseSchema<string> implements TyrunString {
  constructor(private message: string = 'Value must be a string') {
    super()
  }

  override parse(value: unknown): ParseResult<string> {
    if (typeof value !== 'string') return { success: false, errors: [this.message] }

    const errors = this.runValidators(value)
    if (errors.length) return { success: false, errors }
    return { success: true, data: value }
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
