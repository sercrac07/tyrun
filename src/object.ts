import { BaseSchema } from './base'
import type { ParseResult, TypeFromShape, Tyrun, TyrunObject } from './types'

export class ObjectSchema<S extends { [key: string]: Tyrun<any> }> extends BaseSchema<TypeFromShape<S>> implements TyrunObject<S> {
  constructor(private schema: S, private message: string = 'Value must be an object') {
    super()
  }

  override parse(value: unknown): ParseResult<TypeFromShape<S>> {
    if (typeof value !== 'object' || Array.isArray(value) || value === null) return { success: false, errors: [this.message] }

    const errors: string[] = []
    const output: Record<string, any> = {}

    for (const [key, schema] of Object.entries(this.schema)) {
      const res = schema.parse((value as any)[key])
      if (!res.success) errors.push(...res.errors)
      else output[key] = res.data
    }

    if (errors.length) return { success: false, errors }
    return { success: true, data: output as TypeFromShape<S> }
  }
}
