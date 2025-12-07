import type { Input, InputIntersection, Mutator, Output, OutputIntersection, TyrunBaseType } from '../types'

export interface TyrunAnyType extends TyrunBaseType<any, any> {
  readonly type: 'any'
}

export type TyrunBooleanishConfig = {
  /**
   * Error message to be used when the input type is invalid.
   */
  error: string
  /**
   * String values interpreted as `true`.
   *
   * @default ['y', 'yes', 'true', '1', 'on']
   */
  trueValues: string[]
  /**
   * String values interpreted as `false`.
   *
   * @default ['n', 'no', 'false', '0', 'off']
   */
  falseValues: string[]
}
export interface TyrunBooleanishType extends TyrunBaseType<string, boolean> {
  readonly type: 'booleanish'
  /**
   * List of string values interpreted as `true`.
   */
  readonly trueValues: string[]
  /**
   * List of string values interpreted as `false`.
   */
  readonly falseValues: string[]
}

export interface TyrunUnionType<T extends TyrunBaseType<any, any>[]> extends TyrunBaseType<Input<T[number]>, Output<T[number]>> {
  readonly type: 'union'
  /**
   * Array of candidate schemas evaluated until one succeeds.
   */
  readonly schema: T
}

export interface TyrunIntersectionType<T extends TyrunBaseType<any, any>[]> extends TyrunBaseType<InputIntersection<T>, OutputIntersection<T>> {
  readonly type: 'intersection'
  /**
   * Array of schemas whose results are merged according to intersection rules.
   */
  readonly schema: T
}

export interface TyrunLazyType<T extends TyrunBaseType<any, any>> extends TyrunBaseType<Input<T>, Output<T>> {
  readonly type: 'lazy'
  /**
   * Factory function returning the schema lazily (e.g., for recursive schemas).
   */
  readonly schema: () => T
}

export interface TyrunMutateType<From extends TyrunBaseType<any, any>, To extends TyrunBaseType<any, any>> extends TyrunBaseType<Input<From>, Output<To>> {
  readonly type: 'mutate'
  /**
   * Source schema whose output is the input to the mutation.
   */
  readonly from: From
  /**
   * Target schema that validates the result of the mutation.
   */
  readonly to: To
  /**
   * Mutator function that transforms the output of the source schema into the input of the target schema.
   */
  readonly mutator: Mutator<Output<From>, Input<To>>
}
