import type { MaybePromise, Output, ParseResult, TyrunBase, TyrunMeta, TyrunMutation, TyrunNullable, TyrunNullish, TyrunOptional } from '../types'

export class MutationSchema<I extends TyrunBase<any> | TyrunOptional<any> | TyrunNullable<any> | TyrunNullish<any>, O> implements TyrunMutation<I, O> {
  public readonly type = 'mutation'
  public readonly inner: I
  public readonly meta: TyrunMeta

  constructor(private schema: I, private mutation: (value: Output<I>) => MaybePromise<O>) {
    this.inner = schema
    this.meta = schema.meta
  }

  public parse(value: unknown): ParseResult<O> {
    const res = this.schema.parse(value)
    if (res.errors) return res

    const v = this.mutation(res.data)
    if (v instanceof Promise) throw new Error('Async mutations must be parsed with `parseAsync`')
    return { data: v }
  }
  public async parseAsync(value: unknown): Promise<ParseResult<O>> {
    const res = await this.schema.parseAsync(value)
    if (res.errors) return res

    const v = await this.mutation(res.data)
    return { data: v }
  }
}
