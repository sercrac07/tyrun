import { BaseSchema } from '../core/base'
import type { Issue, Output, ParseResult, Tyrun, TyrunUnion } from '../types'

export class UnionSchema<S extends Tyrun<any>> extends BaseSchema<Output<S>> implements TyrunUnion<S> {
  public readonly type = 'union'

  constructor(private schemas: S[]) {
    super()
  }

  public override parse(value: unknown): ParseResult<Output<S>> {
    const errors: Issue[] = []

    for (const schema of this.schemas) {
      const res = schema.parse(value)
      if (res.errors) errors.push(...res.errors)
      else {
        const validatorErrors = this.runValidators(res.data)
        if (validatorErrors.length) errors.push(...validatorErrors)
        else {
          const v = this.runTransformers(res.data)
          return { data: v }
        }
      }
    }

    return { errors }
  }
  public override async parseAsync(value: unknown): Promise<ParseResult<Output<S>>> {
    const errors: Issue[] = []

    for (const schema of this.schemas) {
      const res = await schema.parseAsync(value)
      if (res.errors) errors.push(...res.errors)
      else {
        const validatorErrors = await this.runValidatorsAsync(res.data)
        if (validatorErrors.length) errors.push(...validatorErrors)
        else {
          const v = await this.runTransformersAsync(res.data)
          return { data: v }
        }
      }
    }

    return { errors }
  }
}
