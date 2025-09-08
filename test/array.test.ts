import { describe, expect, it } from 'vitest'
import { t } from '../src'
import { generateError, generateSuccess } from './utils'

describe('array', () => {
  it('should be defined', () => {
    expect(t.array).toBeDefined()
  })

  const schema = t.string()
  const data = ['string']

  it('should parse', () => {
    expect(t.array(schema).parse([])).toEqual(generateSuccess([]))
    expect(t.array(schema).parse(data)).toEqual(generateSuccess(data))
    expect(t.array(schema).optional().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.array(schema).nullable().parse(null)).toEqual(generateSuccess(null))
    expect(t.array(schema).nullish().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.array(schema).nullish().parse(null)).toEqual(generateSuccess(null))
    expect(
      t
        .array(schema)
        .transform(async v => v.map(item => item.toUpperCase()))
        .parse(data)
    ).toEqual(generateSuccess(data))
  })

  it('should not parse', () => {
    expect(t.array(schema).parse([1])).toEqual(generateError('Value must be a string'))
    expect(t.array(schema).parse('string')).toEqual(generateError('Value must be an array'))
    expect(t.array(schema).parse(1)).toEqual(generateError('Value must be an array'))
    expect(t.array(schema).parse(true)).toEqual(generateError('Value must be an array'))
    expect(t.array(schema).parse({})).toEqual(generateError('Value must be an array'))
  })

  it('should parse async', async () => {
    expect(
      await t
        .array(schema)
        .transform(async v => v.map(item => item.toUpperCase()))
        .parseAsync(data)
    ).toEqual(generateSuccess(data.map(item => item.toUpperCase())))
  })

  it('should validate', () => {
    expect(t.array(schema).min(1).parse(data)).toEqual(generateSuccess(data))
    expect(t.array(schema).max(1).parse(data)).toEqual(generateSuccess(data))
    expect(
      t
        .array(schema)
        .refine(v => v.length === 1)
        .parse(data)
    ).toEqual(generateSuccess(data))
  })

  it('should not validate', () => {
    expect(t.array(schema).min(2).parse(data)).toEqual(generateError('Value must contain at least 2 items'))
    expect(t.array(schema).max(0).parse(data)).toEqual(generateError('Value must contain at most 0 items'))
    expect(
      t
        .array(schema)
        .refine(v => v.length === 2)
        .parse(data)
    ).toEqual(generateError('Refinement failed'))
  })

  it('should transform', () => {
    expect(
      t
        .array(schema)
        .transform(v => v.map(item => item.toUpperCase()))
        .parse(data)
    ).toEqual(generateSuccess(data.map(item => item.toUpperCase())))
  })

  it('should mutate', () => {
    expect(
      t
        .array(schema)
        .mutate(v => String(v))
        .parse(data)
    ).toEqual(generateSuccess(String(data)))
  })
})
