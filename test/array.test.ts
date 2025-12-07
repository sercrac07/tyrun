import { describe, expect, it } from 'vitest'
import type { Expect } from './utils'

import t, { constants, errors, type T } from '../src'

const _schema = t.array(t.string())
const _input: Expect<T.Input<typeof _schema>, string[]> = null as any
const _output: Expect<T.Output<typeof _schema>, string[]> = null as any

describe('array schema', () => {
  it('should be defined', () => {
    expect(t.array).toBeDefined()
  })

  it('should parse', async () => {
    expect(t.array(t.string()).parse(['foo'])).toEqual(['foo'])
    await expect(t.array(t.string()).parseAsync(['foo'])).resolves.toEqual(['foo'])

    expect(t.array(t.string()).safeParse(['foo'])).toEqual({ success: true, data: ['foo'] })
    await expect(t.array(t.string()).safeParseAsync(['foo'])).resolves.toEqual({ success: true, data: ['foo'] })
  })

  it('should parse default value', async () => {
    expect(t.array(t.string()).default(['foo']).parse(undefined)).toEqual(['foo'])
    expect(
      t
        .array(t.string())
        .default(() => ['foo'])
        .parse(undefined)
    ).toEqual(['foo'])
    await expect(
      t
        .array(t.string())
        .default(async () => ['foo'] as const)
        .parseAsync(undefined)
    ).resolves.toEqual(['foo'])

    expect(t.array(t.string()).fallback(['foo']).parse('foo')).toEqual(['foo'])
    expect(
      t
        .array(t.string())
        .fallback(() => ['foo'])
        .parse('foo')
    ).toEqual(['foo'])
    await expect(
      t
        .array(t.string())
        .fallback(async () => ['foo'] as const)
        .parseAsync('foo')
    ).resolves.toEqual(['foo'])
  })

  it('should fail parse', async () => {
    expect(() => t.array(t.string()).parse('foo')).toThrow(errors.TyrunError)
    await expect(t.array(t.string()).parseAsync('foo')).rejects.toThrow(errors.TyrunError)

    expect(t.array(t.string()).safeParse('foo')).toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })
    await expect(t.array(t.string()).safeParseAsync('foo')).resolves.toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })

    expect(() => t.array(t.string()).parse(123)).toThrow(errors.TyrunError)
    expect(() => t.array(t.string()).parse(123n)).toThrow(errors.TyrunError)
    expect(() => t.array(t.string()).parse(true)).toThrow(errors.TyrunError)
    expect(() => t.array(t.string()).parse(Symbol())).toThrow(errors.TyrunError)
    expect(() => t.array(t.string()).parse(undefined)).toThrow(errors.TyrunError)
    expect(() => t.array(t.string()).parse(null)).toThrow(errors.TyrunError)
    expect(() => t.array(t.string()).parse([123])).toThrow(errors.TyrunError)
    expect(() => t.array(t.string()).parse({})).toThrow(errors.TyrunError)
    expect(() => t.array(t.string()).parse(new Date())).toThrow(errors.TyrunError)
    expect(() => t.array(t.string()).parse(new File([''], 'bar'))).toThrow(errors.TyrunError)
  })

  it('should access inner properties', () => {
    expect(t.array(t.string()).schema).toEqual(t.string())
  })

  it('should throw `TyrunRuntimeError`', () => {
    expect(() =>
      t
        .array(t.string())
        .default(async () => ['foo'])
        .parse(undefined)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .array(t.string())
        .validate(async () => 'Invalid value')
        .parse(['foo'])
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .array(t.string())
        .process(async () => ['foo'])
        .parse(['foo'])
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .array(t.string())
        .preprocess(async () => ['foo'])
        .parse(['foo'])
    ).toThrow(errors.TyrunRuntimeError)
  })

  it('should parse with validators', () => {
    expect(t.array(t.string()).nonEmpty().parse(['foo'])).toEqual(['foo'])
    expect(t.array(t.string()).min(1).parse(['foo'])).toEqual(['foo'])
    expect(t.array(t.string()).max(1).parse(['foo'])).toEqual(['foo'])
  })

  it('should fail parse with validators', () => {
    expect(() => t.array(t.string()).nonEmpty().parse([])).toThrow(errors.TyrunError)
    expect(() => t.array(t.string()).min(2).parse(['foo'])).toThrow(errors.TyrunError)
    expect(() => t.array(t.string()).max(0).parse(['foo'])).toThrow(errors.TyrunError)
  })

  it('should parse with custom validators', () => {
    expect(
      t
        .array(t.string())
        .validate(v => (v.length === 1 ? null : 'Invalid value'))
        .parse(['foo'])
    ).toEqual(['foo'])
  })

  it('should fail parse with custom validators', () => {
    expect(() =>
      t
        .array(t.string())
        .validate(v => (v.length !== 1 ? null : 'Invalid value'))
        .parse(['foo'])
    ).toThrow(errors.TyrunError)
  })

  it('should parse with custom processors and preprocessors', () => {
    expect(
      t
        .array(t.string())
        .process(v => v.map(i => i.toLowerCase()))
        .parse(['FOO'])
    ).toEqual(['foo'])
    expect(
      t
        .array(t.string())
        .preprocess<string[]>(v => v.map(i => i.toLowerCase()))
        .parse(['FOO'])
    ).toEqual(['foo'])
  })
})
