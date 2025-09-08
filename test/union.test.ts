import { describe, expect, it } from 'vitest'
import { t } from '../src'
import { generateError, generateSuccess } from './utils'

describe('union', () => {
  it('should be defined', () => {
    expect(t.union).toBeDefined()
  })

  const schema = [t.string(), t.number()]
  const dataString = 'string'
  const dataNumber = 5

  it('should parse', () => {
    expect(t.union(schema).parse(dataString)).toEqual(generateSuccess(dataString))
    expect(t.union(schema).parse(dataNumber)).toEqual(generateSuccess(dataNumber))
    expect(t.union(schema).optional().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.union(schema).nullable().parse(null)).toEqual(generateSuccess(null))
    expect(t.union(schema).nullish().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.union(schema).nullish().parse(null)).toEqual(generateSuccess(null))
    expect(
      t
        .union(schema)
        .transform(async v => (typeof v === 'string' ? v.toUpperCase() : v * 2))
        .parse(dataString)
    ).toEqual(generateSuccess(dataString))
    expect(
      t
        .union(schema)
        .transform(async v => (typeof v === 'string' ? v.toUpperCase() : v * 2))
        .parse(dataNumber)
    ).toEqual(generateSuccess(dataNumber))
  })

  it('should not parse', () => {
    expect(t.union(schema).parse(true)).toEqual(generateError('Value must be a string', 'Value must be a number'))
    expect(t.union(schema).parse({})).toEqual(generateError('Value must be a string', 'Value must be a number'))
    expect(t.union(schema).parse([])).toEqual(generateError('Value must be a string', 'Value must be a number'))
  })

  it('should parse async', async () => {
    expect(
      await t
        .union(schema)
        .transform(async v => (typeof v === 'string' ? v.toUpperCase() : v * 2))
        .parseAsync(dataString)
    ).toEqual(generateSuccess(dataString.toUpperCase()))
    expect(
      await t
        .union(schema)
        .transform(async v => (typeof v === 'string' ? v.toUpperCase() : v * 2))
        .parseAsync(dataNumber)
    ).toEqual(generateSuccess(dataNumber * 2))
  })

  it('should validate', () => {
    expect(
      t
        .union(schema)
        .refine(v => typeof v === 'string')
        .parse(dataString)
    ).toEqual(generateSuccess(dataString))
    expect(
      t
        .union(schema)
        .refine(v => typeof v === 'number')
        .parse(dataNumber)
    ).toEqual(generateSuccess(dataNumber))
  })

  it('should not validate', () => {
    expect(
      t
        .union(schema)
        .refine(v => typeof v === 'number')
        .parse(dataString)
    ).toEqual(generateError('Refinement failed', 'Value must be a number'))
    expect(
      t
        .union(schema)
        .refine(v => typeof v === 'string')
        .parse(dataNumber)
    ).toEqual(generateError('Value must be a string', 'Refinement failed'))
  })

  it('should transform', () => {
    expect(
      t
        .union(schema)
        .transform(v => (typeof v === 'string' ? v.toUpperCase() : v * 2))
        .parse(dataString)
    ).toEqual(generateSuccess(dataString.toUpperCase()))
    expect(
      t
        .union(schema)
        .transform(v => (typeof v === 'string' ? v.toUpperCase() : v * 2))
        .parse(dataNumber)
    ).toEqual(generateSuccess(dataNumber * 2))
  })

  it('should mutate', () => {
    expect(
      t
        .union(schema)
        .mutate(v => (typeof v === 'string' ? Number(v) : String(v)))
        .parse(dataString)
    ).toEqual(generateSuccess(Number(dataString)))
    expect(
      t
        .union(schema)
        .mutate(v => (typeof v === 'string' ? Number(v) : String(v)))
        .parse(dataNumber)
    ).toEqual(generateSuccess(String(dataNumber)))
  })
})
