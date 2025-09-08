import type { Output, ParseResult, TyrunBase, TyrunMeta, TyrunMutation, TyrunNullable, TyrunNullish, TyrunOptional } from '../types'

export class MutationSchema<I extends TyrunBase<any> | TyrunOptional<any> | TyrunNullable<any> | TyrunNullish<any>, O> implements TyrunMutation<I, O> {
  readonly type = 'mutation'
  readonly inner: I
  readonly meta: TyrunMeta

  constructor(private schema: I, private mutation: (value: Output<I>) => O) {
    this.inner = schema
    this.meta = schema.meta
  }

  parse(value: unknown): ParseResult<O> {
    const res = this.schema.parse(value)
    if (res.errors) return res

    return { data: this.mutation(res.data) }
  }
}
