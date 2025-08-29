import type { Infer, ParseResult, Tyrun, TyrunOptional } from './types'

export class OptionalSchema<S extends Tyrun<any>> implements TyrunOptional<S> {
  readonly __isOptional = true

  constructor(private schema: S) {}

  parse(value: unknown): ParseResult<Infer<S> | undefined> {
    if (value === undefined) return { success: true, data: value }
    return this.schema.parse(value)
  }
}
