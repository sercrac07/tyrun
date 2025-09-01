import type { Infer, ParseResult, Tyrun, TyrunMeta, TyrunNullable } from './types'

export class NullableSchema<S extends Tyrun<any>> implements TyrunNullable<S> {
  meta: TyrunMeta = { name: null, description: null }

  constructor(private schema: S) {}

  parse(value: unknown): ParseResult<Infer<S> | null> {
    if (value === null) return { success: true, data: value }
    return this.schema.parse(value)
  }
}
