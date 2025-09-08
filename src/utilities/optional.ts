import type { MaybePromise, Output, ParseResult, Tyrun, TyrunMeta, TyrunMutation, TyrunOptional } from '../types'
import { MutationSchema } from './mutation'

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
    if (value === undefined) return { data: value }
    return this.schema.parse(value)
  }
  public async parseAsync(value: unknown): Promise<ParseResult<Output<S> | undefined>> {
    if (value === undefined) return { data: value }
    return await this.schema.parseAsync(value)
  }

  public mutate<O>(mutation: (value: Output<S> | undefined) => MaybePromise<O>): TyrunMutation<this, O> {
    return new MutationSchema(this, mutation)
  }
}
