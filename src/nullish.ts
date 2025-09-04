import type { Infer, ParseResult, Tyrun, TyrunMeta, TyrunNullish } from './types'

export class NullishSchema<S extends Tyrun<any>> implements TyrunNullish<S> {
  public readonly type = 'nullish'
  public readonly meta: TyrunMeta = { name: null, description: null }
  public readonly __isOptional = true

  constructor(private schema: S) {
    this.meta = schema.meta
  }

  public parse(value: unknown): ParseResult<Infer<S> | null | undefined> {
    if (value === undefined || value === null) return { success: true, data: value }
    return this.schema.parse(value)
  }
}
