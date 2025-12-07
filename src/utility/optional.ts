import { TyrunBaseSchema } from '../core/base'
import { TyrunError } from '../errors'
import type { Input, Output, Result, TyrunBaseConfig, TyrunBaseType } from '../types'
import type { TyrunOptionalType } from './types'

export class TyrunOptionalSchema<T extends TyrunBaseType<any, any>> extends TyrunBaseSchema<Input<T> | undefined, Output<T> | undefined, {}> implements TyrunOptionalType<T> {
  readonly type: 'optional' = 'optional' as const

  constructor(public readonly schema: T, config: TyrunBaseConfig<{}, Input<T> | undefined, Output<T> | undefined>) {
    super(config)
  }

  public override parse(input: unknown): Output<T> | undefined {
    try {
      if (input === undefined && this.__config.default !== undefined) return this.runDefault()

      const preprocessed = this.runPreprocessors(input)

      const result = this.schema.safeParse(preprocessed)
      if (!result.success && preprocessed !== undefined) throw new TyrunError(result.issues)

      const value = result.success ? result.data : undefined

      const issues = this.runValidators(value)
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = this.runProcessors(value)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return this.runFallback()
      throw error
    }
  }
  public override async parseAsync(input: unknown): Promise<Output<T> | undefined> {
    try {
      if (input === undefined && this.__config.default !== undefined) return await this.runDefaultAsync()

      const preprocessed = await this.runPreprocessorsAsync(input)

      const result = await this.schema.safeParseAsync(preprocessed)
      if (!result.success && preprocessed !== undefined) throw new TyrunError(result.issues)

      const value = result.success ? result.data : undefined

      const issues = await this.runValidatorsAsync(value)
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = await this.runProcessorsAsync(value)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return await this.runFallbackAsync()
      throw error
    }
  }
  public override safeParse(input: unknown): Result<Output<T> | undefined> {
    try {
      const data = this.parse(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }
  public override async safeParseAsync(input: unknown): Promise<Result<Output<T> | undefined>> {
    try {
      const data = await this.parseAsync(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }

  public override clone(): TyrunOptionalSchema<T> {
    return new TyrunOptionalSchema(this.schema, this.__config)
  }
}
