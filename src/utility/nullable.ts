import { TyrunBaseSchema } from '../core/base'
import { TyrunError } from '../errors'
import type { Input, Output, Result, TyrunBaseConfig, TyrunBaseType } from '../types'
import type { TyrunNullableType } from './types'

export class TyrunNullableSchema<T extends TyrunBaseType<any, any>> extends TyrunBaseSchema<Input<T> | null, Output<T> | null, {}> implements TyrunNullableType<T> {
  readonly type: 'nullable' = 'nullable' as const

  constructor(public readonly schema: T, config: TyrunBaseConfig<{}, Input<T> | null, Output<T> | null>) {
    super(config)
  }

  public override parse(input: unknown): Output<T> | null {
    try {
      if (input === undefined && this.__config.default !== undefined) return this.runDefault()

      const preprocessed = this.runPreprocessors(input)

      const result = this.schema.safeParse(preprocessed)
      if (!result.success && preprocessed !== null) throw new TyrunError(result.issues)

      const value = result.success ? result.data : null

      const issues = this.runValidators(value)
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = this.runProcessors(value)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return this.runFallback()
      throw error
    }
  }
  public override async parseAsync(input: unknown): Promise<Output<T> | null> {
    try {
      if (input === undefined && this.__config.default !== undefined) return await this.runDefaultAsync()

      const preprocessed = await this.runPreprocessorsAsync(input)

      const result = await this.schema.safeParseAsync(preprocessed)
      if (!result.success && preprocessed !== null) throw new TyrunError(result.issues)

      const value = result.success ? result.data : null

      const issues = await this.runValidatorsAsync(value)
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = await this.runProcessorsAsync(value)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return await this.runFallbackAsync()
      throw error
    }
  }
  public override safeParse(input: unknown): Result<Output<T> | null> {
    try {
      const data = this.parse(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }
  public override async safeParseAsync(input: unknown): Promise<Result<Output<T> | null>> {
    try {
      const data = await this.parseAsync(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }

  public override clone(): TyrunNullableSchema<T> {
    return new TyrunNullableSchema(this.schema, this.__config)
  }
}
