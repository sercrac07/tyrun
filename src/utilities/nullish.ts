import type { MaybePromise, Output, ParseResult, Tyrun, TyrunMeta, TyrunMutation, TyrunNullish } from '../types'
import { MutationSchema } from './mutation'

export class NullishSchema<S extends Tyrun<any>> implements TyrunNullish<S> {
  public readonly type = 'nullish'
  public __default: Output<S> | null | undefined = undefined
  public readonly inner: S
  public readonly meta: TyrunMeta = { name: null, description: null }
  public readonly __isOptional = true

  constructor(private schema: S) {
    this.meta = schema.meta
    this.inner = schema
  }

  public parse(value: unknown): ParseResult<Output<S> | null | undefined> {
    if (this.__default !== undefined && value === undefined) value = this.__default

    if (value === undefined || value === null) return { data: value }
    return this.schema.parse(value)
  }
  public async parseAsync(value: unknown): Promise<ParseResult<Output<S> | null | undefined>> {
    if (this.__default !== undefined && value === undefined) value = this.__default

    if (value === undefined || value === null) return { data: value }
    return await this.schema.parseAsync(value)
  }

  public mutate<O>(mutation: (value: Output<S> | null | undefined) => MaybePromise<O>): TyrunMutation<this, O> {
    return new MutationSchema(this, mutation)
  }

  public default(value: Output<S> | null | undefined): this {
    this.__default = value
    return this
  }
}
