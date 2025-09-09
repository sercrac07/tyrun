import { describe, expect, it } from 'vitest'
import { IssueCode, t } from '../src'
import { generateError, generateSuccess } from './utils'

describe('date', () => {
  it('should be defined', () => {
    expect(t.date).toBeDefined()
  })

  const data = new Date('2025-09-08')

  it('should parse', () => {
    expect(t.date().parse(data)).toEqual(generateSuccess(data))
    expect(t.date().optional().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.date().nullable().parse(null)).toEqual(generateSuccess(null))
    expect(t.date().nullish().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.date().nullish().parse(null)).toEqual(generateSuccess(null))
    expect(t.date().coerce().parse('2025-09-08')).toEqual(generateSuccess(data))
    expect(
      t
        .date()
        .transform(async v => new Date(v.getTime() + 1000 * 60 * 60 * 24))
        .parse(data)
    ).toEqual(generateSuccess(data))
  })

  it('should not parse', () => {
    expect(t.date().parse('2025-09-08')).toEqual(generateError({ message: 'Value must be a date', path: [], code: IssueCode.InvalidType }))
    expect(t.date().parse(5)).toEqual(generateError({ message: 'Value must be a date', path: [], code: IssueCode.InvalidType }))
    expect(t.date().parse(true)).toEqual(generateError({ message: 'Value must be a date', path: [], code: IssueCode.InvalidType }))
    expect(t.date().parse({})).toEqual(generateError({ message: 'Value must be a date', path: [], code: IssueCode.InvalidType }))
    expect(t.date().parse([])).toEqual(generateError({ message: 'Value must be a date', path: [], code: IssueCode.InvalidType }))
  })

  it('should parse async', async () => {
    expect(
      await t
        .date()
        .transform(async v => new Date(v.getTime() + 1000 * 60 * 60 * 24))
        .parseAsync(data)
    ).toEqual(generateSuccess(new Date(data.getTime() + 1000 * 60 * 60 * 24)))
  })

  it('should validate', () => {
    expect(t.date().min(new Date('2025-09-08')).parse(data)).toEqual(generateSuccess(data))
    expect(t.date().max(new Date('2025-09-08')).parse(data)).toEqual(generateSuccess(data))
    expect(
      t
        .date()
        .refine(v => v.getTime() === new Date('2025-09-08').getTime())
        .parse(data)
    ).toEqual(generateSuccess(data))
  })

  it('should not validate', () => {
    expect(t.date().min(new Date('2025-09-09')).parse(data)).toEqual(generateError({ message: 'Value must be greater than Tue Sep 09 2025', path: [], code: IssueCode.Min }))
    expect(t.date().max(new Date('2025-09-07')).parse(data)).toEqual(generateError({ message: 'Value must be lower than Sun Sep 07 2025', path: [], code: IssueCode.Max }))
    expect(
      t
        .date()
        .refine(v => v.getTime() === new Date('2025-09-09').getTime())
        .parse(data)
    ).toEqual(generateError({ message: 'Refinement failed', path: [], code: IssueCode.RefinementFailed }))
  })

  it('should transform', () => {
    expect(
      t
        .date()
        .transform(v => new Date(v.getTime() + 1000 * 60 * 60 * 24))
        .parse(data)
    ).toEqual(generateSuccess(new Date(data.getTime() + 1000 * 60 * 60 * 24)))
  })

  it('should mutate', () => {
    expect(
      t
        .date()
        .mutate(v => String(v))
        .parse(data)
    ).toEqual(generateSuccess(String(data)))
  })
})
