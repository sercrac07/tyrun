import { TyrunBaseSchema } from '../core/base'
import { TyrunError } from '../errors'
import type { Result, TyrunBaseConfig } from '../types'
import type { TyrunAnyType } from './types'

export class TyrunAnySchema extends TyrunBaseSchema<any, any, {}> implements TyrunAnyType {
  public readonly type: 'any' = 'any' as const

  constructor(config: TyrunBaseConfig<{}, any, any>) {
    super(config)
  }

  public override parse(input: unknown): any {
    try {
      if (input === undefined && this.__config.default !== undefined) return this.runDefault()

      const preprocessed = this.runPreprocessors(input)

      const issues = this.runValidators(preprocessed)
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = this.runProcessors(preprocessed)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return this.runFallback()
      throw error
    }
  }
  public override async parseAsync(input: unknown): Promise<any> {
    try {
      if (input === undefined && this.__config.default !== undefined) return await this.runDefaultAsync()

      const preprocessed = await this.runPreprocessorsAsync(input)

      const issues = await this.runValidatorsAsync(preprocessed)
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = await this.runProcessorsAsync(preprocessed)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return await this.runFallbackAsync()
      throw error
    }
  }
  public override safeParse(input: unknown): Result<any> {
    try {
      const data = this.parse(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }
  public override async safeParseAsync(input: unknown): Promise<Result<any>> {
    try {
      const data = await this.parseAsync(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }

  public override clone(): TyrunAnySchema {
    return new TyrunAnySchema(this.__config)
  }
}
