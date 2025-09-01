import type { Infer, ParseResult, Tyrun, TyrunMeta, TyrunOptional } from './types'

export class OptionalSchema<S extends Tyrun<any>> implements TyrunOptional<S> {
  public meta: TyrunMeta = { name: null, description: null }
  readonly __isOptional = true

  constructor(private schema: S) {}

  public parse(value: unknown): ParseResult<Infer<S> | undefined> {
    if (value === undefined) return { success: true, data: value }
    return this.schema.parse(value)
  }
}
