import { describe, expect, it } from 'vitest'
import { IssueCode, t } from '../src'
import { generateError, generateSuccess } from './utils'

describe('intersection', () => {
  it('should be defined', () => {
    expect(t.intersection).toBeDefined()
  })

  const schema = [t.object({ name: t.string() }), t.object({ age: t.number() })]
  const data = { name: 'John', age: 18 }

  it('should parse', () => {
    expect(t.intersection(schema).parse(data)).toEqual(generateSuccess(data))
    expect(t.intersection(schema).optional().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.intersection(schema).nullable().parse(null)).toEqual(generateSuccess(null))
    expect(t.intersection(schema).nullish().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.intersection(schema).nullish().parse(null)).toEqual(generateSuccess(null))
    expect(
      t
        .intersection(schema)
        .transform(async v => ({ ...v, name: v.name.toUpperCase() }))
        .parse(data)
    ).toEqual(generateSuccess(data))
    expect(t.intersection(schema).default(data).parse(undefined)).toEqual(generateSuccess(data))
    expect(
      t
        .intersection(schema)
        .preprocess(() => data)
        .parse(undefined)
    ).toEqual(generateSuccess(data))
  })

  it('should not parse', () => {
    expect(t.intersection(schema).parse({ name: 'John' })).toEqual(generateError({ message: 'Value must be a number', path: ['age'], code: IssueCode.InvalidType }))
    expect(t.intersection(schema).parse({ age: 18 })).toEqual(generateError({ message: 'Value must be a string', path: ['name'], code: IssueCode.InvalidType }))
    expect(t.intersection(schema).parse('string')).toEqual(generateError({ message: 'Value must be an object', path: [], code: IssueCode.InvalidType }, { message: 'Value must be an object', path: [], code: IssueCode.InvalidType }))
    expect(t.intersection(schema).parse(1)).toEqual(generateError({ message: 'Value must be an object', path: [], code: IssueCode.InvalidType }, { message: 'Value must be an object', path: [], code: IssueCode.InvalidType }))
    expect(t.intersection(schema).parse(true)).toEqual(generateError({ message: 'Value must be an object', path: [], code: IssueCode.InvalidType }, { message: 'Value must be an object', path: [], code: IssueCode.InvalidType }))
    expect(t.intersection(schema).parse([])).toEqual(generateError({ message: 'Value must be an object', path: [], code: IssueCode.InvalidType }, { message: 'Value must be an object', path: [], code: IssueCode.InvalidType }))
  })

  it('should parse async', async () => {
    expect(
      await t
        .intersection(schema)
        .transform(async v => ({ ...v, name: v.name.toUpperCase() }))
        .parseAsync(data)
    ).toEqual(generateSuccess({ ...data, name: data.name.toUpperCase() }))
  })

  it('should validate', () => {
    expect(
      t
        .intersection(schema)
        .refine(v => v.name === 'John')
        .parse(data)
    ).toEqual(generateSuccess(data))
  })

  it('should not validate', () => {
    expect(
      t
        .intersection(schema)
        .refine(v => v.name === 'Doe')
        .parse(data)
    ).toEqual(generateError({ message: 'Refinement failed', path: [], code: IssueCode.RefinementFailed }))
  })

  it('should transform', () => {
    expect(
      t
        .intersection(schema)
        .transform(v => ({ ...v, name: v.name.toUpperCase() }))
        .parse(data)
    ).toEqual(generateSuccess({ ...data, name: data.name.toUpperCase() }))
  })

  it('should transform', () => {
    expect(
      t
        .intersection(schema)
        .mutate(v => String(v))
        .parse(data)
    ).toEqual(generateSuccess(String(data)))
  })
})
