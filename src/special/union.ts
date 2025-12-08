import { TyrunBaseSchema } from '../core/base'
import { TyrunError } from '../errors'
import type { Input, Issue, Output, Result, TyrunBaseConfig, TyrunBaseType, TyrunUnionType } from '../types'

export class TyrunUnionSchema<T extends TyrunBaseType<any, any>[]> extends TyrunBaseSchema<Input<T[number]>, Output<T[number]>, {}> implements TyrunUnionType<T> {
  public override readonly type: 'union' = 'union' as const

  constructor(public readonly schema: [...T], config: TyrunBaseConfig<{}, Input<T[number]>, Output<T[number]>>) {
    super(config)
  }

  public override parse(input: unknown): Output<T[number]> {
    try {
      if (input === undefined && this.__config.default !== undefined) return this.runDefault()

      const preprocessed = this.runPreprocessors(input)

      const issues: Issue[] = []

      for (const schema of this.schema) {
        const result = schema.safeParse(preprocessed)
        if (!result.success) issues.push(...result.issues)
        else {
          const newIssues = this.runValidators(result.data)
          if (newIssues.length > 0) issues.push(...newIssues)
          else {
            const processed = this.runProcessors(result.data)
            return processed
          }
        }
      }

      throw new TyrunError(issues)
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return this.runFallback()
      throw error
    }
  }
  public override async parseAsync(input: unknown): Promise<Output<T[number]>> {
    try {
      if (input === undefined && this.__config.default !== undefined) return await this.runDefaultAsync()

      const preprocessed = await this.runPreprocessorsAsync(input)

      const issues: Issue[] = []

      for (const schema of this.schema) {
        const result = await schema.safeParseAsync(preprocessed)
        if (!result.success) issues.push(...result.issues)
        else {
          const newIssues = await this.runValidatorsAsync(result.data)
          if (newIssues.length > 0) issues.push(...newIssues)
          else {
            const processed = await this.runProcessorsAsync(result.data)
            return processed
          }
        }
      }

      throw new TyrunError(issues)
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return await this.runFallbackAsync()
      throw error
    }
  }
  public override safeParse(input: unknown): Result<Output<T[number]>> {
    try {
      const data = this.parse(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }
  public override async safeParseAsync(input: unknown): Promise<Result<Output<T[number]>>> {
    try {
      const data = await this.parseAsync(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }

  public override clone(): TyrunUnionSchema<T> {
    return new TyrunUnionSchema(this.schema, this.__config)
  }
}
