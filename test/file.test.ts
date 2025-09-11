import { describe, expect, it } from 'vitest'
import { IssueCode, T, t } from '../src'
import { generateError, generateSuccess } from './utils'

const _schema = t.file().mutate(v => String(v))
type _SchemaOutput = T.Output<typeof _schema> // Expected: string
type _SchemaInput = T.Input<typeof _schema> // Expected: File

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
    expect(
      t
        .file()
        .transform(async v => new File([v], v.name.toUpperCase(), { type: v.type, lastModified: v.lastModified }))
        .parse(data)
    ).toEqual(generateSuccess(data))
    expect(t.file().default(data).parse(undefined)).toEqual(generateSuccess(data))
    expect(
      t
        .file()
        .preprocess(() => data)
        .parse(undefined)
    ).toEqual(generateSuccess(data))
  })

  it('should not parse', () => {
    expect(t.file().parse('string')).toEqual(generateError({ message: 'Value must be a file', path: [], code: IssueCode.InvalidType }))
    expect(t.file().parse(5)).toEqual(generateError({ message: 'Value must be a file', path: [], code: IssueCode.InvalidType }))
    expect(t.file().parse(true)).toEqual(generateError({ message: 'Value must be a file', path: [], code: IssueCode.InvalidType }))
    expect(t.file().parse({})).toEqual(generateError({ message: 'Value must be a file', path: [], code: IssueCode.InvalidType }))
    expect(t.file().parse([])).toEqual(generateError({ message: 'Value must be a file', path: [], code: IssueCode.InvalidType }))
  })

  it('should parse async', async () => {
    expect(
      await t
        .file()
        .transform(async v => new File([v], v.name.toUpperCase(), { type: v.type, lastModified: v.lastModified }))
        .parseAsync(data)
    ).toEqual(generateSuccess(new File([data], data.name.toUpperCase(), { type: data.type, lastModified: data.lastModified })))
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
    expect(t.file().min(5).parse(data)).toEqual(generateError({ message: 'Value must be at least 5 bytes', path: [], code: IssueCode.Min }))
    expect(t.file().max(3).parse(data)).toEqual(generateError({ message: 'Value must be at most 3 bytes', path: [], code: IssueCode.Max }))
    expect(t.file().types(['image/png']).parse(data)).toEqual(generateError({ message: 'Value must be one of the following types: image/png', path: [], code: IssueCode.RefinementFailed }))
    expect(
      t
        .file()
        .refine(v => v.size === 5)
        .parse(data)
    ).toEqual(generateError({ message: 'Refinement failed', path: [], code: IssueCode.RefinementFailed }))
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
