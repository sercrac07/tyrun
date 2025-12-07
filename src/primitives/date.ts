import { CODES, ERRORS } from '../constants'
import { TyrunBaseSchema } from '../core/base'
import { TyrunError } from '../errors'
import type { ErrorConfig, Result, TyrunBaseConfig, TyrunDateConfig, TyrunDateType } from '../types'

export class TyrunDateSchema extends TyrunBaseSchema<Date, Date, TyrunDateConfig> implements TyrunDateType {
  public readonly type: 'date' = 'date' as const

  constructor(config: TyrunBaseConfig<TyrunDateConfig, Date, Date>) {
    super(config)
  }

  public override parse(input: unknown): Date {
    try {
      if (input === undefined && this.__config.default !== undefined) return this.runDefault()

      const preprocessed = this.runPreprocessors(input)

      if (!(preprocessed instanceof Date)) throw new TyrunError([this.buildIssue(CODES.BASE.TYPE, ERRORS.BASE.TYPE, [], this.__config.error)])

      const issues = this.runValidators(preprocessed)
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = this.runProcessors(preprocessed)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return this.runFallback()
      throw error
    }
  }
  public override async parseAsync(input: unknown): Promise<Date> {
    try {
      if (input === undefined && this.__config.default !== undefined) return await this.runDefaultAsync()

      const preprocessed = await this.runPreprocessorsAsync(input)

      if (!(preprocessed instanceof Date)) throw new TyrunError([this.buildIssue(CODES.BASE.TYPE, ERRORS.BASE.TYPE, [], this.__config.error)])

      const issues = await this.runValidatorsAsync(preprocessed)
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = await this.runProcessorsAsync(preprocessed)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return await this.runFallbackAsync()
      throw error
    }
  }
  public override safeParse(input: unknown): Result<Date> {
    try {
      const data = this.parse(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }
  public override async safeParseAsync(input: unknown): Promise<Result<Date>> {
    try {
      const data = await this.parseAsync(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }

  public override clone(): TyrunDateSchema {
    return new TyrunDateSchema(this.__config)
  }

  public min(value: Date, error?: string | ErrorConfig): this {
    const issue = this.buildIssue(CODES.DATE.MIN, ERRORS.DATE.MIN(value), [], error)
    this.__config.validators.push(v => (v.getTime() >= value.getTime() ? null : issue))
    return this
  }
  public max(value: Date, error?: string | ErrorConfig): this {
    const issue = this.buildIssue(CODES.DATE.MAX, ERRORS.DATE.MAX(value), [], error)
    this.__config.validators.push(v => (v.getTime() <= value.getTime() ? null : issue))
    return this
  }
}
