import { TyrunBaseSchema } from '../core/base'
import { TyrunError } from '../errors'
import type { InputIntersection, Issue, OutputIntersection, Result, TyrunBaseConfig, TyrunBaseType, TyrunIntersectionType } from '../types'

export class TyrunIntersectionSchema<T extends TyrunBaseType<any, any>[]> extends TyrunBaseSchema<InputIntersection<T>, OutputIntersection<T>, {}> implements TyrunIntersectionType<T> {
  public override readonly type: 'intersection' = 'intersection' as const

  constructor(public readonly schema: [...T], config: TyrunBaseConfig<{}, InputIntersection<T>, OutputIntersection<T>>) {
    super(config)
  }

  public override parse(input: unknown): OutputIntersection<T> {
    try {
      if (input === undefined && this.__config.default !== undefined) return this.runDefault()

      const preprocessed = this.runPreprocessors(input)

      const issues: Issue[] = []
      let merged = {} as OutputIntersection<T>
      let hasMerged = false

      for (const schema of this.schema) {
        const result = schema.safeParse(preprocessed)
        if (!result.success) issues.push(...result.issues)
        else {
          if (typeof result.data === 'object' && result.data !== null && !Array.isArray(result.data)) {
            merged = hasMerged ? { ...(merged as {}), ...result.data } : result.data
            hasMerged = true
          } else {
            merged = result.data
            hasMerged = true
          }
        }
      }

      issues.push(...this.runValidators(merged))
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = this.runProcessors(merged)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return this.runFallback()
      throw error
    }
  }
  public override async parseAsync(input: unknown): Promise<OutputIntersection<T>> {
    try {
      if (input === undefined && this.__config.default !== undefined) return await this.runDefaultAsync()

      const preprocessed = await this.runPreprocessorsAsync(input)

      const issues: Issue[] = []
      let merged = {} as OutputIntersection<T>
      let hasMerged = false

      for (const schema of this.schema) {
        const result = await schema.safeParseAsync(preprocessed)
        if (!result.success) issues.push(...result.issues)
        else {
          if (typeof result.data === 'object' && result.data !== null && !Array.isArray(result.data)) {
            merged = hasMerged ? { ...(merged as {}), ...result.data } : result.data
            hasMerged = true
          } else {
            merged = result.data
            hasMerged = true
          }
        }
      }

      issues.push(...(await this.runValidatorsAsync(merged)))
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = await this.runProcessorsAsync(merged)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return await this.runFallbackAsync()
      throw error
    }
  }
  public override safeParse(input: unknown): Result<OutputIntersection<T>> {
    try {
      const data = this.parse(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }
  public override async safeParseAsync(input: unknown): Promise<Result<OutputIntersection<T>>> {
    try {
      const data = await this.parseAsync(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }

  public override clone(): TyrunIntersectionSchema<T> {
    return new TyrunIntersectionSchema(this.schema, this.__config)
  }
}
