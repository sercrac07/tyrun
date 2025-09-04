import { BaseSchema } from './base'
import type { Output, ParseResult, Tyrun, TyrunUnion } from './types'

export class UnionSchema<S extends Tyrun<any>> extends BaseSchema<Output<S>> implements TyrunUnion<S> {
  public readonly type = 'union'

  constructor(private schemas: S[]) {
    super()
  }

  public override parse(value: unknown): ParseResult<Output<S>> {
    const errors: string[] = []

    for (const schema of this.schemas) {
      const res = schema.parse(value)
      if (!res.success) errors.push(...res.errors)
      else return { success: true, data: res.data }
    }

    return { success: false, errors }
  }
}
