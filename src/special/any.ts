import { BaseSchema } from '../core/base'
import type { ParseResult, TyrunAny } from '../types'

export class AnySchema extends BaseSchema<any> implements TyrunAny {
  public readonly type = 'any'

  constructor() {
    super()
  }

  public override parse(value: unknown): ParseResult<any> {
    if (this.__default !== undefined && value === undefined) value = this.__default
    value = this.runPreprocessors(value)

    const errors = this.runValidators(value)
    if (errors.length) return { errors }

    const v = this.runTransformers(value)
    return { data: v }
  }
  public override async parseAsync(value: unknown): Promise<ParseResult<any>> {
    if (this.__default !== undefined && value === undefined) value = this.__default
    value = await this.runPreprocessorsAsync(value)

    const errors = await this.runValidatorsAsync(value)
    if (errors.length) return { errors }

    const v = await this.runTransformersAsync(value)
    return { data: v }
  }
}
