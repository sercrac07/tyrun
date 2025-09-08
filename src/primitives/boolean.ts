import { BaseSchema } from '../core/base'
import type { ParseResult, TyrunBoolean } from '../types'

export class BooleanSchema extends BaseSchema<boolean> implements TyrunBoolean {
  public readonly type = 'boolean'
  protected __coerce = false

  constructor(private message: string = 'Value must be a boolean') {
    super()
  }

  public override parse(value: unknown): ParseResult<boolean> {
    if (this.__coerce) value = Boolean(value)

    if (typeof value !== 'boolean') return { success: false, errors: [this.message] }

    const errors = this.runValidators(value)
    if (errors.length) return { success: false, errors }

    const v = this.runTransformers(value)
    return { success: true, data: v }
  }
  public coerce(): this {
    this.__coerce = true
    return this
  }
}
