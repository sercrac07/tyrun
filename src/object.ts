import { BaseSchema } from './base'
import type { ParseResult, TypeFromShape, Tyrun, TyrunObject } from './types'

export class ObjectSchema<S extends { [key: string]: Tyrun<any> }> extends BaseSchema<TypeFromShape<S>> implements TyrunObject<S> {
  public readonly type = 'object'
  public readonly inner: S

  constructor(private schema: S, private message: string = 'Value must be an object') {
    super()
    this.inner = schema
  }

  public override parse(value: unknown): ParseResult<TypeFromShape<S>> {
    if (typeof value !== 'object' || Array.isArray(value) || value === null) return { success: false, errors: [this.message] }

    const errors: string[] = []
    const output: Record<string, any> = {}

    for (const [key, schema] of Object.entries(this.schema)) {
      const res = schema.parse((value as any)[key])
      if (!res.success) errors.push(...res.errors)
      else output[key] = res.data
    }

    errors.push(...this.runValidators(output as TypeFromShape<S>))
    if (errors.length) return { success: false, errors }

    const v = this.runTransformers(output as TypeFromShape<S>)
    return { success: true, data: v }
  }
}
