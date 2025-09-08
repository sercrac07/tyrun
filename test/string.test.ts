import { describe, expect, it } from 'vitest'
import { t } from '../src'
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
  })

  it('should not parse', () => {
    expect(t.string().parse(1)).toEqual(generateError('Value must be a string'))
    expect(t.string().parse(true)).toEqual(generateError('Value must be a string'))
    expect(t.string().parse({})).toEqual(generateError('Value must be a string'))
    expect(t.string().parse([])).toEqual(generateError('Value must be a string'))
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
    expect(t.string().min(7).parse(data)).toEqual(generateError('Value must be at least 7 characters long'))
    expect(t.string().max(5).parse(data)).toEqual(generateError('Value must be at most 5 characters long'))
    expect(
      t
        .string()
        .regex(/^[0-9]+$/)
        .parse(data)
    ).toEqual(generateError('Value does not match regex: /^[0-9]+$/'))
    expect(
      t
        .string()
        .refine(v => v.length === 5)
        .parse(data)
    ).toEqual(generateError('Refinement failed'))
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
