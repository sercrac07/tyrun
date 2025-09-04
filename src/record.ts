import { BaseSchema } from './base'
import type { Output, ParseResult, Tyrun, TyrunRecord } from './types'

export class RecordSchema<S extends Tyrun<any>> extends BaseSchema<{ [key: string]: Output<S> }> implements TyrunRecord<S> {
  public readonly type = 'record'
  public readonly inner: S

  constructor(private schema: S, private message: string = 'Value must be an object') {
    super()
    this.inner = schema
  }

  public override parse(value: unknown): ParseResult<{ [key: string]: Output<S> }> {
    if (typeof value !== 'object' || Array.isArray(value) || value === null) return { success: false, errors: [this.message] }

    const errors: string[] = []
    const output: Record<string, Output<S>> = {}

    for (const [key, val] of Object.entries(value)) {
      const res = this.schema.parse(val)
      if (!res.success) errors.push(...res.errors)
      else output[key] = res.data
    }

    errors.push(...this.runValidators(output))
    if (errors.length) return { success: false, errors }

    const v = this.runTransformers(output)
    return { success: true, data: v }
  }
}
