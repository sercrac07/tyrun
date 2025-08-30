import { ArraySchema } from './array'
import { BooleanSchema } from './boolean'
import { EnumSchema } from './enum'
import { NumberSchema } from './number'
import { ObjectSchema } from './object'
import { StringSchema } from './string'
import type { T } from './types'

export type { Infer, ParseResult } from './types'

export const t: T = {
  string: message => new StringSchema(message),
  number: message => new NumberSchema(message),
  boolean: message => new BooleanSchema(message),
  object: (schema, message) => new ObjectSchema(schema, message),
  array: (schema, message) => new ArraySchema(schema, message),
  enum: (schema, message) => new EnumSchema(schema, message),
}
