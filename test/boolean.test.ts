import { describe, expect, it } from 'vitest'
import { IssueCode, t } from '../src'
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
    expect(
      t
        .boolean()
        .transform(async v => !v)
        .parse(data)
    ).toEqual(generateSuccess(data))
    expect(t.boolean().default(data).parse(undefined)).toEqual(generateSuccess(data))
  })

  it('should not parse', () => {
    expect(t.boolean().parse('true')).toEqual(generateError({ message: 'Value must be a boolean', path: [], code: IssueCode.InvalidType }))
    expect(t.boolean().parse(1)).toEqual(generateError({ message: 'Value must be a boolean', path: [], code: IssueCode.InvalidType }))
    expect(t.boolean().parse({})).toEqual(generateError({ message: 'Value must be a boolean', path: [], code: IssueCode.InvalidType }))
    expect(t.boolean().parse([])).toEqual(generateError({ message: 'Value must be a boolean', path: [], code: IssueCode.InvalidType }))
  })

  it('should parse async', async () => {
    expect(
      await t
        .boolean()
        .transform(async v => !v)
        .parseAsync(data)
    ).toEqual(generateSuccess(!data))
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
    ).toEqual(generateError({ message: 'Refinement failed', path: [], code: IssueCode.RefinementFailed }))
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
