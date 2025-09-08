import { describe, expect, it } from 'vitest'
import { t } from '../src'
import { generateError, generateSuccess } from './utils'

describe('file', () => {
  it('should be defined', () => {
    expect(t.file).toBeDefined()
  })

  const data = new File(['file'], 'file-test.txt', { type: 'text/plain', lastModified: 0 })

  it('should parse', () => {
    expect(t.file().parse(data)).toEqual(generateSuccess(data))
    expect(t.file().optional().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.file().nullable().parse(null)).toEqual(generateSuccess(null))
    expect(t.file().nullish().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.file().nullish().parse(null)).toEqual(generateSuccess(null))
  })

  it('should not parse', () => {
    expect(t.file().parse('string')).toEqual(generateError('Value must be a file'))
    expect(t.file().parse(5)).toEqual(generateError('Value must be a file'))
    expect(t.file().parse(true)).toEqual(generateError('Value must be a file'))
    expect(t.file().parse({})).toEqual(generateError('Value must be a file'))
    expect(t.file().parse([])).toEqual(generateError('Value must be a file'))
  })

  it('should validate', () => {
    expect(t.file().min(4).parse(data)).toEqual(generateSuccess(data))
    expect(t.file().max(4).parse(data)).toEqual(generateSuccess(data))
    expect(t.file().types(['text/plain']).parse(data)).toEqual(generateSuccess(data))
    expect(
      t
        .file()
        .refine(v => v.size === 4)
        .parse(data)
    ).toEqual(generateSuccess(data))
  })

  it('should not validate', () => {
    expect(t.file().min(5).parse(data)).toEqual(generateError('Value must be at least 5 bytes'))
    expect(t.file().max(3).parse(data)).toEqual(generateError('Value must be at most 3 bytes'))
    expect(t.file().types(['image/png']).parse(data)).toEqual(generateError('Value must be one of the following types: image/png'))
    expect(
      t
        .file()
        .refine(v => v.size === 5)
        .parse(data)
    ).toEqual(generateError('Refinement failed'))
  })

  it('should transform', () => {
    expect(
      t
        .file()
        .transform(v => new File([v], v.name.toUpperCase(), { type: v.type, lastModified: v.lastModified }))
        .parse(data)
    ).toEqual(generateSuccess(new File([data], data.name.toUpperCase(), { type: data.type, lastModified: data.lastModified })))
  })

  it('should mutate', () => {
    expect(
      t
        .file()
        .mutate(v => v.name)
        .parse(data)
    ).toEqual(generateSuccess(data.name))
  })
})
