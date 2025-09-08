import type { MaybePromise, Output, ParseResult, Tyrun, TyrunMeta, TyrunMutation, TyrunNullable } from '../types'
import { MutationSchema } from './mutation'

export class NullableSchema<S extends Tyrun<any>> implements TyrunNullable<S> {
  public readonly type = 'nullable'
  public readonly inner: S
  public readonly meta: TyrunMeta = { name: null, description: null }

  constructor(private schema: S) {
    this.meta = schema.meta
    this.inner = schema
  }

  public parse(value: unknown): ParseResult<Output<S> | null> {
    if (value === null) return { data: value }
    return this.schema.parse(value)
  }
  public async parseAsync(value: unknown): Promise<ParseResult<Output<S> | null>> {
    if (value === null) return { data: value }
    return await this.schema.parseAsync(value)
  }

  public mutate<O>(mutation: (value: Output<S> | null) => MaybePromise<O>): TyrunMutation<this, O> {
    return new MutationSchema(this, mutation)
  }
}
