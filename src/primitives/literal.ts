import { IssueCode } from '../constants'
import { BaseSchema } from '../core/base'
import type { ParseResult, TyrunLiteral } from '../types'

export class LiteralSchema<S extends string | number | boolean> extends BaseSchema<S> implements TyrunLiteral<S> {
  readonly type = 'literal' as const
  readonly value: S

  constructor(private schema: S, private message: string = `Value must be equal to: ${schema}`) {
    super()
    this.value = schema
  }

  public override parse(value: unknown): ParseResult<S> {
    if (this.__default !== undefined && value === undefined) value = this.__default
    value = this.runPreprocessors(value)

    if (value !== this.schema) return { errors: [{ message: this.message, path: [], code: IssueCode.InvalidType }] }

    const errors = this.runValidators(value as S)
    if (errors.length) return { errors }

    const v = this.runTransformers(value as S)
    return { data: v }
  }
  public override async parseAsync(value: unknown): Promise<ParseResult<S>> {
    if (this.__default !== undefined && value === undefined) value = this.__default
    value = await this.runPreprocessorsAsync(value)

    if (value !== this.schema) return { errors: [{ message: this.message, path: [], code: IssueCode.InvalidType }] }

    const errors = await this.runValidatorsAsync(value as S)
    if (errors.length) return { errors }

    const v = await this.runTransformersAsync(value as S)
    return { data: v }
  }
}
