import { ERRORS } from './constants'
import { TyrunBigintSchema } from './primitives/bigint'
import { TyrunBooleanSchema } from './primitives/boolean'
import { TyrunDateSchema } from './primitives/date'
import { TyrunLiteralSchema } from './primitives/literal'
import { TyrunNullSchema } from './primitives/null'
import { TyrunNumberSchema } from './primitives/number'
import { TyrunStringSchema } from './primitives/string'
import { TyrunSymbolSchema } from './primitives/symbol'
import type { TyrunLiteralParts } from './primitives/types'
import { TyrunUndefinedSchema } from './primitives/undefined'
import { TyrunAnySchema } from './special/any'
import { TyrunBooleanishSchema } from './special/booleanish'
import { TyrunIntersectionSchema } from './special/intersection'
import { TyrunLazySchema } from './special/lazy'
import { TyrunMutateSchema } from './special/mutate'
import { TyrunUnionSchema } from './special/union'
import { TyrunArraySchema } from './structural/array'
import { TyrunEnumSchema } from './structural/enum'
import { TyrunObjectSchema } from './structural/object'
import { TyrunRecordSchema } from './structural/record'
import { TyrunTupleSchema } from './structural/tuple'
import type { TyrunEnumParts } from './structural/types'
import { Input, Mutator, Output, TyrunBaseType, TyrunBooleanishConfig } from './types'
import { TyrunNullableSchema } from './utility/nullable'
import { TyrunNullishSchema } from './utility/nullish'
import { TyrunOptionalSchema } from './utility/optional'

/**
 * Creates a string primitive schema.
 */
export function string(error: string = ERRORS.BASE.TYPE) {
  return new TyrunStringSchema({ error, default: undefined, fallback: undefined, validators: [], processors: [], preprocessors: [] })
}
/**
 * Creates a number primitive schema.
 */
export function number(error: string = ERRORS.BASE.TYPE) {
  return new TyrunNumberSchema({ error, default: undefined, fallback: undefined, validators: [], processors: [], preprocessors: [] })
}
/**
 * Creates a bigint primitive schema.
 */
export function bigint(error: string = ERRORS.BASE.TYPE) {
  return new TyrunBigintSchema({ error, default: undefined, fallback: undefined, validators: [], processors: [], preprocessors: [] })
}
/**
 * Creates a boolean primitive schema.
 */
export function boolean(error: string = ERRORS.BASE.TYPE) {
  return new TyrunBooleanSchema({ error, default: undefined, fallback: undefined, validators: [], processors: [], preprocessors: [] })
}
/**
 * Creates a symbol primitive schema.
 */
export function symbol(error: string = ERRORS.BASE.TYPE) {
  return new TyrunSymbolSchema({ error, default: undefined, fallback: undefined, validators: [], processors: [], preprocessors: [] })
}
/**
 * Creates an undefined primitive schema.
 */
function _undefined(error: string = ERRORS.BASE.TYPE) {
  return new TyrunUndefinedSchema({ error, default: undefined, fallback: undefined, validators: [], processors: [], preprocessors: [] })
}
/**
 * Creates a null primitive schema.
 */
function _null(error: string = ERRORS.BASE.TYPE) {
  return new TyrunNullSchema({ error, default: undefined, fallback: undefined, validators: [], processors: [], preprocessors: [] })
}
/**
 * Creates a literal primitive schema enforcing a specified value.
 */
export function literal<T extends TyrunLiteralParts>(value: T, error: string = ERRORS.LITERAL.TYPE(value)) {
  return new TyrunLiteralSchema(value, { error, default: undefined, fallback: undefined, validators: [], processors: [], preprocessors: [] })
}
/**
 * Creates a date primitive schema.
 */
export function date(error: string = ERRORS.BASE.TYPE) {
  return new TyrunDateSchema({ error, default: undefined, fallback: undefined, validators: [], processors: [], preprocessors: [] })
}

/**
 * Creates an enum schema from provided values.
 */
function _enum<T extends TyrunEnumParts[]>(values: [...T], error: string = ERRORS.ENUM.TYPE(values)) {
  return new TyrunEnumSchema(values, { error, default: undefined, fallback: undefined, validators: [], processors: [], preprocessors: [] })
}
/**
 * Creates an array schema with the given element schema.
 */
