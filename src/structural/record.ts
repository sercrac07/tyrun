import { CODES, ERRORS } from '../constants'
import { TyrunBaseSchema } from '../core/base'
import { TyrunError } from '../errors'
import type { Input, Issue, Output, Result, TyrunBaseConfig, TyrunBaseType } from '../types'
import type { TyrunRecordConfig, TyrunRecordType } from './types'

export class TyrunRecordSchema<Key extends TyrunBaseType<any, string>, Value extends TyrunBaseType<any, any>> extends TyrunBaseSchema<Record<Input<Key>, Input<Value>>, Record<Output<Key>, Output<Value>>, TyrunRecordConfig> implements TyrunRecordType<Key, Value> {
  public readonly type: 'record' = 'record' as const

  constructor(public readonly key: Key, public readonly value: Value, config: TyrunBaseConfig<TyrunRecordConfig, Record<Input<Key>, Input<Value>>, Record<Output<Key>, Output<Value>>>) {
    super(config)
  }

  public override parse(input: unknown): Record<Output<Key>, Output<Value>> {
    try {
      if (input === undefined && this.__config.default !== undefined) return this.runDefault()

      const preprocessed = this.runPreprocessors(input)

      if (typeof preprocessed !== 'object' || preprocessed === null || Array.isArray(preprocessed)) throw new TyrunError([this.buildIssue(CODES.BASE.TYPE, ERRORS.BASE.TYPE, [], this.__config.error)])

      const output = {} as Record<Output<Key>, Output<Value>>
      const issues: Issue[] = []

      for (const [key, value] of Object.entries(preprocessed)) {
        const keyResult = this.key.safeParse(key)
        const valueResult = this.value.safeParse(value)

        if (!keyResult.success || !valueResult.success) {
          if (!keyResult.success) issues.push(...keyResult.issues)
          if (!valueResult.success) issues.push(...valueResult.issues)
        } else output[keyResult.data as Output<Key>] = valueResult.data
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
  public override async parseAsync(input: unknown): Promise<Record<Output<Key>, Output<Value>>> {
    try {
      if (input === undefined && this.__config.default !== undefined) return await this.runDefaultAsync()

      const preprocessed = await this.runPreprocessorsAsync(input)

      if (typeof preprocessed !== 'object' || preprocessed === null || Array.isArray(preprocessed)) throw new TyrunError([this.buildIssue(CODES.BASE.TYPE, ERRORS.BASE.TYPE, [], this.__config.error)])

      const output = {} as Record<Output<Key>, Output<Value>>
      const issues: Issue[] = []

      for (const [key, value] of Object.entries(preprocessed)) {
        const keyResult = await this.key.safeParseAsync(key)
        const valueResult = await this.value.safeParseAsync(value)

        if (!keyResult.success || !valueResult.success) {
          if (!keyResult.success) issues.push(...keyResult.issues)
          if (!valueResult.success) issues.push(...valueResult.issues)
        } else output[keyResult.data as Output<Key>] = valueResult.data
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
  public override safeParse(input: unknown): Result<Record<Output<Key>, Output<Value>>> {
    try {
      const data = this.parse(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }
  public override async safeParseAsync(input: unknown): Promise<Result<Record<Output<Key>, Output<Value>>>> {
    try {
      const data = await this.parseAsync(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }

  public override clone(): TyrunRecordSchema<Key, Value> {
    return new TyrunRecordSchema(this.key, this.value, this.__config)
  }
}
