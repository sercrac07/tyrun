import { BaseSchema } from './base'
import type { ParseResult, TyrunBoolean } from './types'

export class BooleanSchema extends BaseSchema<boolean> implements TyrunBoolean {
  constructor(private message: string = 'Value must be a boolean') {
    super()
  }

  override parse(value: unknown): ParseResult<boolean> {
    if (typeof value !== 'boolean') return { success: false, errors: [this.message] }
    return { success: true, data: value }
  }
}
