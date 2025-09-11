import { describe, expect, it } from 'vitest'
import { IssueCode, T, t } from '../src'
import { generateError, generateSuccess } from './utils'

const _schema = t.tuple([t.string(), t.number()]).mutate(v => String(v))
type _SchemaOutput = T.Output<typeof _schema> // Expected: string
type _SchemaInput = T.Input<typeof _schema> // Expected: [string, number]

const _complexSchema = t.tuple([t.string().mutate(v => Number(v)), t.number()])
type _ComplexSchemaOutput = T.Output<typeof _complexSchema> // Expected: [number, number]
type _ComplexSchemaInput = T.Input<typeof _complexSchema> // Expected: [string, number]

describe('tuple', () => {
  it('should be defined', () => {
    expect(t.tuple).toBeDefined()
  })

  const schema: [T.TyrunString, T.TyrunNumber] = [t.string(), t.number()]
  const data: [string, number] = ['string', 5]

  it('should parse', () => {
    expect(t.tuple(schema).parse(data)).toEqual(generateSuccess(data))
    expect(t.tuple(schema).optional().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.tuple(schema).nullable().parse(null)).toEqual(generateSuccess(null))
    expect(t.tuple(schema).nullish().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.tuple(schema).nullish().parse(null)).toEqual(generateSuccess(null))
    expect(
      t
        .tuple(schema)
        .transform(async v => v.map(i => (typeof i === 'string' ? i.toUpperCase() : i * 2)) as [string, number])
        .parse(data)
    ).toEqual(generateSuccess(data))
    expect(t.tuple(schema).default(data).parse(undefined)).toEqual(generateSuccess(data))
    expect(
      t
        .tuple(schema)
        .preprocess(() => data)
        .parse(undefined)
    ).toEqual(generateSuccess(data))
  })

  it('should not parse', () => {
    expect(t.tuple(schema).parse('string')).toEqual(generateError({ message: 'Value must be a tuple of 2 items', path: [], code: IssueCode.InvalidType }))
    expect(t.tuple(schema).parse(5)).toEqual(generateError({ message: 'Value must be a tuple of 2 items', path: [], code: IssueCode.InvalidType }))
    expect(t.tuple(schema).parse(true)).toEqual(generateError({ message: 'Value must be a tuple of 2 items', path: [], code: IssueCode.InvalidType }))
    expect(t.tuple(schema).parse({})).toEqual(generateError({ message: 'Value must be a tuple of 2 items', path: [], code: IssueCode.InvalidType }))
    expect(t.tuple(schema).parse([])).toEqual(generateError({ message: 'Value must be a tuple of 2 items', path: [], code: IssueCode.InvalidType }))
    expect(t.tuple(schema).parse(['string'])).toEqual(generateError({ message: 'Value must be a tuple of 2 items', path: [], code: IssueCode.InvalidType }))
    expect(t.tuple(schema).parse([5])).toEqual(generateError({ message: 'Value must be a tuple of 2 items', path: [], code: IssueCode.InvalidType }))
    expect(t.tuple(schema).parse([5, 'string'])).toEqual(generateError({ message: 'Value must be a string', path: ['0'], code: IssueCode.InvalidType }, { message: 'Value must be a number', path: ['1'], code: IssueCode.InvalidType }))
  })

  it('should parse async', async () => {
    expect(
      await t
        .tuple(schema)
        .transform(async v => v.map(i => (typeof i === 'string' ? i.toUpperCase() : i * 2)) as [string, number])
        .parseAsync(data)
    ).toEqual(generateSuccess(data.map(i => (typeof i === 'string' ? i.toUpperCase() : i * 2))))
  })

  it('should validate', () => {
    expect(
      t
        .tuple(schema)
        .refine(v => typeof v[0] === 'string' && typeof v[1] === 'number')
        .parse(data)
    ).toEqual(generateSuccess(data))
  })

  it('should not validate', () => {
    expect(
      t
        .tuple(schema)
        .refine(v => typeof v[0] === 'number' && typeof v[1] === 'string')
        .parse(data)
    ).toEqual(generateError({ message: 'Refinement failed', path: [], code: IssueCode.RefinementFailed }))
  })

  it('should transform', () => {
    expect(
      t
        .tuple(schema)
        .transform(v => v.map(i => (typeof i === 'string' ? i.toUpperCase() : i * 2)) as [string, number])
        .parse(data)
    ).toEqual(generateSuccess(data.map(i => (typeof i === 'string' ? i.toUpperCase() : i * 2))))
  })

  it('should mutate', () => {
    expect(
      t
        .tuple(schema)
        .mutate(v => [Number(v[0]), String(v[1])])
        .parse(data)
    ).toEqual(generateSuccess([Number(data[0]), String(data[1])]))
  })
})
