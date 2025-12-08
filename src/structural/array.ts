import { CODES, ERRORS } from '../constants'
import { TyrunBaseSchema } from '../core/base'
import { TyrunError } from '../errors'
import type { ErrorConfig, Input, Issue, Output, Result, TyrunArrayConfig, TyrunArrayType, TyrunBaseConfig, TyrunBaseType } from '../types'

export class TyrunArraySchema<T extends TyrunBaseType<any, any>> extends TyrunBaseSchema<Input<T>[], Output<T>[], TyrunArrayConfig> implements TyrunArrayType<T> {
  public override readonly type: 'array' = 'array' as const

  constructor(public readonly schema: T, config: TyrunBaseConfig<TyrunArrayConfig, Input<T>[], Output<T>[]>) {
    super(config)
  }

  public override parse(input: unknown): Output<T>[] {
    try {
      if (input === undefined && this.__config.default !== undefined) return this.runDefault()

      const preprocessed = this.runPreprocessors(input)

      if (!Array.isArray(preprocessed)) throw new TyrunError([this.buildIssue(CODES.BASE.TYPE, ERRORS.BASE.TYPE, [], this.__config.error)])

      const output: Output<T>[] = []
      const issues: Issue[] = []

      for (let index = 0; index < preprocessed.length; index++) {
        const item = preprocessed[index]
        const result = this.schema.safeParse(item)
        if (!result.success) issues.push(...result.issues.map(issue => ({ ...issue, path: [index.toString(), ...issue.path] })))
        else output.push(result.data)
      }

      issues.push(...this.runValidators(output))
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = this.runProcessors(output)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return this.runFallback()
      throw error
    }
  }
  public override async parseAsync(input: unknown): Promise<Output<T>[]> {
    try {
      if (input === undefined && this.__config.default !== undefined) return await this.runDefaultAsync()

      const preprocessed = await this.runPreprocessorsAsync(input)

      if (!Array.isArray(preprocessed)) throw new TyrunError([this.buildIssue(CODES.BASE.TYPE, ERRORS.BASE.TYPE, [], this.__config.error)])

      const output: Output<T>[] = []
      const issues: Issue[] = []

      for (let index = 0; index < preprocessed.length; index++) {
        const item = preprocessed[index]
        const result = await this.schema.safeParseAsync(item)
        if (!result.success) issues.push(...result.issues.map(issue => ({ ...issue, path: [index.toString(), ...issue.path] })))
        else output.push(result.data)
      }

      issues.push(...(await this.runValidatorsAsync(output)))
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = await this.runProcessorsAsync(output)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return await this.runFallbackAsync()
      throw error
    }
  }
  public override safeParse(input: unknown): Result<Output<T>[]> {
    try {
      const data = this.parse(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }
  public override async safeParseAsync(input: unknown): Promise<Result<Output<T>[]>> {
    try {
      const data = await this.parseAsync(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }

  public override clone(): TyrunArraySchema<T> {
    return new TyrunArraySchema(this.schema, this.__config)
  }

  public nonEmpty(error?: string | ErrorConfig): this {
    const issue = this.buildIssue(CODES.ARRAY.NON_EMPTY, ERRORS.ARRAY.NON_EMPTY, [], error)
    this.__config.validators.push(input => (input.length > 0 ? null : issue))
    return this
  }
  public min(length: number, error?: string | ErrorConfig): this {
    const issue = this.buildIssue(CODES.ARRAY.MIN, ERRORS.ARRAY.MIN(length), [], error)
    this.__config.validators.push(input => (input.length >= length ? null : issue))
    return this
  }
  public max(length: number, error?: string | ErrorConfig): this {
    const issue = this.buildIssue(CODES.ARRAY.MAX, ERRORS.ARRAY.MAX(length), [], error)
    this.__config.validators.push(input => (input.length <= length ? null : issue))
    return this
  }
}
