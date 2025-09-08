import { describe, expect, it } from 'vitest'
import { t } from '../src'
import { generateError, generateSuccess } from './utils'

describe('object', () => {
  it('should be defined', () => {
    expect(t.object).toBeDefined()
  })

  const schema = { a: t.string() }
  const data = { a: 'string' }

  it('should parse', () => {
    expect(t.object({}).parse({})).toEqual(generateSuccess({}))
    expect(t.object(schema).parse(data)).toEqual(generateSuccess(data))
    expect(t.object(schema).optional().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.object(schema).nullable().parse(null)).toEqual(generateSuccess(null))
    expect(t.object(schema).nullish().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.object(schema).nullish().parse(null)).toEqual(generateSuccess(null))
  })

  it('should not parse', () => {
    expect(t.object(schema).parse({})).toEqual(generateError('Value must be a string'))
    expect(t.object(schema).parse('string')).toEqual(generateError('Value must be an object'))
    expect(t.object(schema).parse(1)).toEqual(generateError('Value must be an object'))
    expect(t.object(schema).parse(true)).toEqual(generateError('Value must be an object'))
    expect(t.object(schema).parse([])).toEqual(generateError('Value must be an object'))
  })

  it('should validate', () => {
    expect(
      t
        .object(schema)
        .refine(v => v.a.length === 6)
        .parse(data)
    ).toEqual(generateSuccess(data))
  })

  it('should not validate', () => {
    expect(
      t
        .object(schema)
        .refine(v => v.a.length === 5)
        .parse(data)
    ).toEqual(generateError('Refinement failed'))
  })

  it('should transform', () => {
    expect(
      t
        .object(schema)
        .transform(v => ({ ...v, a: v.a.toUpperCase() }))
        .parse(data)
    ).toEqual(generateSuccess({ ...data, a: data.a.toUpperCase() }))
  })

  it('should mutate', () => {
    expect(
      t
        .object(schema)
        .mutate(v => String(v))
        .parse(data)
    ).toEqual(generateSuccess(String(data)))
  })
})
