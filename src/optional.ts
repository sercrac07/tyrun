import type { Output, ParseResult, Tyrun, TyrunMeta, TyrunOptional } from './types'

export class OptionalSchema<S extends Tyrun<any>> implements TyrunOptional<S> {
  public readonly type = 'optional'
  public readonly meta: TyrunMeta = { name: null, description: null }
  public readonly __isOptional = true

  constructor(private schema: S) {
    this.meta = schema.meta
  }

  public parse(value: unknown): ParseResult<Output<S> | undefined> {
    if (value === undefined) return { success: true, data: value }
    return this.schema.parse(value)
  }
}
