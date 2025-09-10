import { describe, expect, it } from 'vitest'
import { IssueCode, t } from '../src'
import { generateError, generateSuccess } from './utils'

describe('any', () => {
  it('should be defined', () => {
    expect(t.any).toBeDefined()
  })

  const data = 'string'

  it('should parse', () => {
    expect(t.any().parse(data)).toEqual(generateSuccess(data))
    expect(t.any().parse(5)).toEqual(generateSuccess(5))
    expect(t.any().parse(true)).toEqual(generateSuccess(true))
    expect(t.any().parse({})).toEqual(generateSuccess({}))
    expect(t.any().parse([])).toEqual(generateSuccess([]))
    expect(t.any().optional().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.any().nullable().parse(null)).toEqual(generateSuccess(null))
    expect(t.any().nullish().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.any().nullish().parse(null)).toEqual(generateSuccess(null))
    expect(
      t
        .any()
        .transform(async v => v.toUpperCase())
        .parse(data)
    ).toEqual(generateSuccess(data))
    expect(t.any().default(data).parse(undefined)).toEqual(generateSuccess(data))
    expect(
      t
        .any()
        .preprocess(() => data)
        .parse(undefined)
    ).toEqual(generateSuccess(data))
  })

  it('should parse async', async () => {
    expect(
      await t
        .any()
        .transform(async v => v.toUpperCase())
        .parseAsync(data)
    ).toEqual(generateSuccess(data.toUpperCase()))
  })

  it('should validate', () => {
    expect(
      t
        .any()
        .refine(v => typeof v === 'string')
        .parse(data)
    ).toEqual(generateSuccess(data))
  })

  it('should not validate', () => {
    expect(
      t
        .any()
        .refine(v => typeof v === 'number')
        .parse(data)
    ).toEqual(generateError({ message: 'Refinement failed', path: [], code: IssueCode.RefinementFailed }))
  })

  it('should transform', () => {
    expect(
      t
        .any()
        .transform(v => v.toUpperCase())
        .parse(data)
    ).toEqual(generateSuccess(data.toUpperCase()))
  })

  it('should mutate', () => {
    expect(
      t
        .any()
        .mutate(v => Number(v))
        .parse(data)
    ).toEqual(generateSuccess(Number(data)))
  })
})
