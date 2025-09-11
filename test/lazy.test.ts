import { describe, expect, it } from 'vitest'
import { IssueCode, T, t } from '../src'
import { generateError, generateSuccess } from './utils'

const _schema = t.lazy(() => t.string()).mutate(v => Number(v))
type _SchemaOutput = T.Output<typeof _schema> // Expected: number
type _SchemaInput = T.Input<typeof _schema> // Expected: string

const _complexSchema = t.lazy(() => t.string().mutate(v => Number(v)))
type _ComplexSchemaOutput = T.Output<typeof _complexSchema> // Expected: number
type _ComplexSchemaInput = T.Input<typeof _complexSchema> // Expected: string

describe('lazy', () => {
  it('should be defined', () => {
    expect(t.lazy).toBeDefined()
  })

  const schema = () => t.string()
  const data = 'string'

  it('should parse', () => {
    expect(t.lazy(schema).parse(data)).toEqual(generateSuccess(data))
    expect(t.lazy(schema).optional().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.lazy(schema).nullable().parse(null)).toEqual(generateSuccess(null))
    expect(t.lazy(schema).nullish().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.lazy(schema).nullish().parse(null)).toEqual(generateSuccess(null))
    expect(
      t
        .lazy(schema)
        .transform(async v => v.toUpperCase())
        .parse(data)
    ).toEqual(generateSuccess(data))
    expect(t.lazy(schema).default(data).parse(undefined)).toEqual(generateSuccess(data))
    expect(
      t
        .lazy(schema)
        .preprocess(() => data)
        .parse(undefined)
    ).toEqual(generateSuccess(data))
  })

  it('should not parse', () => {
    expect(t.lazy(schema).parse(1)).toEqual(generateError({ message: 'Value must be a string', path: [], code: IssueCode.InvalidType }))
    expect(t.lazy(schema).parse(true)).toEqual(generateError({ message: 'Value must be a string', path: [], code: IssueCode.InvalidType }))
    expect(t.lazy(schema).parse({})).toEqual(generateError({ message: 'Value must be a string', path: [], code: IssueCode.InvalidType }))
    expect(t.lazy(schema).parse([])).toEqual(generateError({ message: 'Value must be a string', path: [], code: IssueCode.InvalidType }))
  })

  it('should parse async', async () => {
    expect(
      await t
        .lazy(schema)
        .transform(async v => v.toUpperCase())
        .parseAsync(data)
    ).toEqual(generateSuccess(data.toUpperCase()))
  })

  it('should validate', () => {
    expect(
      t
        .lazy(schema)
        .refine(v => v.length === 6)
        .parse(data)
    ).toEqual(generateSuccess(data))
  })

  it('should not validate', () => {
    expect(
      t
        .lazy(schema)
        .refine(v => v.length === 5)
        .parse(data)
    ).toEqual(generateError({ message: 'Refinement failed', path: [], code: IssueCode.RefinementFailed }))
  })

  it('should transform', () => {
    expect(
      t
        .lazy(schema)
        .transform(v => v.toUpperCase())
        .parse(data)
    ).toEqual(generateSuccess(data.toUpperCase()))
  })

  it('should mutate', () => {
    expect(
      t
        .lazy(schema)
        .mutate(v => Number(v))
        .parse(data)
    ).toEqual(generateSuccess(Number(data)))
  })
})
