import { BaseSchema } from '../core/base'
import { ParseResult, TyrunEnum } from '../types'

export class EnumSchema<S extends string | number> extends BaseSchema<S> implements TyrunEnum<S> {
  public readonly type = 'enum'
  public readonly values: S[]

  constructor(private schema: S[], private message: string = `Value must be one from the options: ${schema.join(', ')}`) {
    super()
    this.values = schema
  }

  public override parse(value: unknown): ParseResult<S> {
    if (!this.schema.includes(value as any)) return { errors: [this.message] }

    const errors = this.runValidators(value as S)
    if (errors.length) return { errors }

    const v = this.runTransformers(value as S)
    return { data: v }
  }
  public override async parseAsync(value: unknown): Promise<ParseResult<S>> {
    if (!this.schema.includes(value as any)) return { errors: [this.message] }

    const errors = await this.runValidatorsAsync(value as S)
    if (errors.length) return { errors }

    const v = await this.runTransformersAsync(value as S)
    return { data: v }
  }
}
