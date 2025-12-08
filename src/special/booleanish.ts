import { CODES, ERRORS } from '../constants'
import { TyrunBaseSchema } from '../core/base'
import { TyrunError } from '../errors'
import type { Result, TyrunBaseConfig, TyrunBooleanishConfig, TyrunBooleanishType } from '../types'

export class TyrunBooleanishSchema extends TyrunBaseSchema<string, boolean, TyrunBooleanishConfig> implements TyrunBooleanishType {
  public override readonly type: 'booleanish' = 'booleanish' as const
  public readonly trueValues: string[]
  public readonly falseValues: string[]

  constructor(config: TyrunBaseConfig<TyrunBooleanishConfig, string, boolean>) {
    super(config)
    this.trueValues = config.trueValues
    this.falseValues = config.falseValues
  }

  public override parse(input: unknown): boolean {
    try {
      if (input === undefined && this.__config.default !== undefined) return this.runDefault()

      const preprocessed = this.runPreprocessors(input)

      if (typeof preprocessed !== 'string') throw new TyrunError([this.buildIssue(CODES.BASE.TYPE, ERRORS.BASE.TYPE, [], this.__config.error)])

      let value: boolean | null = null
      if (this.trueValues.includes(preprocessed.trim().toLowerCase())) value = true
      else if (this.falseValues.includes(preprocessed.trim().toLowerCase())) value = false

      if (typeof value !== 'boolean') throw new TyrunError([this.buildIssue(CODES.BASE.TYPE, ERRORS.BASE.TYPE, [], this.__config.error)])

      const issues = this.runValidators(value)
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = this.runProcessors(value)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return this.runFallback()
      throw error
    }
  }
  public override async parseAsync(input: unknown): Promise<boolean> {
    try {
      if (input === undefined && this.__config.default !== undefined) return await this.runDefaultAsync()

      const preprocessed = await this.runPreprocessorsAsync(input)

      if (typeof preprocessed !== 'string') throw new TyrunError([this.buildIssue(CODES.BASE.TYPE, ERRORS.BASE.TYPE, [], this.__config.error)])

      let value: boolean | null = null
      if (this.trueValues.includes(preprocessed.trim().toLowerCase())) value = true
      else if (this.falseValues.includes(preprocessed.trim().toLowerCase())) value = false

      if (typeof value !== 'boolean') throw new TyrunError([this.buildIssue(CODES.BASE.TYPE, ERRORS.BASE.TYPE, [], this.__config.error)])

      const issues = await this.runValidatorsAsync(value)
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = await this.runProcessorsAsync(value)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return await this.runFallbackAsync()
      throw error
    }
  }
  public override safeParse(input: unknown): Result<boolean> {
    try {
      const data = this.parse(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }
  public override async safeParseAsync(input: unknown): Promise<Result<boolean>> {
    try {
      const data = await this.parseAsync(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }

  public override clone(): TyrunBooleanishSchema {
    return new TyrunBooleanishSchema(this.__config)
  }
}
