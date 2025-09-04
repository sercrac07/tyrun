import type { Output, ParseResult, TyrunBase, TyrunMeta, TyrunMutation } from './types'

export class MutationSchema<I extends TyrunBase<any>, O> implements TyrunMutation<I, O> {
  readonly type = 'mutation'
  readonly inner: I
  readonly meta: TyrunMeta

  constructor(private schema: I, private mutation: (value: Output<I>) => O) {
    this.inner = schema
    this.meta = schema.meta
  }

  parse(value: unknown): ParseResult<O> {
    const res = this.schema.parse(value)
    if (!res.success) return res

    return { success: true, data: this.mutation(res.data) }
  }
}
