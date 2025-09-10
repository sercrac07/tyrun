import { BooleanSchema } from './primitives/boolean'
import { DateSchema } from './primitives/date'
import { LiteralSchema } from './primitives/literal'
import { NumberSchema } from './primitives/number'
import { StringSchema } from './primitives/string'
import { FileSchema } from './special/file'
import { UnionSchema } from './special/union'
import { ArraySchema } from './structural/array'
import { EnumSchema } from './structural/enum'
import { ObjectSchema } from './structural/object'
import { RecordSchema } from './structural/record'
import { TupleSchema } from './structural/tuple'
import type { T } from './types'

export * from './constants'
export type * as T from './types'

export const t: T = {
  string: message => new StringSchema(message),
  number: message => new NumberSchema(message),
  boolean: message => new BooleanSchema(message),
  date: message => new DateSchema(message),
  literal: (schema, message) => new LiteralSchema(schema, message),
  object: (schema, message) => new ObjectSchema(schema, message),
  array: (schema, message) => new ArraySchema(schema, message),
  enum: (schema, message) => new EnumSchema(schema, message),
  record: (schema, message) => new RecordSchema(schema, message),
  tuple: (schema, message) => new TupleSchema(schema, message),
  union: schemas => new UnionSchema(schemas),
  file: message => new FileSchema(message),
}
