import { describe, expect, it } from 'vitest'
import { t } from '../src'
import { generateError, generateSuccess } from './utils'

describe('boolean', () => {
  it('should be defined', () => {
    expect(t.boolean).toBeDefined()
  })

  const data = true

  it('should parse', () => {
    expect(t.boolean().parse(data)).toEqual(generateSuccess(data))
    expect(t.boolean().parse(false)).toEqual(generateSuccess(false))
    expect(t.boolean().optional().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.boolean().nullable().parse(null)).toEqual(generateSuccess(null))
    expect(t.boolean().nullish().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.boolean().nullish().parse(null)).toEqual(generateSuccess(null))
    expect(t.boolean().coerce().parse('string')).toEqual(generateSuccess(data))
  })

  it('should not parse', () => {
    expect(t.boolean().parse('true')).toEqual(generateError('Value must be a boolean'))
    expect(t.boolean().parse(1)).toEqual(generateError('Value must be a boolean'))
    expect(t.boolean().parse({})).toEqual(generateError('Value must be a boolean'))
    expect(t.boolean().parse([])).toEqual(generateError('Value must be a boolean'))
  })

  it('should validate', () => {
    expect(
      t
        .boolean()
        .refine(v => v === true)
        .parse(data)
    ).toEqual(generateSuccess(data))
  })

  it('should not validate', () => {
    expect(
      t
        .boolean()
        .refine(v => v === false)
        .parse(data)
    ).toEqual(generateError('Refinement failed'))
  })

  it('should transform', () => {
    expect(
      t
        .boolean()
        .transform(v => !v)
        .parse(data)
    ).toEqual(generateSuccess(!data))
  })

  it('should mutate', () => {
    expect(
      t
        .boolean()
        .mutate(v => String(v))
        .parse(data)
    ).toEqual(generateSuccess(String(data)))
  })
})
