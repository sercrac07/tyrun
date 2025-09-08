import { describe, expect, it } from 'vitest'
import { t } from '../src'
import { generateError, generateSuccess } from './utils'

describe('enum', () => {
  it('should be defined', () => {
    expect(t.enum).toBeDefined()
  })

  const schema: ('a' | 'b' | 'c')[] = ['a', 'b', 'c']
  const data = 'a'

  it('should parse', () => {
    expect(t.enum(schema).parse(data)).toEqual(generateSuccess(data))
    expect(t.enum(schema).optional().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.enum(schema).nullable().parse(null)).toEqual(generateSuccess(null))
    expect(t.enum(schema).nullish().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.enum(schema).nullish().parse(null)).toEqual(generateSuccess(null))
    expect(
      t
        .enum(schema)
        .transform(async v => (v === 'a' ? 'b' : 'c'))
        .parse(data)
    ).toEqual(generateSuccess(data))
  })

  it('should not parse', () => {
    expect(t.enum(schema).parse('d')).toEqual(generateError('Value must be one from the options: a, b, c'))
    expect(t.enum(schema).parse('string')).toEqual(generateError('Value must be one from the options: a, b, c'))
    expect(t.enum(schema).parse(1)).toEqual(generateError('Value must be one from the options: a, b, c'))
    expect(t.enum(schema).parse(true)).toEqual(generateError('Value must be one from the options: a, b, c'))
    expect(t.enum(schema).parse({})).toEqual(generateError('Value must be one from the options: a, b, c'))
    expect(t.enum(schema).parse([])).toEqual(generateError('Value must be one from the options: a, b, c'))
  })

  it('should parse async', async () => {
    expect(
      await t
        .enum(schema)
        .transform(async v => (v === 'a' ? 'b' : 'c'))
        .parseAsync(data)
    ).toEqual(generateSuccess('b'))
  })

  it('should validate', () => {
    expect(
      t
        .enum(schema)
        .refine(v => v === 'a')
        .parse(data)
    ).toEqual(generateSuccess(data))
  })

  it('should not validate', () => {
    expect(
      t
        .enum(schema)
        .refine(v => v === 'b')
        .parse(data)
    ).toEqual(generateError('Refinement failed'))
  })

  it('should transform', () => {
    expect(
      t
        .enum(schema)
        .transform(v => (v === 'a' ? 'b' : 'c'))
        .parse(data)
    ).toEqual(generateSuccess('b'))
  })

  it('should mutate', () => {
    expect(
      t
        .enum(schema)
        .mutate(v => v.toUpperCase())
        .parse(data)
    ).toEqual(generateSuccess(data.toUpperCase()))
  })
})
