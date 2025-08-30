import { BaseSchema } from './base'
import { ParseResult, TyrunEnum } from './types'

export class EnumSchema<S extends readonly (string | number)[]> extends BaseSchema<S[number]> implements TyrunEnum<S> {
  constructor(private schema: S, private message: string = `Value must be one from the options: ${schema.join(', ')}`) {
    super()
  }

  override parse(value: unknown): ParseResult<S[number]> {
    if (!this.schema.includes(value as any)) return { success: false, errors: [this.message] }
    return { success: true, data: value as S[number] }
  }
}
