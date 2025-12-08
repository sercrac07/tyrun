import { CODES, ERRORS } from '../constants'
import { TyrunBaseSchema } from '../core/base'
import { TyrunError } from '../errors'
import type { ErrorConfig, Result, TyrunBaseConfig, TyrunNumberConfig, TyrunNumberType } from '../types'

export class TyrunNumberSchema extends TyrunBaseSchema<number, number, TyrunNumberConfig> implements TyrunNumberType {
  public override readonly type: 'number' = 'number' as const

  constructor(config: TyrunBaseConfig<TyrunNumberConfig, number, number>) {
    super(config)
  }

  public override parse(input: unknown): number {
    try {
      if (input === undefined && this.__config.default !== undefined) return this.runDefault()

      const preprocessed = this.runPreprocessors(input)

      if (typeof preprocessed !== 'number' || isNaN(preprocessed)) throw new TyrunError([this.buildIssue(CODES.BASE.TYPE, ERRORS.BASE.TYPE, [], this.__config.error)])

      const issues = this.runValidators(preprocessed)
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = this.runProcessors(preprocessed)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return this.runFallback()
      throw error
    }
  }
  public override async parseAsync(input: unknown): Promise<number> {
    try {
      if (input === undefined && this.__config.default !== undefined) return await this.runDefaultAsync()

      const preprocessed = await this.runPreprocessorsAsync(input)

      if (typeof preprocessed !== 'number' || isNaN(preprocessed)) throw new TyrunError([this.buildIssue(CODES.BASE.TYPE, ERRORS.BASE.TYPE, [], this.__config.error)])

      const issues = await this.runValidatorsAsync(preprocessed)
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = await this.runProcessorsAsync(preprocessed)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return await this.runFallbackAsync()
      throw error
    }
  }
  public override safeParse(input: unknown): Result<number> {
    try {
      const data = this.parse(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }
  public override async safeParseAsync(input: unknown): Promise<Result<number>> {
    try {
      const data = await this.parseAsync(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }

  public override clone(): TyrunNumberSchema {
    return new TyrunNumberSchema(this.__config)
  }

  public min(value: number, error?: string | ErrorConfig): this {
    const issue = this.buildIssue(CODES.NUMBER.MIN, ERRORS.NUMBER.MIN(value), [], error)
    this.__config.validators.push(v => (v >= value ? null : issue))
    return this
  }
  public max(value: number, error?: string | ErrorConfig): this {
    const issue = this.buildIssue(CODES.NUMBER.MAX, ERRORS.NUMBER.MAX(value), [], error)
    this.__config.validators.push(v => (v <= value ? null : issue))
    return this
  }
  public integer(error?: string | ErrorConfig): this {
    const issue = this.buildIssue(CODES.NUMBER.INTEGER, ERRORS.NUMBER.INTEGER, [], error)
    this.__config.validators.push(v => (Number.isInteger(v) ? null : issue))
    return this
  }
  public positive(error?: string | ErrorConfig): this {
    const issue = this.buildIssue(CODES.NUMBER.POSITIVE, ERRORS.NUMBER.POSITIVE, [], error)
    this.__config.validators.push(v => (v > 0 ? null : issue))
    return this
  }
  public negative(error?: string | ErrorConfig): this {
    const issue = this.buildIssue(CODES.NUMBER.NEGATIVE, ERRORS.NUMBER.NEGATIVE, [], error)
    this.__config.validators.push(v => (v < 0 ? null : issue))
    return this
  }
}
