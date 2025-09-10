import { IssueCode } from '../constants'
import { BaseSchema } from '../core/base'
import type { Issue, Output, ParseResult, Tyrun, TyrunTuple } from '../types'

export class TupleSchema<S extends Tyrun<any>[]> extends BaseSchema<{ [key in keyof S]: Output<S[key]> }> implements TyrunTuple<S> {
  public readonly type = 'tuple'
  public readonly inner: S

  constructor(private schemas: [...S], private message: string = `Value must be a tuple of ${schemas.length} items`) {
    super()
    this.inner = schemas
  }

  public override parse(value: unknown): ParseResult<{ [key in keyof S]: Output<S[key]> }> {
    if (this.__default !== undefined && value === undefined) value = this.__default
    value = this.runPreprocessors(value)

    if (!Array.isArray(value) || value.length !== this.schemas.length) return { errors: [{ message: this.message, path: [], code: IssueCode.InvalidType }] }

    const errors: Issue[] = []
    const output: any[] = []

    let i = 0
    for (const v of value) {
      const res = this.schemas[i].parse(v)
      if (res.errors) errors.push(...res.errors.map(e => ({ ...e, path: [i.toString(), ...e.path] })))
      else output.push(res.data)
      i++
    }

    errors.push(...this.runValidators(output as { [key in keyof S]: Output<S[key]> }))
    if (errors.length) return { errors }

    const v = this.runTransformers(output as { [key in keyof S]: Output<S[key]> })
    return { data: v }
  }
  public override async parseAsync(value: unknown): Promise<ParseResult<{ [key in keyof S]: Output<S[key]> }>> {
    if (this.__default !== undefined && value === undefined) value = this.__default
    value = await this.runPreprocessorsAsync(value)

    if (!Array.isArray(value) || value.length !== this.schemas.length) return { errors: [{ message: this.message, path: [], code: IssueCode.InvalidType }] }

    const errors: Issue[] = []
    const output: any[] = []

    let i = 0
    for (const v of value) {
      const res = await this.schemas[i].parseAsync(v)
      if (res.errors) errors.push(...res.errors.map(e => ({ ...e, path: [i.toString(), ...e.path] })))
      else output.push(res.data)
      i++
    }

    errors.push(...(await this.runValidatorsAsync(output as { [key in keyof S]: Output<S[key]> })))
    if (errors.length) return { errors }

    const v = await this.runTransformersAsync(output as { [key in keyof S]: Output<S[key]> })
    return { data: v }
  }
}
