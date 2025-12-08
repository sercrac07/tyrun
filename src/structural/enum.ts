import { CODES, ERRORS } from '../constants'
import { TyrunBaseSchema } from '../core/base'
import { TyrunError } from '../errors'
import type { Result, TyrunBaseConfig, TyrunEnumConfig, TyrunEnumParts, TyrunEnumType } from '../types'

export class TyrunEnumSchema<T extends TyrunEnumParts[]> extends TyrunBaseSchema<T[number], T[number], TyrunEnumConfig> implements TyrunEnumType<T> {
  public override readonly type: 'enum' = 'enum' as const

  constructor(public readonly values: [...T], config: TyrunBaseConfig<TyrunEnumConfig, T[number], T[number]>) {
    super(config)
  }

  public override parse(input: unknown): T[number] {
    try {
      if (input === undefined && this.__config.default !== undefined) return this.runDefault()

      const preprocessed = this.runPreprocessors(input)

      if (!this.values.includes(preprocessed as T[number])) throw new TyrunError([this.buildIssue(CODES.BASE.TYPE, ERRORS.ENUM.TYPE(this.values), [], this.__config.error)])

      const issues = this.runValidators(preprocessed as T[number])
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = this.runProcessors(preprocessed as T[number])
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return this.runFallback()
      throw error
    }
  }
  public override async parseAsync(input: unknown): Promise<T[number]> {
    try {
      if (input === undefined && this.__config.default !== undefined) return await this.runDefaultAsync()

      const preprocessed = await this.runPreprocessorsAsync(input)

      if (!this.values.includes(preprocessed as T[number])) throw new TyrunError([this.buildIssue(CODES.BASE.TYPE, ERRORS.ENUM.TYPE(this.values), [], this.__config.error)])

      const issues = await this.runValidatorsAsync(preprocessed as T[number])
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = await this.runProcessorsAsync(preprocessed as T[number])
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return await this.runFallbackAsync()
      throw error
    }
  }
  public override safeParse(input: unknown): Result<T[number]> {
    try {
      const data = this.parse(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }
  public override async safeParseAsync(input: unknown): Promise<Result<T[number]>> {
    try {
      const data = await this.parseAsync(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }

  public override clone(): TyrunEnumSchema<T> {
    return new TyrunEnumSchema(this.values, this.__config)
  }
}
