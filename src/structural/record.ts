import { IssueCode } from '../constants'
import { BaseSchema } from '../core/base'
import type { Issue, Output, ParseResult, Tyrun, TyrunRecord } from '../types'

export class RecordSchema<S extends Tyrun<any>> extends BaseSchema<{ [key: string]: Output<S> }> implements TyrunRecord<S> {
  public readonly type = 'record'
  public readonly inner: S

  constructor(private schema: S, private message: string = 'Value must be an object') {
    super()
    this.inner = schema
  }

  public override parse(value: unknown): ParseResult<{ [key: string]: Output<S> }> {
    if (this.__default !== undefined && value === undefined) value = this.__default
    value = this.runPreprocessors(value)

    if (typeof value !== 'object' || Array.isArray(value) || value === null) return { errors: [{ message: this.message, path: [], code: IssueCode.InvalidType }] }

    const errors: Issue[] = []
    const output: Record<string, Output<S>> = {}

    for (const [key, val] of Object.entries(value)) {
      const res = this.schema.parse(val)
      if (res.errors) errors.push(...res.errors.map(e => ({ ...e, path: [key, ...e.path] })))
      else output[key] = res.data
    }

    errors.push(...this.runValidators(output))
    if (errors.length) return { errors }

    const v = this.runTransformers(output)
    return { data: v }
  }
  public override async parseAsync(value: unknown): Promise<ParseResult<{ [key: string]: Output<S> }>> {
    if (this.__default !== undefined && value === undefined) value = this.__default
    value = await this.runPreprocessorsAsync(value)

    if (typeof value !== 'object' || Array.isArray(value) || value === null) return { errors: [{ message: this.message, path: [], code: IssueCode.InvalidType }] }

    const errors: Issue[] = []
    const output: Record<string, Output<S>> = {}

    for (const [key, val] of Object.entries(value)) {
      const res = await this.schema.parseAsync(val)
      if (res.errors) errors.push(...res.errors.map(e => ({ ...e, path: [key, ...e.path] })))
      else output[key] = res.data
    }

    errors.push(...(await this.runValidatorsAsync(output)))
    if (errors.length) return { errors }

    const v = await this.runTransformersAsync(output)
    return { data: v }
  }
}
