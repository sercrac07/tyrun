import { CODES, ERRORS } from '../constants'
import { TyrunBaseSchema } from '../core/base'
import { TyrunError } from '../errors'
import type { Input, Issue, Output, Result, TyrunBaseConfig, TyrunBaseType, TyrunTupleConfig, TyrunTupleType } from '../types'

export class TyrunTupleSchema<T extends TyrunBaseType<any, any>[]> extends TyrunBaseSchema<{ [K in keyof T]: Input<T[K]> }, { [K in keyof T]: Output<T[K]> }, TyrunTupleConfig> implements TyrunTupleType<T> {
  public override readonly type: 'tuple' = 'tuple' as const

  constructor(public readonly schema: [...T], config: TyrunBaseConfig<TyrunTupleConfig, { [K in keyof T]: Input<T[K]> }, { [K in keyof T]: Output<T[K]> }>) {
    super(config)
  }

  public override parse(input: unknown): { [K in keyof T]: Output<T[K]> } {
    try {
      if (input === undefined && this.__config.default !== undefined) return this.runDefault()

      const preprocessed = this.runPreprocessors(input)

      if (!Array.isArray(preprocessed)) throw new TyrunError([this.buildIssue(CODES.BASE.TYPE, ERRORS.BASE.TYPE, [], this.__config.error)])

      const output: Output<T[number]>[] = []
      const issues: Issue[] = []

      for (let index = 0; index < this.schema.length; index++) {
        const schema = this.schema[index]
        const result = schema.safeParse(preprocessed[index])
        if (!result.success) issues.push(...result.issues.map(issue => ({ ...issue, path: [index.toString(), ...issue.path] })))
        else output.push(result.data)
      }

      issues.push(...this.runValidators(output as { [K in keyof T]: Output<T[K]> }))
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = this.runProcessors(output as { [K in keyof T]: Output<T[K]> })
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return this.runFallback()
      throw error
    }
  }
  public override async parseAsync(input: unknown): Promise<{ [K in keyof T]: Output<T[K]> }> {
    try {
      if (input === undefined && this.__config.default !== undefined) return await this.runDefaultAsync()

      const preprocessed = await this.runPreprocessorsAsync(input)

      if (!Array.isArray(preprocessed)) throw new TyrunError([this.buildIssue(CODES.BASE.TYPE, ERRORS.BASE.TYPE, [], this.__config.error)])

      const output: Output<T[number]>[] = []
      const issues: Issue[] = []

      for (let index = 0; index < this.schema.length; index++) {
        const schema = this.schema[index]
        const result = await schema.safeParseAsync(preprocessed[index])
        if (!result.success) issues.push(...result.issues.map(issue => ({ ...issue, path: [index.toString(), ...issue.path] })))
        else output.push(result.data)
      }

      issues.push(...(await this.runValidatorsAsync(output as { [K in keyof T]: Output<T[K]> })))
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = await this.runProcessorsAsync(output as { [K in keyof T]: Output<T[K]> })
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return await this.runFallbackAsync()
      throw error
    }
  }
  public override safeParse(input: unknown): Result<{ [K in keyof T]: Output<T[K]> }> {
    try {
      const data = this.parse(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }
  public override async safeParseAsync(input: unknown): Promise<Result<{ [K in keyof T]: Output<T[K]> }>> {
    try {
      const data = await this.parseAsync(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }

  public override clone(): TyrunTupleSchema<T> {
    return new TyrunTupleSchema(this.schema, this.__config)
  }
}
