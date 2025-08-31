import { BaseSchema } from './base'
import type { Infer, ParseResult, Tyrun, TyrunRecord } from './types'

export class RecordSchema<S extends Tyrun<any>> extends BaseSchema<{ [key: string]: Infer<S> }> implements TyrunRecord<S> {
  constructor(private schema: S, private message: string = 'Value must be an object') {
    super()
  }

  override parse(value: unknown): ParseResult<{ [key: string]: Infer<S> }> {
    if (typeof value !== 'object' || Array.isArray(value) || value === null) return { success: false, errors: [this.message] }

    const errors: string[] = []
    const output: Record<string, Infer<S>> = {}

    for (const [key, val] of Object.entries(value)) {
      const res = this.schema.parse(val)
      if (!res.success) errors.push(...res.errors)
      else output[key] = res.data
    }

    if (errors.length) return { success: false, errors }
    return { success: true, data: output }
  }
}
