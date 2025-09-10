import { IssueCode } from '../constants'
import { BaseSchema } from '../core/base'
import type { ParseResult, TyrunString } from '../types'

export type EmailConfig = {
  message?: string
  regex?: RegExp
}
const DEFAULT_EMAIL_CONFIG: Required<EmailConfig> = {
  message: 'Value must be a valid email address',
  regex: /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-.]*)[a-z0-9_'+-]@([a-z0-9][a-z0-9-]*\.)+[a-z]{2,}$/i,
}

export class StringSchema extends BaseSchema<string> implements TyrunString {
  public readonly type = 'string'
  protected __coerce = false

  constructor(private message: string = 'Value must be a string') {
    super()
  }

  public override parse(value: unknown): ParseResult<string> {
    if (this.__default !== undefined && value === undefined) value = this.__default
    if (this.__coerce) value = String(value)
    value = this.runPreprocessors(value)

    if (typeof value !== 'string') return { errors: [{ message: this.message, path: [], code: IssueCode.InvalidType }] }

    const errors = this.runValidators(value)
    if (errors.length) return { errors }

    const v = this.runTransformers(value)
    return { data: v }
  }
  public override async parseAsync(value: unknown): Promise<ParseResult<string>> {
    if (this.__default !== undefined && value === undefined) value = this.__default
    if (this.__coerce) value = String(value)
    value = await this.runPreprocessorsAsync(value)

    if (typeof value !== 'string') return { errors: [{ message: this.message, path: [], code: IssueCode.InvalidType }] }

    const errors = await this.runValidatorsAsync(value)
    if (errors.length) return { errors }

    const v = await this.runTransformersAsync(value)
    return { data: v }
  }
  public coerce(): this {
    this.__coerce = true
    return this
  }

  public min(length: number, message: string = `Value must be at least ${length} characters long`): this {
    this.validators.push([v => v.length >= length, message, IssueCode.Min])
    return this
  }
  public max(length: number, message: string = `Value must be at most ${length} characters long`): this {
    this.validators.push([v => v.length <= length, message, IssueCode.Max])
    return this
  }

  public regex(regex: RegExp, message: string = `Value does not match regex: ${regex}`): this {
    this.validators.push([v => regex.test(v), message, IssueCode.RefinementFailed])
    return this
  }
  public email(message: string): this
  public email(config: EmailConfig): this
  public email(config: EmailConfig | string = DEFAULT_EMAIL_CONFIG.message) {
    const options: Required<EmailConfig> = typeof config === 'string' ? { ...DEFAULT_EMAIL_CONFIG, message: config } : { ...DEFAULT_EMAIL_CONFIG, ...config }

    this.validators.push([v => options.regex.test(v), options.message, IssueCode.RefinementFailed])
    return this
  }
}
