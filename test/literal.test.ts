import { describe, expect, it } from 'vitest'
import { IssueCode, T, t } from '../src'
import { generateError, generateSuccess } from './utils'

const _schema = t.literal('literal').mutate(v => Number(v))
type _SchemaOutput = T.Output<typeof _schema> // Expected: number
type _SchemaInput = T.Input<typeof _schema> // Expected: 'literal'

describe('literal', () => {
  it('should be defined', () => {
    expect(t.literal).toBeDefined()
  })

  const schema = 'literal'
  const data = 'literal'

  it('should parse', () => {
    expect(t.literal(schema).parse(data)).toEqual(generateSuccess(data))
    expect(t.literal(schema).optional().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.literal(schema).nullable().parse(null)).toEqual(generateSuccess(null))
    expect(t.literal(schema).nullish().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.literal(schema).nullish().parse(null)).toEqual(generateSuccess(null))
    expect(
      t
        .literal(schema)
        .transform(async v => v)
        .parse(data)
    ).toEqual(generateSuccess(data))
    expect(t.literal(schema).default(data).parse(undefined)).toEqual(generateSuccess(data))
    expect(
      t
        .literal(schema)
        .preprocess(() => data)
        .parse(undefined)
    ).toEqual(generateSuccess(data))
  })

  it('should not parse', () => {
    expect(t.literal(schema).parse(1)).toEqual(generateError({ message: `Value must be equal to: ${schema}`, path: [], code: IssueCode.InvalidType }))
    expect(t.literal(schema).parse(true)).toEqual(generateError({ message: `Value must be equal to: ${schema}`, path: [], code: IssueCode.InvalidType }))
    expect(t.literal(schema).parse({})).toEqual(generateError({ message: `Value must be equal to: ${schema}`, path: [], code: IssueCode.InvalidType }))
    expect(t.literal(schema).parse([])).toEqual(generateError({ message: `Value must be equal to: ${schema}`, path: [], code: IssueCode.InvalidType }))
  })

  it('should parse async', async () => {
    expect(
      await t
        .literal(schema)
        .transform(async v => v)
        .parseAsync(data)
    ).toEqual(generateSuccess(data))
  })

  it('should validate', () => {
    expect(
      t
        .literal(schema)
        .refine(v => v.length === 7)
        .parse(data)
    ).toEqual(generateSuccess(data))
  })

  it('should not validate', () => {
    expect(
      t
        .literal(schema)
        .refine(v => v.length === 6)
        .parse(data)
    ).toEqual(generateError({ message: 'Refinement failed', path: [], code: IssueCode.RefinementFailed }))
  })

  it('should transform', () => {
    expect(
      t
        .literal(schema)
        .transform(v => v)
        .parse(data)
    ).toEqual(generateSuccess(data))
  })

  it('should mutate', () => {
    expect(
      t
        .literal(schema)
        .mutate(v => Number(v))
        .parse(data)
    ).toEqual(generateSuccess(Number(data)))
  })
})
