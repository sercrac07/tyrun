import { MutationSchema } from './mutation'
import type { Output, ParseResult, Tyrun, TyrunMeta, TyrunMutation, TyrunNullish } from './types'

export class NullishSchema<S extends Tyrun<any>> implements TyrunNullish<S> {
  public readonly type = 'nullish'
  public readonly inner: S
  public readonly meta: TyrunMeta = { name: null, description: null }
  public readonly __isOptional = true

  constructor(private schema: S) {
    this.meta = schema.meta
    this.inner = schema
  }

  public parse(value: unknown): ParseResult<Output<S> | null | undefined> {
    if (value === undefined || value === null) return { success: true, data: value }
    return this.schema.parse(value)
  }

  public mutate<O>(mutation: (value: Output<S> | null | undefined) => O): TyrunMutation<this, O> {
    return new MutationSchema(this, mutation)
  }
}
