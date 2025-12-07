import { CODES, ERRORS } from '../constants'
import { TyrunBaseSchema } from '../core/base'
import { TyrunError } from '../errors'
import type { Result, TyrunBaseConfig } from '../types'
import type { TyrunUndefinedConfig, TyrunUndefinedType } from './types'

export class TyrunUndefinedSchema extends TyrunBaseSchema<undefined, undefined, TyrunUndefinedConfig> implements TyrunUndefinedType {
  public readonly type: 'undefined' = 'undefined' as const

  constructor(config: TyrunBaseConfig<TyrunUndefinedConfig, undefined, undefined>) {
    super(config)
  }

  public override parse(input: unknown): undefined {
    try {
      if (input === undefined && this.__config.default !== undefined) return this.runDefault()

      const preprocessed = this.runPreprocessors(input)

      if (preprocessed !== undefined) throw new TyrunError([this.buildIssue(CODES.BASE.TYPE, ERRORS.BASE.TYPE, [], this.__config.error)])

      const issues = this.runValidators(preprocessed)
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = this.runProcessors(preprocessed)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return this.runFallback()
      throw error
    }
  }
  public override async parseAsync(input: unknown): Promise<undefined> {
    try {
      if (input === undefined && this.__config.default !== undefined) return await this.runDefaultAsync()

      const preprocessed = await this.runPreprocessorsAsync(input)

      if (preprocessed !== undefined) throw new TyrunError([this.buildIssue(CODES.BASE.TYPE, ERRORS.BASE.TYPE, [], this.__config.error)])

      const issues = await this.runValidatorsAsync(preprocessed)
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = await this.runProcessorsAsync(preprocessed)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return await this.runFallbackAsync()
      throw error
    }
  }
  public override safeParse(input: unknown): Result<undefined> {
    try {
      const data = this.parse(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }
  public override async safeParseAsync(input: unknown): Promise<Result<undefined>> {
    try {
      const data = await this.parseAsync(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }

  public override clone(): TyrunUndefinedSchema {
    return new TyrunUndefinedSchema(this.__config)
  }
}
