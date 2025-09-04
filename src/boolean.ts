import { BaseSchema } from './base'
import type { ParseResult, TyrunBoolean } from './types'

export class BooleanSchema extends BaseSchema<boolean> implements TyrunBoolean {
  public readonly type = 'boolean'

  constructor(private message: string = 'Value must be a boolean') {
    super()
  }

  public override parse(value: unknown): ParseResult<boolean> {
    if (typeof value !== 'boolean') return { success: false, errors: [this.message] }
    return { success: true, data: value }
  }
}
