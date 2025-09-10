import { BaseSchema } from '../core/base'
import { Output, ParseResult, Tyrun, TyrunLazy } from '../types'

export class LazySchema<S extends Tyrun<any>> extends BaseSchema<Output<S>> implements TyrunLazy<S> {
  public readonly type = 'lazy'
  public readonly inner: S

  constructor(private schema: () => S) {
    super()
    this.inner = this.schema()
  }

  public override parse(value: unknown): ParseResult<Output<S>> {
    if (this.__default !== undefined && value === undefined) value = this.__default
    value = this.runPreprocessors(value)

    const res = this.schema().parse(value)
    if (res.errors) return res

    const errors = this.runValidators(res.data)
    if (errors.length) return { errors }

    const v = this.runTransformers(res.data)
    return { data: v }
  }
  public override async parseAsync(value: unknown): Promise<ParseResult<Output<S>>> {
    if (this.__default !== undefined && value === undefined) value = this.__default
    value = await this.runPreprocessorsAsync(value)

    const res = await this.schema().parseAsync(value)
    if (res.errors) return res

    const errors = await this.runValidatorsAsync(res.data)
    if (errors.length) return { errors }

    const v = await this.runTransformersAsync(res.data)
    return { data: v }
  }
}
