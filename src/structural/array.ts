import { IssueCode } from '../constants'
import { BaseSchema } from '../core/base'
import type { Issue, Output, ParseResult, Tyrun, TyrunArray } from '../types'

export class ArraySchema<S extends Tyrun<any>> extends BaseSchema<Output<S>[]> implements TyrunArray<S> {
  public readonly type = 'array'
  public readonly inner: S

  constructor(private schema: S, private message: string = 'Value must be an array') {
    super()
    this.inner = schema
  }

  public override parse(value: unknown): ParseResult<Output<S>[]> {
    if (this.__default !== undefined && value === undefined) value = this.__default
    value = this.runPreprocessors(value)

    if (!Array.isArray(value)) return { errors: [{ message: this.message, path: [], code: IssueCode.InvalidType }] }

    const errors: Issue[] = []
    const output: Output<S>[] = []

    let i = 0
    for (const v of value) {
      const res = this.schema.parse(v)
      if (res.errors) errors.push(...res.errors.map(e => ({ ...e, path: [i.toString(), ...e.path] })))
      else output.push(res.data)
      i++
    }

    errors.push(...this.runValidators(output))
    if (errors.length) return { errors }

    const v = this.runTransformers(output)
    return { data: v }
  }
  public override async parseAsync(value: unknown): Promise<ParseResult<Output<S>[]>> {
    if (this.__default !== undefined && value === undefined) value = this.__default
    value = await this.runPreprocessorsAsync(value)

    if (!Array.isArray(value)) return { errors: [{ message: this.message, path: [], code: IssueCode.InvalidType }] }

    const errors: Issue[] = []
    const output: Output<S>[] = []

    let i = 0
    for (const v of value) {
      const res = await this.schema.parseAsync(v)
      if (res.errors) errors.push(...res.errors.map(e => ({ ...e, path: [i.toString(), ...e.path] })))
      else output.push(res.data)
      i++
    }

    errors.push(...(await this.runValidatorsAsync(output)))
    if (errors.length) return { errors }

    const v = await this.runTransformersAsync(output)
    return { data: v }
  }

  public min(length: number, message: string = `Value must contain at least ${length} items`): this {
    this.validators.push([v => v.length >= length, message, IssueCode.Min])
    return this
  }

  public max(length: number, message: string = `Value must contain at most ${length} items`): this {
    this.validators.push([v => v.length <= length, message, IssueCode.Max])
    return this
  }
}
