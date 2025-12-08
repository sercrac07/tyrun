import { TyrunBaseSchema } from '../core/base'
import { TyrunError } from '../errors'
import type { Input, Output, Result, TyrunBaseConfig, TyrunBaseType, TyrunLazyType } from '../types'

export class TyrunLazySchema<T extends TyrunBaseType<any, any>> extends TyrunBaseSchema<Input<T>, Output<T>, {}> implements TyrunLazyType<T> {
  public override readonly type: 'lazy' = 'lazy' as const

  constructor(public readonly schema: () => T, config: TyrunBaseConfig<{}, Input<T>, Output<T>>) {
    super(config)
  }

  public override parse(input: unknown): Output<T> {
    try {
      if (input === undefined && this.__config.default !== undefined) return this.runDefault()

      const preprocessed = this.runPreprocessors(input)

      const value = this.schema().parse(preprocessed)

      const issues = this.runValidators(value)
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = this.runProcessors(value)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return this.runFallback()
      throw error
    }
  }
  public override async parseAsync(input: unknown): Promise<Output<T>> {
    try {
      if (input === undefined && this.__config.default !== undefined) return await this.runDefaultAsync()

      const preprocessed = await this.runPreprocessorsAsync(input)

      const value = await this.schema().parseAsync(preprocessed)

      const issues = await this.runValidatorsAsync(value)
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = await this.runProcessorsAsync(value)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return await this.runFallbackAsync()
      throw error
    }
  }
  public override safeParse(input: unknown): Result<Output<T>> {
    try {
      const data = this.parse(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }
  public override async safeParseAsync(input: unknown): Promise<Result<Output<T>>> {
    try {
      const data = await this.parseAsync(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }

  public override clone(): TyrunLazySchema<T> {
    return new TyrunLazySchema(this.schema, this.__config)
  }
}
