import type { Infer, ParseResult, Tyrun, TyrunNullable } from './types'

export class NullableSchema<S extends Tyrun<any>> implements TyrunNullable<S> {
  constructor(private schema: S) {}

  parse(value: unknown): ParseResult<Infer<S> | null> {
    if (value === null) return { success: true, data: value }
    return this.schema.parse(value)
  }
}