export function array<T extends TyrunBaseType<any, any>>(schema: T, error: string = ERRORS.BASE.TYPE) {
  return new TyrunArraySchema(schema, { error, default: undefined, fallback: undefined, validators: [], processors: [], preprocessors: [] })
}
/**
 * Creates an object schema from a shape map.
 */
export function object<T extends Record<string, TyrunBaseType<any, any>>>(shape: T, error: string = ERRORS.BASE.TYPE) {
  return new TyrunObjectSchema(shape, { error, default: undefined, fallback: undefined, validators: [], processors: [], preprocessors: [] })
}
/**
 * Creates a record schema from key and value schemas.
 */
export function record<Key extends TyrunBaseType<any, string>, Value extends TyrunBaseType<any, any>>(key: Key, value: Value, error: string = ERRORS.BASE.TYPE) {
  return new TyrunRecordSchema(key, value, { error, default: undefined, fallback: undefined, validators: [], processors: [], preprocessors: [] })
}
/**
 * Creates a tuple schema from an array of schemas.
 */
export function tuple<T extends TyrunBaseType<any, any>[]>(schema: [...T], error: string = ERRORS.BASE.TYPE) {
  return new TyrunTupleSchema(schema, { error, default: undefined, fallback: undefined, validators: [], processors: [], preprocessors: [] })
}

/**
 * Creates an `any` schema honoring pipelines (validators/processors/preprocessors).
 */
export function any() {
  return new TyrunAnySchema({ default: undefined, fallback: undefined, validators: [], processors: [], preprocessors: [] })
}
/**
 * Creates a `booleanish` schema that coerces strings to booleans.
 */
export function booleanish(error: string | Partial<TyrunBooleanishConfig> = ERRORS.BASE.TYPE) {
  const config: TyrunBooleanishConfig = { error: ERRORS.BASE.TYPE, trueValues: ['y', 'yes', 'true', '1', 'on'], falseValues: ['n', 'no', 'false', '0', 'off'], ...(typeof error === 'string' ? { error } : error) }
  return new TyrunBooleanishSchema({ ...config, default: undefined, fallback: undefined, validators: [], processors: [], preprocessors: [] })
}
/**
 * Creates a union schema from multiple schemas.
 */
export function union<T extends TyrunBaseType<any, any>[]>(schema: [...T]) {
  return new TyrunUnionSchema(schema, { default: undefined, fallback: undefined, validators: [], processors: [], preprocessors: [] })
}
/**
 * Creates an intersection schema from multiple schemas.
 */
export function intersection<T extends TyrunBaseType<any, any>[]>(schema: [...T]) {
  return new TyrunIntersectionSchema(schema, { default: undefined, fallback: undefined, validators: [], processors: [], preprocessors: [] })
}
/**
 * Creates a lazy schema factory, useful for recursive schemas.
 */
export function lazy<T extends TyrunBaseType<any, any>>(schema: () => T) {
  return new TyrunLazySchema(schema, { default: undefined, fallback: undefined, validators: [], processors: [], preprocessors: [] })
}
/**
 * Creates a mutate schema that maps output of `from` into input of `to`.
 */
export function mutate<From extends TyrunBaseType<any, any>, To extends TyrunBaseType<any, any>>(from: From, to: To, mutator: Mutator<Output<From>, Input<To>>) {
  return new TyrunMutateSchema(from, to, mutator, { default: undefined, fallback: undefined, validators: [], processors: [], preprocessors: [] })
}

/**
 * Wraps a schema to accept `undefined` and produce `undefined`.
 */
export function optional<T extends TyrunBaseType<any, any>>(schema: T) {
  return new TyrunOptionalSchema(schema, { default: undefined, fallback: undefined, validators: [], processors: [], preprocessors: [] })
}
/**
 * Wraps a schema to accept `null` and produce `null`.
 */
export function nullable<T extends TyrunBaseType<any, any>>(schema: T) {
  return new TyrunNullableSchema(schema, { default: undefined, fallback: undefined, validators: [], processors: [], preprocessors: [] })
}
/**
 * Wraps a schema to accept `null | undefined` and produce `null | undefined`.
 */
export function nullish<T extends TyrunBaseType<any, any>>(schema: T) {
  return new TyrunNullishSchema(schema, { default: undefined, fallback: undefined, validators: [], processors: [], preprocessors: [] })
}

// Named exports for factory functions
export { _enum as enum, _null as null, _undefined as undefined }
