import type { ErrorConfig, TyrunBaseType } from '../types'

export type TyrunStringConfig = {
  /**
   * Error message to be used when the input type is invalid.
   */
  error: string
}
export interface TyrunStringType extends TyrunBaseType<string, string> {
  readonly type: 'string'
  /**
   * Ensures string is nom-empty.
   * The string is considered empty if it is an empty string or only contains whitespace characters.
   */
  nonEmpty(error?: string | ErrorConfig): this
  /**
   * Ensures string length is at least `length`.
   */
  min(length: number, error?: string | ErrorConfig): this
  /**
   * Ensures string length is at most `length`.
   */
  max(length: number, error?: string | ErrorConfig): this
  /**
   * Ensures string matches the provided regex pattern.
   */
  regex(pattern: RegExp, error?: string | ErrorConfig): this
  /**
   * Ensures string is a valid email address.
   */
  email(error?: string | ErrorConfig<{ pattern?: RegExp }>): this
  /**
   * Ensures string is a valid URL.
   */
  url(error?: string | ErrorConfig): this
}

export type TyrunNumberConfig = {
  /**
   * Error message to be used when the input type is invalid.
   */
  error: string
}
export interface TyrunNumberType extends TyrunBaseType<number, number> {
  readonly type: 'number'
  /**
   * Ensures number is greater than or equal to `value`.
   */
  min(value: number, error?: string | ErrorConfig): this
  /**
   * Ensures number is less than or equal to `value`.
   */
  max(value: number, error?: string | ErrorConfig): this
  /**
   * Ensures number is an integer.
   */
  integer(error?: string | ErrorConfig): this
  /**
   * Ensures number is strictly greater than `0`.
   */
  positive(error?: string | ErrorConfig): this
  /**
   * Ensures number is strictly less than `0`.
   */
  negative(error?: string | ErrorConfig): this
}

export type TyrunBigintConfig = {
  /**
   * Error message to be used when the input type is invalid.
   */
  error: string
}
export interface TyrunBigintType extends TyrunBaseType<bigint, bigint> {
  readonly type: 'bigint'
  /**
   * Ensures bigint is greater than or equal to `value`.
   */
  min(value: bigint, error?: string | ErrorConfig): this
  /**
   * Ensures bigint is less than or equal to `value`.
   */
  max(value: bigint, error?: string | ErrorConfig): this
  /**
   * Ensures bigint is strictly greater than `0n`.
   */
  positive(error?: string | ErrorConfig): this
  /**
   * Ensures bigint is strictly less than `0n`.
   */
  negative(error?: string | ErrorConfig): this
}

export type TyrunBooleanConfig = {
  /**
   * Error message to be used when the input type is invalid.
   */
  error: string
}
export interface TyrunBooleanType extends TyrunBaseType<boolean, boolean> {
  readonly type: 'boolean'
}

export type TyrunSymbolConfig = {
  /**
   * Error message to be used when the input type is invalid.
   */
  error: string
}
export interface TyrunSymbolType extends TyrunBaseType<symbol, symbol> {
  readonly type: 'symbol'
}

export type TyrunUndefinedConfig = {
  /**
   * Error message to be used when the input type is invalid.
   */
  error: string
}
export interface TyrunUndefinedType extends TyrunBaseType<undefined, undefined> {
  readonly type: 'undefined'
}

export type TyrunNullConfig = {
  /**
   * Error message to be used when the input type is invalid.
   */
  error: string
}
export interface TyrunNullType extends TyrunBaseType<null, null> {
  readonly type: 'null'
}

export type TyrunLiteralConfig = {
  /**
   * Error message to be used when the input type is invalid.
   */
  error: string
}
export type TyrunLiteralParts = string | number | bigint | boolean
export interface TyrunLiteralType<T extends TyrunLiteralParts> extends TyrunBaseType<T, T> {
  readonly type: 'literal'
  /**
   * Literal value enforced by this schema.
   */
  readonly value: T
}

export type TyrunDateConfig = {
  /**
   * Error message to be used when the input type is invalid.
   */
  error: string
}
export interface TyrunDateType extends TyrunBaseType<Date, Date> {
  readonly type: 'date'
  /**
   * Ensures date is greater than or equal to `value`
   */
  min(value: Date, error?: string | ErrorConfig): this
  /**
   * Ensures date is less than or equal to `value`.
   */
  max(value: Date, error?: string | ErrorConfig): this
}

export type TyrunFileConfig = {
  /**
   * Error message to be used when the input type is invalid.
   */
  error: string
}
export interface TyrunFileType extends TyrunBaseType<File, File> {
  readonly type: 'file'
  /**
   * Ensures file size is greater than or equal to `bytes`.
   */
  min(bytes: number, error?: string | ErrorConfig): this
  /**
   * Ensures file size is less than or equal to `bytes`.
   */
  max(bytes: number, error?: string | ErrorConfig): this
  /**
   * Ensures file type is one of the provided mime types.
   */
  mime(mimeTypes: string[], error?: string | ErrorConfig): this
}
