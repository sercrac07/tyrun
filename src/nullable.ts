import type { Infer, ParseResult, Tyrun, TyrunMeta, TyrunNullable } from './types'

export class NullableSchema<S extends Tyrun<any>> implements TyrunNullable<S> {
  public readonly type = 'nullable'
  public readonly meta: TyrunMeta = { name: null, description: null }

  constructor(private schema: S) {
    this.meta = schema.meta
  }

  public parse(value: unknown): ParseResult<Infer<S> | null> {
    if (value === null) return { success: true, data: value }
    return this.schema.parse(value)
  }
}
