import { TyrunLiteralParts } from './primitives/types'
import { TyrunEnumParts } from './structural/types'

/**
 * Human-readable error messages categorized per schema type.
 * These strings are used to build `Issue.error` messages.
 */
export const ERRORS = {
  BASE: {
    TYPE: 'Invalid type',
    VALIDATOR_ERROR: 'Failed validation',
  },
  STRING: {
    NON_EMPTY: 'String must not be empty',
    MIN: (length: number) => `String must be at least ${length} characters long`,
    MAX: (length: number) => `String must be at most ${length} characters long`,
    REGEX: 'String must match regex pattern',
    EMAIL: 'String must be a valid email address',
    URL: 'String must be a valid URL',
  },
  NUMBER: {
    MIN: (value: number) => `Number must be at least ${value}`,
    MAX: (value: number) => `Number must be at most ${value}`,
    INTEGER: 'Number must be an integer',
    POSITIVE: 'Number must be a positive number',
    NEGATIVE: 'Number must be a negative number',
  },
  BIGINT: {
    MIN: (value: bigint) => `Bigint must be at least ${value}`,
    MAX: (value: bigint) => `Bigint must be at most ${value}`,
    POSITIVE: 'Bigint must be a positive bigint',
    NEGATIVE: 'Bigint must be a negative bigint',
  },
  LITERAL: {
    TYPE: (value: TyrunLiteralParts) => `Literal must be ${value}`,
  },
  DATE: {
    MIN: (value: Date) => `Date must be after ${value.toDateString()}`,
    MAX: (value: Date) => `Date must be before ${value.toDateString()}`,
  },
  ENUM: {
    TYPE: (values: TyrunEnumParts[]) => `Enum must be one of ${values.join(', ')}`,
  },
  ARRAY: {
    NON_EMPTY: 'Array must not be empty',
    MIN: (length: number) => `Array must be at least ${length} elements long`,
    MAX: (length: number) => `Array must be at most ${length} elements long`,
  },
} as const

/**
 * Machine-readable codes categorized per schema type.
 * These strings populate `Issue.code`.
 */
export const CODES = {
  BASE: {
    TYPE: 'invalid_type',
    VALIDATOR_ERROR: 'validator.error',
  },
  STRING: {
    NON_EMPTY: 'string.non_empty',
    MIN: 'string.min',
    MAX: 'string.max',
    REGEX: 'string.regex',
    EMAIL: 'string.email',
    URL: 'string.url',
  },
  NUMBER: {
    MIN: 'number.min',
    MAX: 'number.max',
    INTEGER: 'number.integer',
    POSITIVE: 'number.positive',
    NEGATIVE: 'number.negative',
  },
  BIGINT: {
    MIN: 'bigint.min',
    MAX: 'bigint.max',
    INTEGER: 'bigint.integer',
    POSITIVE: 'bigint.positive',
    NEGATIVE: 'bigint.negative',
  },
  DATE: {
    MIN: 'date.min',
    MAX: 'date.max',
  },
  ARRAY: {
    NON_EMPTY: 'array.non_empty',
    MIN: 'array.min',
    MAX: 'array.max',
  },
} as const

/**
 * Commonly used regular expressions.
 */
export const REGEXES = {
  EMAIL: /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9-]*\.)+[a-z]{2,}$/i,
} as const
