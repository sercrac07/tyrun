import type { Infer, ParseResult, Tyrun, TyrunNullish } from './types'

export class NullishSchema<S extends Tyrun<any>> implements TyrunNullish<S> {
  readonly __isOptional = true

  constructor(private schema: S) {}

  parse(value: unknown): ParseResult<Infer<S> | null | undefined> {
    if (value === undefined || value === null) return { success: true, data: value }
    return this.schema.parse(value)
  }
}
