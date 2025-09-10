import { IssueCode } from '../constants'
import { BaseSchema } from '../core/base'
import type { ParseResult, TyrunBoolean } from '../types'

export class BooleanSchema extends BaseSchema<boolean> implements TyrunBoolean {
  public readonly type = 'boolean'
  protected __coerce = false

  constructor(private message: string = 'Value must be a boolean') {
    super()
  }

  public override parse(value: unknown): ParseResult<boolean> {
    if (this.__default !== undefined && value === undefined) value = this.__default
    if (this.__coerce) value = Boolean(value)
    value = this.runPreprocessors(value)

    if (typeof value !== 'boolean') return { errors: [{ message: this.message, path: [], code: IssueCode.InvalidType }] }

    const errors = this.runValidators(value)
    if (errors.length) return { errors }

    const v = this.runTransformers(value)
    return { data: v }
  }
  public override async parseAsync(value: unknown): Promise<ParseResult<boolean>> {
    if (this.__default !== undefined && value === undefined) value = this.__default
    if (this.__coerce) value = Boolean(value)
    value = await this.runPreprocessorsAsync(value)

    if (typeof value !== 'boolean') return { errors: [{ message: this.message, path: [], code: IssueCode.InvalidType }] }

    const errors = await this.runValidatorsAsync(value)
    if (errors.length) return { errors }

    const v = await this.runTransformersAsync(value)
    return { data: v }
  }
  public coerce(): this {
    this.__coerce = true
    return this
  }
}
