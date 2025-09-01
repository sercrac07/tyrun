import { ArraySchema } from './array'
import { BooleanSchema } from './boolean'
import { EnumSchema } from './enum'
import { NumberSchema } from './number'
import { ObjectSchema } from './object'
import { RecordSchema } from './record'
import { StringSchema } from './string'
import type { T } from './types'
import { UnionSchema } from './union'

export type * as T from './types'

export const t: T = {
  string: message => new StringSchema(message),
  number: message => new NumberSchema(message),
  boolean: message => new BooleanSchema(message),
  object: (schema, message) => new ObjectSchema(schema, message),
  array: (schema, message) => new ArraySchema(schema, message),
  enum: (schema, message) => new EnumSchema(schema, message),
  record: (schema, message) => new RecordSchema(schema, message),
  union: schemas => new UnionSchema(schemas),
}
