import { BaseSchema } from './base'
import type { Infer, ParseResult, Tyrun, TyrunArray } from './types'

export class ArraySchema<S extends Tyrun<any>> extends BaseSchema<Infer<S>[]> implements TyrunArray<S> {
  public inner: S

  constructor(private schema: S, private message: string = 'Value must be an array') {
    super()
    this.inner = schema
  }

  override parse(value: unknown): ParseResult<Infer<S>[]> {
    if (!Array.isArray(value)) return { success: false, errors: [this.message] }

    const errors: string[] = []
    const output: any[] = []

    for (const v of value) {
      const res = this.schema.parse(v)
      if (!res.success) errors.push(...res.errors)
      else output.push(v)
    }

    errors.push(...this.runValidators(output))
    if (errors.length) return { success: false, errors }
    return { success: true, data: output }
  }

  public min(length: number, message: string = `Value must contain at least ${length} items`): this {
    this.validators.push(v => (v.length >= length ? null : message))
    return this
  }

  public max(length: number, message: string = `Value must contain at most ${length} items`): this {
    this.validators.push(v => (v.length <= length ? null : message))
    return this
  }
}
