import { MutationSchema } from './mutation'
import type { Output, ParseResult, Tyrun, TyrunMeta, TyrunMutation, TyrunOptional } from './types'

export class OptionalSchema<S extends Tyrun<any>> implements TyrunOptional<S> {
  public readonly type = 'optional'
  public readonly inner: S
  public readonly meta: TyrunMeta = { name: null, description: null }
  public readonly __isOptional = true

  constructor(private schema: S) {
    this.meta = schema.meta
    this.inner = schema
  }

  public parse(value: unknown): ParseResult<Output<S> | undefined> {
    if (value === undefined) return { success: true, data: value }
    return this.schema.parse(value)
  }

  public mutate<O>(mutation: (value: Output<S> | undefined) => O): TyrunMutation<this, O> {
    return new MutationSchema(this, mutation)
  }
}
