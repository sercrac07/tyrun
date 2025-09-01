import type { Infer, ParseResult, Tyrun, TyrunMeta, TyrunNullish } from './types'

export class NullishSchema<S extends Tyrun<any>> implements TyrunNullish<S> {
  meta: TyrunMeta = { name: null, description: null }
  readonly __isOptional = true

  constructor(private schema: S) {}

  parse(value: unknown): ParseResult<Infer<S> | null | undefined> {
    if (value === undefined || value === null) return { success: true, data: value }
    return this.schema.parse(value)
  }
}
