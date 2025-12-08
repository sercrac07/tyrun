import { CODES, ERRORS } from '../constants'
import { TyrunBaseSchema } from '../core/base'
import { TyrunError } from '../errors'
import type { Result, TyrunBaseConfig, TyrunLiteralConfig, TyrunLiteralParts, TyrunLiteralType } from '../types'

export class TyrunLiteralSchema<T extends TyrunLiteralParts> extends TyrunBaseSchema<T, T, TyrunLiteralConfig> implements TyrunLiteralType<T> {
  public override readonly type: 'literal' = 'literal' as const

  constructor(public readonly value: T, config: TyrunBaseConfig<TyrunLiteralConfig, T, T>) {
    super(config)
  }

  public override parse(input: unknown): T {
    try {
      if (input === undefined && this.__config.default !== undefined) return this.runDefault()

      const preprocessed = this.runPreprocessors(input)

      if (this.value !== preprocessed) throw new TyrunError([this.buildIssue(CODES.BASE.TYPE, ERRORS.LITERAL.TYPE(this.value), [], this.__config.error)])

      const issues = this.runValidators(preprocessed as T)
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = this.runProcessors(preprocessed as T)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return this.runFallback()
      throw error
    }
  }
  public override async parseAsync(input: unknown): Promise<T> {
    try {
      if (input === undefined && this.__config.default !== undefined) return await this.runDefaultAsync()

      const preprocessed = await this.runPreprocessorsAsync(input)

      if (this.value !== preprocessed) throw new TyrunError([this.buildIssue(CODES.BASE.TYPE, ERRORS.LITERAL.TYPE(this.value), [], this.__config.error)])

      const issues = await this.runValidatorsAsync(preprocessed as T)
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = await this.runProcessorsAsync(preprocessed as T)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return await this.runFallbackAsync()
      throw error
    }
  }
  public override safeParse(input: unknown): Result<T> {
    try {
      const data = this.parse(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }
  public override async safeParseAsync(input: unknown): Promise<Result<T>> {
    try {
      const data = await this.parseAsync(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }

  public override clone(): TyrunLiteralSchema<T> {
    return new TyrunLiteralSchema(this.value, this.__config)
  }
}
