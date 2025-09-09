import { describe, expect, it } from 'vitest'
import { IssueCode, t } from '../src'
import { generateError, generateSuccess } from './utils'

describe('number', () => {
  it('should be defined', () => {
    expect(t.number).toBeDefined()
  })

  const data = 5

  it('should parse', () => {
    expect(t.number().parse(data)).toEqual(generateSuccess(data))
    expect(t.number().optional().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.number().nullable().parse(null)).toEqual(generateSuccess(null))
    expect(t.number().nullish().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.number().nullish().parse(null)).toEqual(generateSuccess(null))
    expect(t.number().coerce().parse('5')).toEqual(generateSuccess(data))
    expect(
      t
        .number()
        .transform(async v => v * 2)
        .parse(data)
    ).toEqual(generateSuccess(data))
    expect(t.number().default(data).parse(undefined)).toEqual(generateSuccess(data))
  })

  it('should not parse', () => {
    expect(t.number().parse('5')).toEqual(generateError({ message: 'Value must be a number', path: [], code: IssueCode.InvalidType }))
    expect(t.number().parse(true)).toEqual(generateError({ message: 'Value must be a number', path: [], code: IssueCode.InvalidType }))
    expect(t.number().parse({})).toEqual(generateError({ message: 'Value must be a number', path: [], code: IssueCode.InvalidType }))
    expect(t.number().parse([])).toEqual(generateError({ message: 'Value must be a number', path: [], code: IssueCode.InvalidType }))
  })

  it('should parse async', async () => {
    expect(
      await t
        .number()
        .transform(async v => v * 2)
        .parseAsync(data)
    ).toEqual(generateSuccess(data * 2))
  })

  it('should validate', () => {
    expect(t.number().min(5).parse(data)).toEqual(generateSuccess(data))
    expect(t.number().max(5).parse(data)).toEqual(generateSuccess(data))
    expect(
      t
        .number()
        .refine(v => v === 5)
        .parse(data)
    ).toEqual(generateSuccess(data))
  })

  it('should not validate', () => {
    expect(t.number().min(6).parse(data)).toEqual(generateError({ message: 'Value must be greater or equal than 6', path: [], code: IssueCode.Min }))
    expect(t.number().max(4).parse(data)).toEqual(generateError({ message: 'Value must be lower or equal than 4', path: [], code: IssueCode.Max }))
    expect(
      t
        .number()
        .refine(v => v === 6)
        .parse(data)
    ).toEqual(generateError({ message: 'Refinement failed', path: [], code: IssueCode.RefinementFailed }))
  })

  it('should transform', () => {
    expect(
      t
        .number()
        .transform(v => v * 2)
        .parse(data)
    ).toEqual(generateSuccess(data * 2))
  })

  it('should mutate', () => {
    expect(
      t
        .number()
        .mutate(v => String(v))
        .parse(data)
    ).toEqual(generateSuccess(String(data)))
  })
})
