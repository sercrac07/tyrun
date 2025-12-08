import { TyrunBaseSchema } from '../core/base'
import { TyrunError, TyrunRuntimeError } from '../errors'
import type { Input, Mutator, Output, Result, TyrunBaseConfig, TyrunBaseType, TyrunMutateType } from '../types'

export class TyrunMutateSchema<From extends TyrunBaseType<any, any>, To extends TyrunBaseType<any, any>> extends TyrunBaseSchema<Input<From>, Output<To>, {}> implements TyrunMutateType<From, To> {
  public override readonly type: 'mutate' = 'mutate' as const

  constructor(public readonly from: From, public readonly to: To, public readonly mutator: Mutator<Output<From>, Input<To>>, config: TyrunBaseConfig<{}, Input<From>, Output<To>>) {
    super(config)
  }

  public override parse(input: unknown): Output<To> {
    try {
      if (input === undefined && this.__config.default !== undefined) return this.runDefault()

      const preprocessed = this.runPreprocessors(input)

      const parsedFrom = this.from.parse(preprocessed)
      const mutated = this.mutator(parsedFrom)
      if (mutated instanceof Promise) throw new TyrunRuntimeError('Async mutators must be parsed with an async parser')
      const parsedTo = this.to.parse(mutated)

      const issues = this.runValidators(parsedTo)
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = this.runProcessors(parsedTo)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return this.runFallback()
      throw error
    }
  }
  public override async parseAsync(input: unknown): Promise<Output<To>> {
    try {
      if (input === undefined && this.__config.default !== undefined) return await this.runDefaultAsync()

      const preprocessed = await this.runPreprocessorsAsync(input)

      const parsedFrom = await this.from.parseAsync(preprocessed)
      const mutated = await this.mutator(parsedFrom)
      const parsedTo = await this.to.parseAsync(mutated)

      const issues = await this.runValidatorsAsync(parsedTo)
      if (issues.length > 0) throw new TyrunError(issues)

      const processed = await this.runProcessorsAsync(parsedTo)
      return processed
    } catch (error) {
      if (error instanceof TyrunError && this.__config.fallback !== undefined) return await this.runFallbackAsync()
      throw error
    }
  }
  public override safeParse(input: unknown): Result<Output<To>> {
    try {
      const data = this.parse(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }
  public override async safeParseAsync(input: unknown): Promise<Result<Output<To>>> {
    try {
      const data = await this.parseAsync(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }

  public override clone(): TyrunMutateSchema<From, To> {
    return new TyrunMutateSchema(this.from, this.to, this.mutator, this.__config)
  }
}
