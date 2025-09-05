import { MutationSchema } from './mutation'
import type { Output, ParseResult, Tyrun, TyrunMeta, TyrunMutation, TyrunNullable } from './types'

export class NullableSchema<S extends Tyrun<any>> implements TyrunNullable<S> {
  public readonly type = 'nullable'
  public readonly inner: S
  public readonly meta: TyrunMeta = { name: null, description: null }

  constructor(private schema: S) {
    this.meta = schema.meta
    this.inner = schema
  }

  public parse(value: unknown): ParseResult<Output<S> | null> {
    if (value === null) return { success: true, data: value }
    return this.schema.parse(value)
  }

  public mutate<O>(mutation: (value: Output<S> | null) => O): TyrunMutation<this, O> {
    return new MutationSchema(this, mutation)
  }
}
