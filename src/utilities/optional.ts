import type { MaybePromise, Output, ParseResult, Tyrun, TyrunMeta, TyrunMutation, TyrunOptional } from '../types'
import { MutationSchema } from './mutation'

export class OptionalSchema<S extends Tyrun<any>> implements TyrunOptional<S> {
  public readonly type = 'optional'
  public __default: Output<S> | undefined = undefined
  public readonly inner: S
  public readonly meta: TyrunMeta = { name: null, description: null }
  public readonly __isOptional = true

  constructor(private schema: S) {
    this.meta = schema.meta
    this.inner = schema
    this.__default = schema.__default
  }

  public parse(value: unknown): ParseResult<Output<S> | undefined> {
    if (this.__default !== undefined && value === undefined) value = this.__default

    if (value === undefined) return { data: value }
    return this.schema.parse(value)
  }
  public async parseAsync(value: unknown): Promise<ParseResult<Output<S> | undefined>> {
    if (this.__default !== undefined && value === undefined) value = this.__default

    if (value === undefined) return { data: value }
    return await this.schema.parseAsync(value)
  }

  public mutate<O>(mutation: (value: Output<S> | undefined) => MaybePromise<O>): TyrunMutation<this, O> {
    return new MutationSchema(this, mutation)
  }

  public default(value: Output<S> | undefined): this {
    this.__default = value
    return this
  }
}
