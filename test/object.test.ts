import { describe, expect, it } from 'vitest'
import { IssueCode, T, t } from '../src'
import { generateError, generateSuccess } from './utils'

const _schema = t.object({ name: t.string() }).mutate(v => String(v))
type _SchemaOutput = T.Output<typeof _schema> // Expected: string
type _SchemaInput = T.Input<typeof _schema> // Expected: { name: string }

const _complexSchema = t.object({ name: t.string().mutate(v => Number(v)) })
type _ComplexSchemaOutput = T.Output<typeof _complexSchema> // Expected: { name: number }
type _ComplexSchemaInput = T.Input<typeof _complexSchema> // Expected: { name: string }

describe('object', () => {
  it('should be defined', () => {
    expect(t.object).toBeDefined()
  })

  const schema = { a: t.string() }
  const data = { a: 'string' }

  it('should parse', () => {
    expect(t.object({}).parse({})).toEqual(generateSuccess({}))
    expect(t.object(schema).parse(data)).toEqual(generateSuccess(data))
    expect(t.object(schema).optional().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.object(schema).nullable().parse(null)).toEqual(generateSuccess(null))
    expect(t.object(schema).nullish().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.object(schema).nullish().parse(null)).toEqual(generateSuccess(null))
    expect(
      t
        .object(schema)
        .transform(async v => ({ ...v, a: v.a.toUpperCase() }))
        .parse(data)
    ).toEqual(generateSuccess(data))
    expect(t.object(schema).default(data).parse(undefined)).toEqual(generateSuccess(data))
    expect(
      t
        .object(schema)
        .preprocess(() => data)
        .parse(undefined)
    ).toEqual(generateSuccess(data))
  })

  it('should not parse', () => {
    expect(t.object(schema).parse({})).toEqual(generateError({ message: 'Value must be a string', path: ['a'], code: IssueCode.InvalidType }))
    expect(t.object(schema).parse('string')).toEqual(generateError({ message: 'Value must be an object', path: [], code: IssueCode.InvalidType }))
    expect(t.object(schema).parse(1)).toEqual(generateError({ message: 'Value must be an object', path: [], code: IssueCode.InvalidType }))
    expect(t.object(schema).parse(true)).toEqual(generateError({ message: 'Value must be an object', path: [], code: IssueCode.InvalidType }))
    expect(t.object(schema).parse([])).toEqual(generateError({ message: 'Value must be an object', path: [], code: IssueCode.InvalidType }))
  })

  it('should parse async', async () => {
    expect(
      await t
        .object(schema)
        .transform(async v => ({ ...v, a: v.a.toUpperCase() }))
        .parseAsync(data)
    ).toEqual(generateSuccess({ ...data, a: data.a.toUpperCase() }))
  })

  it('should validate', () => {
    expect(
      t
        .object(schema)
        .refine(v => v.a.length === 6)
        .parse(data)
    ).toEqual(generateSuccess(data))
  })

  it('should not validate', () => {
    expect(
      t
        .object(schema)
        .refine(v => v.a.length === 5)
        .parse(data)
    ).toEqual(generateError({ message: 'Refinement failed', path: [], code: IssueCode.RefinementFailed }))
  })

  it('should transform', () => {
    expect(
      t
        .object(schema)
        .transform(v => ({ ...v, a: v.a.toUpperCase() }))
        .parse(data)
    ).toEqual(generateSuccess({ ...data, a: data.a.toUpperCase() }))
  })

  it('should mutate', () => {
    expect(
      t
        .object(schema)
        .mutate(v => String(v))
        .parse(data)
    ).toEqual(generateSuccess(String(data)))
  })
})
