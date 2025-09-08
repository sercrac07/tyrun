import { BooleanSchema } from './primitives/boolean'
import { DateSchema } from './primitives/date'
import { NumberSchema } from './primitives/number'
import { StringSchema } from './primitives/string'
import { FileSchema } from './special/file'
import { UnionSchema } from './special/union'
import { ArraySchema } from './structural/array'
import { EnumSchema } from './structural/enum'
import { ObjectSchema } from './structural/object'
import { RecordSchema } from './structural/record'
import type { T } from './types'

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
  date: message => new DateSchema(message),
  file: message => new FileSchema(message),
}
