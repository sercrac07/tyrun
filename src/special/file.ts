import { IssueCode } from '../constants'
import { BaseSchema } from '../core/base'
import type { ParseResult, TyrunFile } from '../types'

export class FileSchema extends BaseSchema<File> implements TyrunFile {
  readonly type = 'file'

  constructor(private message: string = 'Value must be a file') {
    super()
  }

  public override parse(value: unknown): ParseResult<File> {
    if (!(value instanceof File)) return { errors: [{ message: this.message, path: [], code: IssueCode.InvalidType }] }

    const errors = this.runValidators(value)
    if (errors.length) return { errors }

    const v = this.runTransformers(value)
    return { data: v }
  }
  public override async parseAsync(value: unknown): Promise<ParseResult<File>> {
    if (!(value instanceof File)) return { errors: [{ message: this.message, path: [], code: IssueCode.InvalidType }] }

    const errors = await this.runValidatorsAsync(value)
    if (errors.length) return { errors }

    const v = await this.runTransformersAsync(value)
    return { data: v }
  }

  public min(size: number, message: string = `Value must be at least ${size} bytes`) {
    this.validators.push([v => v.size >= size, message, IssueCode.Min])
    return this
  }
  public max(size: number, message: string = `Value must be at most ${size} bytes`): this {
    this.validators.push([v => v.size <= size, message, IssueCode.Max])
    return this
  }
  public types(types: string[], message: string = `Value must be one of the following types: ${types.join(', ')}`): this {
    this.validators.push([v => types.includes(v.type), message, IssueCode.RefinementFailed])
    return this
  }
}
