import { describe, expect, it } from 'vitest'
import { IssueCode, T, t } from '../src'
import { generateError, generateSuccess } from './utils'

const _schema = t.union([t.string(), t.number()]).mutate(v => String(v))
type _SchemaOutput = T.Output<typeof _schema> // Expected: string
type _SchemaInput = T.Input<typeof _schema> // Expected: string | number

const _complexSchema = t.union([t.string().mutate(v => Number(v)), t.number()])
type _ComplexSchemaOutput = T.Output<typeof _complexSchema> // Expected: number
type _ComplexSchemaInput = T.Input<typeof _complexSchema> // Expected: string | number

describe('union', () => {
  it('should be defined', () => {
    expect(t.union).toBeDefined()
  })

  const schema = [t.string(), t.number()]
  const dataString = 'string'
  const dataNumber = 5

  it('should parse', () => {
    expect(t.union(schema).parse(dataString)).toEqual(generateSuccess(dataString))
    expect(t.union(schema).parse(dataNumber)).toEqual(generateSuccess(dataNumber))
    expect(t.union(schema).optional().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.union(schema).nullable().parse(null)).toEqual(generateSuccess(null))
    expect(t.union(schema).nullish().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.union(schema).nullish().parse(null)).toEqual(generateSuccess(null))
    expect(
      t
        .union(schema)
        .transform(async v => (typeof v === 'string' ? v.toUpperCase() : v * 2))
        .parse(dataString)
    ).toEqual(generateSuccess(dataString))
    expect(
      t
        .union(schema)
        .transform(async v => (typeof v === 'string' ? v.toUpperCase() : v * 2))
        .parse(dataNumber)
    ).toEqual(generateSuccess(dataNumber))
    expect(t.union(schema).default(dataString).parse(undefined)).toEqual(generateSuccess(dataString))
    expect(t.union(schema).default(dataNumber).parse(undefined)).toEqual(generateSuccess(dataNumber))
    expect(
      t
        .union(schema)
        .preprocess(() => dataString)
        .parse(undefined)
    ).toEqual(generateSuccess(dataString))
    expect(
      t
        .union(schema)
        .preprocess(() => dataNumber)
        .parse(undefined)
    ).toEqual(generateSuccess(dataNumber))
  })

  it('should not parse', () => {
    expect(t.union(schema).parse(true)).toEqual(generateError({ message: 'Value must be a string', path: [], code: IssueCode.InvalidType }, { message: 'Value must be a number', path: [], code: IssueCode.InvalidType }))
    expect(t.union(schema).parse({})).toEqual(generateError({ message: 'Value must be a string', path: [], code: IssueCode.InvalidType }, { message: 'Value must be a number', path: [], code: IssueCode.InvalidType }))
    expect(t.union(schema).parse([])).toEqual(generateError({ message: 'Value must be a string', path: [], code: IssueCode.InvalidType }, { message: 'Value must be a number', path: [], code: IssueCode.InvalidType }))
  })

  it('should parse async', async () => {
    expect(
      await t
        .union(schema)
        .transform(async v => (typeof v === 'string' ? v.toUpperCase() : v * 2))
        .parseAsync(dataString)
    ).toEqual(generateSuccess(dataString.toUpperCase()))
    expect(
      await t
        .union(schema)
        .transform(async v => (typeof v === 'string' ? v.toUpperCase() : v * 2))
        .parseAsync(dataNumber)
    ).toEqual(generateSuccess(dataNumber * 2))
  })

  it('should validate', () => {
    expect(
      t
        .union(schema)
        .refine(v => typeof v === 'string')
        .parse(dataString)
    ).toEqual(generateSuccess(dataString))
    expect(
      t
        .union(schema)
        .refine(v => typeof v === 'number')
        .parse(dataNumber)
    ).toEqual(generateSuccess(dataNumber))
  })

  it('should not validate', () => {
    expect(
      t
        .union(schema)
        .refine(v => typeof v === 'number')
        .parse(dataString)
    ).toEqual(generateError({ message: 'Refinement failed', path: [], code: IssueCode.RefinementFailed }, { message: 'Value must be a number', path: [], code: IssueCode.InvalidType }))
    expect(
      t
        .union(schema)
        .refine(v => typeof v === 'string')
        .parse(dataNumber)
    ).toEqual(generateError({ message: 'Value must be a string', path: [], code: IssueCode.InvalidType }, { message: 'Refinement failed', path: [], code: IssueCode.RefinementFailed }))
  })

  it('should transform', () => {
    expect(
      t
        .union(schema)
        .transform(v => (typeof v === 'string' ? v.toUpperCase() : v * 2))
        .parse(dataString)
    ).toEqual(generateSuccess(dataString.toUpperCase()))
    expect(
      t
        .union(schema)
        .transform(v => (typeof v === 'string' ? v.toUpperCase() : v * 2))
        .parse(dataNumber)
    ).toEqual(generateSuccess(dataNumber * 2))
  })

  it('should mutate', () => {
    expect(
      t
        .union(schema)
        .mutate(v => (typeof v === 'string' ? Number(v) : String(v)))
        .parse(dataString)
    ).toEqual(generateSuccess(Number(dataString)))
    expect(
      t
        .union(schema)
        .mutate(v => (typeof v === 'string' ? Number(v) : String(v)))
        .parse(dataNumber)
    ).toEqual(generateSuccess(String(dataNumber)))
  })
})
