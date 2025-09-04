import { BaseSchema } from './base'
import { ParseResult, TyrunEnum } from './types'

export class EnumSchema<S extends string | number> extends BaseSchema<S> implements TyrunEnum<S> {
  public readonly type = 'enum'
  public readonly values: S[]

  constructor(private schema: S[], private message: string = `Value must be one from the options: ${schema.join(', ')}`) {
    super()
    this.values = schema
  }

  public override parse(value: unknown): ParseResult<S> {
    if (!this.schema.includes(value as any)) return { success: false, errors: [this.message] }
    return { success: true, data: value as S }
  }
}
