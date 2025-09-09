import { describe, expect, it } from 'vitest'
import { IssueCode, t } from '../src'
import { generateError, generateSuccess } from './utils'

describe('record', () => {
  it('should be defined', () => {
    expect(t.record).toBeDefined()
  })

  const schema = t.string()
  const data = { a: 'string' }

  it('should parse', () => {
    expect(t.record(schema).parse({})).toEqual(generateSuccess({}))
    expect(t.record(schema).parse(data)).toEqual(generateSuccess(data))
    expect(t.record(schema).optional().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.record(schema).nullable().parse(null)).toEqual(generateSuccess(null))
    expect(t.record(schema).nullish().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.record(schema).nullish().parse(null)).toEqual(generateSuccess(null))
    expect(
      t
        .record(schema)
        .transform(async v => ({ ...v, a: v.a.toUpperCase() }))
        .parse(data)
    ).toEqual(generateSuccess(data))
    expect(t.record(schema).default(data).parse(undefined)).toEqual(generateSuccess(data))
  })

  it('should not parse', () => {
    expect(t.record(schema).parse('string')).toEqual(generateError({ message: 'Value must be an object', path: [], code: IssueCode.InvalidType }))
    expect(t.record(schema).parse(1)).toEqual(generateError({ message: 'Value must be an object', path: [], code: IssueCode.InvalidType }))
    expect(t.record(schema).parse(true)).toEqual(generateError({ message: 'Value must be an object', path: [], code: IssueCode.InvalidType }))
    expect(t.record(schema).parse([])).toEqual(generateError({ message: 'Value must be an object', path: [], code: IssueCode.InvalidType }))
  })

  it('should parse async', async () => {
    expect(
      await t
        .record(schema)
        .transform(async v => ({ ...v, a: v.a.toUpperCase() }))
        .parseAsync(data)
    ).toEqual(generateSuccess({ ...data, a: data.a.toUpperCase() }))
  })

  it('should validate', () => {
    expect(
      t
        .record(schema)
        .refine(v => v.a.length === 6)
        .parse(data)
    ).toEqual(generateSuccess(data))
  })

  it('should not validate', () => {
    expect(
      t
        .record(schema)
        .refine(v => v.a.length === 5)
        .parse(data)
    ).toEqual(generateError({ message: 'Refinement failed', path: [], code: IssueCode.RefinementFailed }))
  })

  it('should transform', () => {
    expect(
      t
        .record(schema)
        .transform(v => ({ ...v, a: v.a.toUpperCase() }))
        .parse(data)
    ).toEqual(generateSuccess({ ...data, a: data.a.toUpperCase() }))
  })

  it('should mutate', () => {
    expect(
      t
        .record(schema)
        .mutate(v => String(v))
        .parse(data)
    ).toEqual(generateSuccess(String(data)))
  })
})
