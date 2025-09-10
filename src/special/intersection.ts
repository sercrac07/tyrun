import { BaseSchema } from '../core/base'
import { Issue, Output, ParseResult, TyrunIntersection, TyrunObject, TyrunRecord, UnionToIntersection } from '../types'

export class IntersectionSchema<S extends TyrunObject<any> | TyrunRecord<any>> extends BaseSchema<UnionToIntersection<Output<S>>> implements TyrunIntersection<S> {
  public readonly type = 'intersection'

  constructor(private schemas: S[]) {
    super()
  }

  public override parse(value: unknown): ParseResult<UnionToIntersection<Output<S>>> {
    if (this.__default !== undefined && value === undefined) value = this.__default

    const errors: Issue[] = []
    let output: Record<string, any> = {}

    for (const schema of this.schemas) {
      const res = schema.parse(value)
      if (res.errors) errors.push(...res.errors)
      else output = { ...output, ...res.data }
    }

    errors.push(...this.runValidators(output as UnionToIntersection<Output<S>>))
    if (errors.length) return { errors }

    const v = this.runTransformers(output as UnionToIntersection<Output<S>>)
    return { data: v as UnionToIntersection<Output<S>> }
  }
  public override async parseAsync(value: unknown): Promise<ParseResult<UnionToIntersection<Output<S>>>> {
    if (this.__default !== undefined && value === undefined) value = this.__default

    const errors: Issue[] = []
    let output: Record<string, any> = {}

    for (const schema of this.schemas) {
      const res = await schema.parseAsync(value)
      if (res.errors) errors.push(...res.errors)
      else output = { ...output, ...res.data }
    }

    errors.push(...(await this.runValidatorsAsync(output as UnionToIntersection<Output<S>>)))
    if (errors.length) return { errors }

    const v = await this.runTransformersAsync(output as UnionToIntersection<Output<S>>)
    return { data: v as UnionToIntersection<Output<S>> }
  }
}
