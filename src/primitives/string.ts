import { CODES, ERRORS, REGEXES } from '../constants'
import { TyrunBaseSchema } from '../core/base'
import { TyrunError } from '../errors'
import type { ErrorConfig, Result, TyrunBaseConfig } from '../types'
import type { TyrunStringConfig, TyrunStringType } from './types'

export class TyrunStringSchema extends TyrunBaseSchema<string, string, TyrunStringConfig> implements TyrunStringType {
  public readonly type: 'string' = 'string' as const

  constructor(config: TyrunBaseConfig<TyrunStringConfig, string, string>) {
    super(config)
  }

  public override parse(input: unknown): string {
    try {
      if (input === undefined && this.__config.default !== undefined) return this.runDefault()

      const preprocessed = this.runPreprocessors(input)

      if (typeof preprocessed !== 'string') throw new TyrunError([this.buildIssue(CODES.BASE.TYPE, this.__config.error, [])])

      const issues = this.runValidators(preprocessed)
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = this.runProcessors(preprocessed)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return this.runFallback()
      throw error
    }
  }
  public override async parseAsync(input: unknown): Promise<string> {
    try {
      if (input === undefined && this.__config.default !== undefined) return await this.runDefaultAsync()

      const preprocessed = await this.runPreprocessorsAsync(input)

      if (typeof preprocessed !== 'string') throw new TyrunError([this.buildIssue(CODES.BASE.TYPE, this.__config.error, [])])

      const issues = await this.runValidatorsAsync(preprocessed)
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = await this.runProcessorsAsync(preprocessed)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return await this.runFallbackAsync()
      throw error
    }
  }
  public override safeParse(input: unknown): Result<string> {
    try {
      const data = this.parse(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }
  public override async safeParseAsync(input: unknown): Promise<Result<string>> {
    try {
      const data = await this.parseAsync(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }

  public override clone(): TyrunStringSchema {
    return new TyrunStringSchema(this.__config)
  }

  public nonEmpty(error?: string | ErrorConfig): this {
    const issue = this.buildIssue(CODES.STRING.NON_EMPTY, ERRORS.STRING.NON_EMPTY, [], error)
    this.__config.validators.push(v => (v.trim() === '' ? issue : null))
    return this
  }
  public min(length: number, error?: string | ErrorConfig): this {
    const issue = this.buildIssue(CODES.STRING.MIN, ERRORS.STRING.MIN(length), [], error)
    this.__config.validators.push(v => (v.length < length ? issue : null))
    return this
  }
  public max(length: number, error?: string | ErrorConfig): this {
    const issue = this.buildIssue(CODES.STRING.MAX, ERRORS.STRING.MAX(length), [], error)
    this.__config.validators.push(v => (v.length > length ? issue : null))
    return this
  }
  public regex(pattern: RegExp, error?: string | ErrorConfig): this {
    const issue = this.buildIssue(CODES.STRING.REGEX, ERRORS.STRING.REGEX, [], error)
    this.__config.validators.push(v => (pattern.test(v) ? null : issue))
    return this
  }
  public email(error?: string | ErrorConfig<{ pattern?: RegExp }>): this {
    const issue = this.buildIssue(CODES.STRING.EMAIL, ERRORS.STRING.EMAIL, [], error)
    const pattern = typeof error === 'string' ? REGEXES.EMAIL : error?.pattern ?? REGEXES.EMAIL
    this.__config.validators.push(v => (pattern.test(v) ? null : issue))
    return this
  }
  public url(error?: string | ErrorConfig): this {
    const issue = this.buildIssue(CODES.STRING.URL, ERRORS.STRING.URL, [], error)
    this.__config.validators.push(v => {
      try {
        new URL(v)
        return null
      } catch (_error) {
        return issue
      }
    })
    return this
  }
}
