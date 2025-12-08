import { CODES, ERRORS } from '../constants'
import { TyrunBaseSchema } from '../core/base'
import { TyrunError } from '../errors'
import type { ErrorConfig, Result, TyrunBaseConfig, TyrunBigintConfig, TyrunBigintType } from '../types'

export class TyrunBigintSchema extends TyrunBaseSchema<bigint, bigint, TyrunBigintConfig> implements TyrunBigintType {
  public override readonly type: 'bigint' = 'bigint' as const

  constructor(config: TyrunBaseConfig<TyrunBigintConfig, bigint, bigint>) {
    super(config)
  }

  public override parse(input: unknown): bigint {
    try {
      if (input === undefined && this.__config.default !== undefined) return this.runDefault()

      const preprocessed = this.runPreprocessors(input)

      if (typeof preprocessed !== 'bigint') throw new TyrunError([this.buildIssue(CODES.BASE.TYPE, ERRORS.BASE.TYPE, [], this.__config.error)])

      const issues = this.runValidators(preprocessed)
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = this.runProcessors(preprocessed)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return this.runFallback()
      throw error
    }
  }
  public override async parseAsync(input: unknown): Promise<bigint> {
    try {
      if (input === undefined && this.__config.default !== undefined) return await this.runDefaultAsync()

      const preprocessed = await this.runPreprocessorsAsync(input)

      if (typeof preprocessed !== 'bigint') throw new TyrunError([this.buildIssue(CODES.BASE.TYPE, ERRORS.BASE.TYPE, [], this.__config.error)])

      const issues = await this.runValidatorsAsync(preprocessed)
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = await this.runProcessorsAsync(preprocessed)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return await this.runFallbackAsync()
      throw error
    }
  }
  public override safeParse(input: unknown): Result<bigint> {
    try {
      const data = this.parse(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }
  public override async safeParseAsync(input: unknown): Promise<Result<bigint>> {
    try {
      const data = await this.parseAsync(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }

  public override clone(): TyrunBigintSchema {
    return new TyrunBigintSchema(this.__config)
  }

  public min(value: bigint, error?: string | ErrorConfig): this {
    const issue = this.buildIssue(CODES.BIGINT.MIN, ERRORS.BIGINT.MIN(value), [], error)
    this.__config.validators.push(v => (v >= value ? null : issue))
    return this
  }
  public max(value: bigint, error?: string | ErrorConfig): this {
    const issue = this.buildIssue(CODES.BIGINT.MAX, ERRORS.BIGINT.MAX(value), [], error)
    this.__config.validators.push(v => (v <= value ? null : issue))
    return this
  }
  public positive(error?: string | ErrorConfig): this {
    const issue = this.buildIssue(CODES.BIGINT.POSITIVE, ERRORS.BIGINT.POSITIVE, [], error)
    this.__config.validators.push(v => (v > 0n ? null : issue))
    return this
  }
  public negative(error?: string | ErrorConfig): this {
    const issue = this.buildIssue(CODES.BIGINT.NEGATIVE, ERRORS.BIGINT.NEGATIVE, [], error)
    this.__config.validators.push(v => (v < 0n ? null : issue))
    return this
  }
}
