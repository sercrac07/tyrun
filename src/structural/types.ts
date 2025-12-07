import { Input, Output, TyrunBaseType } from '../types'

export type TyrunEnumConfig = {
  /**
   * Error message to be used when the input type is invalid.
   */
  error: string
}
export type TyrunEnumParts = string | number
export interface TyrunEnumType<T extends TyrunEnumParts[]> extends TyrunBaseType<T[number], T[number]> {
  readonly type: 'enum'
  /**
   * Allowed enum values.
   */
  readonly values: T
}

export type TyrunArrayConfig = {
  /**
   * Error message to be used when the input type is invalid.
   */
  error: string
}
export interface TyrunArrayType<T extends TyrunBaseType<any, any>> extends TyrunBaseType<Input<T>[], Output<T>[]> {
  readonly type: 'array'
  /**
   * Element schema applied to every item in the array.
   */
  readonly schema: T
  /**
   * Ensures array is non-empty.
   */
  nonEmpty(error?: string): this
  /**
   * Ensures array length is at least `length`.
   */
  min(length: number, error?: string): this
  /**
   * Ensures array length is at most `length`.
   */
  max(length: number, error?: string): this
}

export type TyrunObjectConfig = {
  /**
   * Error message to be used when the input type is invalid.
   */
  error: string
}
export interface TyrunObjectType<T extends Record<string, TyrunBaseType<any, any>>> extends TyrunBaseType<{ [K in keyof T]: Input<T[K]> }, { [K in keyof T]: Output<T[K]> }> {
  readonly type: 'object'
  /**
   * Object shape definition: maps each key to its corresponding schema type.
   */
  readonly shape: T
}

export type TyrunRecordConfig = {
  /**
   * Error message to be used when the input type is invalid.
   */
  error: string
}
export interface TyrunRecordType<Key extends TyrunBaseType<any, string>, Value extends TyrunBaseType<any, any>> extends TyrunBaseType<Record<Input<Key>, Input<Value>>, Record<Output<Key>, Output<Value>>> {
  readonly type: 'record'
  /**
   * Key schema applied to every key in the record.
   */
  readonly key: Key
  /**
   * Value schema applied to every value in the record.
   */
  readonly value: Value
}

export type TyrunTupleConfig = {
  /**
   * Error message to be used when the input type is invalid.
   */
  error: string
}
export interface TyrunTupleType<T extends TyrunBaseType<any, any>[]> extends TyrunBaseType<{ [K in keyof T]: Input<T[K]> }, { [K in keyof T]: Output<T[K]> }> {
  readonly type: 'tuple'
  /**
   * Tuple schema: array of schemas for each tuple element.
   */
  readonly schema: T
}
