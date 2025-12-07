import { CODES, ERRORS } from '../constants'
import { TyrunBaseSchema } from '../core/base'
import { TyrunError } from '../errors'
import type { InputShape, Issue, OutputShape, Result, TyrunBaseConfig, TyrunBaseType } from '../types'
import type { TyrunObjectConfig } from './types'

export class TyrunObjectSchema<T extends Record<string, TyrunBaseType<any, any>>> extends TyrunBaseSchema<InputShape<T>, OutputShape<T>, TyrunObjectConfig> {
  public readonly type: 'object' = 'object' as const

  constructor(public readonly shape: T, config: TyrunBaseConfig<TyrunObjectConfig, InputShape<T>, OutputShape<T>>) {
    super(config)
  }

  public override parse(input: unknown): OutputShape<T> {
    try {
      if (input === undefined && this.__config.default !== undefined) return this.runDefault()

      const preprocessed = this.runPreprocessors(input)

      if (typeof preprocessed !== 'object' || preprocessed === null || Array.isArray(preprocessed)) throw new TyrunError([this.buildIssue(CODES.BASE.TYPE, ERRORS.BASE.TYPE, [], this.__config.error)])

      const output = {} as OutputShape<T>
      const issues: Issue[] = []

      for (const [key, value] of Object.entries(this.shape)) {
        const result = value.safeParse((preprocessed as Record<string, unknown>)[key])
        if (!result.success) issues.push(...result.issues.map(issue => ({ ...issue, path: [key, ...issue.path] })))
        else output[key as keyof OutputShape<T>] = result.data
      }

      issues.push(...this.runValidators(output))
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = this.runProcessors(output)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return this.runFallback()
      throw error
    }
  }
  public override async parseAsync(input: unknown): Promise<OutputShape<T>> {
    try {
      if (input === undefined && this.__config.default !== undefined) return await this.runDefaultAsync()

      const preprocessed = await this.runPreprocessorsAsync(input)

      if (typeof preprocessed !== 'object' || preprocessed === null || Array.isArray(preprocessed)) throw new TyrunError([this.buildIssue(CODES.BASE.TYPE, ERRORS.BASE.TYPE, [], this.__config.error)])

      const output = {} as OutputShape<T>
      const issues: Issue[] = []

      for (const [key, value] of Object.entries(this.shape)) {
        const result = await value.safeParseAsync((preprocessed as Record<string, unknown>)[key])
        if (!result.success) issues.push(...result.issues.map(issue => ({ ...issue, path: [key, ...issue.path] })))
        else output[key as keyof OutputShape<T>] = result.data
      }

      issues.push(...(await this.runValidatorsAsync(output)))
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = await this.runProcessorsAsync(output)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return await this.runFallbackAsync()
      throw error
    }
  }
  public override safeParse(input: unknown): Result<OutputShape<T>> {
    try {
      const data = this.parse(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }
  public override async safeParseAsync(input: unknown): Promise<Result<OutputShape<T>>> {
    try {
      const data = await this.parseAsync(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }

  public override clone(): TyrunObjectSchema<T> {
    return new TyrunObjectSchema(this.shape, this.__config)
  }
}
