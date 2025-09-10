import { describe, expect, it } from 'vitest'
import { IssueCode, t } from '../src'
import { generateError, generateSuccess } from './utils'

describe('string', () => {
  it('should be defined', () => {
    expect(t.string).toBeDefined()
  })

  const data = 'string'

  it('should parse', () => {
    expect(t.string().parse(data)).toEqual(generateSuccess(data))
    expect(t.string().optional().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.string().nullable().parse(null)).toEqual(generateSuccess(null))
    expect(t.string().nullish().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.string().nullish().parse(null)).toEqual(generateSuccess(null))
    expect(t.string().coerce().parse(1)).toEqual(generateSuccess('1'))
    expect(
      t
        .string()
        .transform(async v => v.toUpperCase())
        .parse(data)
    ).toEqual(generateSuccess(data))
    expect(t.string().default(data).parse(undefined)).toEqual(generateSuccess(data))
    expect(
      t
        .string()
        .preprocess(() => data)
        .parse(undefined)
    ).toEqual(generateSuccess(data))
  })

  it('should not parse', () => {
    expect(t.string().parse(1)).toEqual(generateError({ message: 'Value must be a string', path: [], code: IssueCode.InvalidType }))
    expect(t.string().parse(true)).toEqual(generateError({ message: 'Value must be a string', path: [], code: IssueCode.InvalidType }))
    expect(t.string().parse({})).toEqual(generateError({ message: 'Value must be a string', path: [], code: IssueCode.InvalidType }))
    expect(t.string().parse([])).toEqual(generateError({ message: 'Value must be a string', path: [], code: IssueCode.InvalidType }))
  })

  it('should parse async', async () => {
    expect(
      await t
        .string()
        .transform(async v => v.toUpperCase())
        .parseAsync(data)
    ).toEqual(generateSuccess(data.toUpperCase()))
  })

  it('should validate', () => {
    expect(t.string().min(6).parse(data)).toEqual(generateSuccess(data))
    expect(t.string().max(6).parse(data)).toEqual(generateSuccess(data))
    expect(
      t
        .string()
        .regex(/^[a-z]+$/)
        .parse(data)
    ).toEqual(generateSuccess(data))
    expect(
      t
        .string()
        .refine(v => v.length === 6)
        .parse(data)
    ).toEqual(generateSuccess(data))
  })

  it('should not validate', () => {
    expect(t.string().min(7).parse(data)).toEqual(generateError({ message: 'Value must be at least 7 characters long', path: [], code: IssueCode.Min }))
    expect(t.string().max(5).parse(data)).toEqual(generateError({ message: 'Value must be at most 5 characters long', path: [], code: IssueCode.Max }))
    expect(
      t
        .string()
        .regex(/^[0-9]+$/)
        .parse(data)
    ).toEqual(generateError({ message: 'Value does not match regex: /^[0-9]+$/', path: [], code: IssueCode.RefinementFailed }))
    expect(
      t
        .string()
        .refine(v => v.length === 5)
        .parse(data)
    ).toEqual(generateError({ message: 'Refinement failed', path: [], code: IssueCode.RefinementFailed }))
  })

  it('should transform', () => {
    expect(
      t
        .string()
        .transform(v => v.toUpperCase())
        .parse(data)
    ).toEqual(generateSuccess(data.toUpperCase()))
  })

  it('should mutate', () => {
    expect(
      t
        .string()
        .mutate(v => Number(v))
        .parse(data)
    ).toEqual(generateSuccess(Number(data)))
  })
})
