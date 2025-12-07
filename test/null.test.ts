import { describe, expect, it } from 'vitest'
import type { Expect } from './utils'

import t, { constants, errors, type T } from '../src'

const _schema = t.null()
const _input: Expect<T.Input<typeof _schema>, null> = null as any
const _output: Expect<T.Output<typeof _schema>, null> = null as any

describe('null schema', () => {
  it('should be defined', () => {
    expect(t.null).toBeDefined()
  })

  it('should parse', async () => {
    expect(t.null().parse(null)).toEqual(null)
    await expect(t.null().parseAsync(null)).resolves.toEqual(null)

    expect(t.null().safeParse(null)).toEqual({ success: true, data: null })
    await expect(t.null().safeParseAsync(null)).resolves.toEqual({ success: true, data: null })
  })

  it('should parse default value', async () => {
    expect(t.null().default(null).parse(undefined)).toEqual(null)
    expect(
      t
        .null()
        .default(() => null)
        .parse(undefined)
    ).toEqual(null)
    await expect(
      t
        .null()
        .default(async () => null)
        .parseAsync(undefined)
    ).resolves.toEqual(null)

    expect(t.null().fallback(null).parse('foo')).toEqual(null)
    expect(
      t
        .null()
        .fallback(() => null)
        .parse('foo')
    ).toEqual(null)
    await expect(
      t
        .null()
        .fallback(async () => null)
        .parseAsync('foo')
    ).resolves.toEqual(null)
  })

  it('should fail parse', async () => {
    expect(() => t.null().parse('foo')).toThrow(errors.TyrunError)
    await expect(t.null().parseAsync('foo')).rejects.toThrow(errors.TyrunError)

    expect(t.null().safeParse('foo')).toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })
    await expect(t.null().safeParseAsync('foo')).resolves.toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })

    expect(() => t.null().parse(123)).toThrow(errors.TyrunError)
    expect(() => t.null().parse(123n)).toThrow(errors.TyrunError)
    expect(() => t.null().parse(true)).toThrow(errors.TyrunError)
    expect(() => t.null().parse(Symbol())).toThrow(errors.TyrunError)
    expect(() => t.null().parse(undefined)).toThrow(errors.TyrunError)
    expect(() => t.null().parse({})).toThrow(errors.TyrunError)
    expect(() => t.null().parse([])).toThrow(errors.TyrunError)
    expect(() => t.null().parse(new Date())).toThrow(errors.TyrunError)
    expect(() => t.null().parse(new File([''], 'bar'))).toThrow(errors.TyrunError)
  })

  it('should throw `TyrunRuntimeError`', () => {
    expect(() =>
      t
        .null()
        .default(async () => null)
        .parse(undefined)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .null()
        .validate(async () => 'Invalid value')
        .parse(null)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .null()
        .process(async () => null)
        .parse(null)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .null()
        .preprocess(async () => null)
        .parse(null)
    ).toThrow(errors.TyrunRuntimeError)
  })

  it('should parse with custom validators', () => {
    expect(
      t
        .null()
        .validate(v => (v === null ? null : 'Invalid value'))
        .parse(null)
    ).toEqual(null)
  })

  it('should fail parse with custom validators', () => {
    expect(() =>
      t
        .null()
        .validate(v => (v !== null ? null : 'Invalid value'))
        .parse(null)
    ).toThrow(errors.TyrunError)
  })

  it('should parse with custom processors and preprocessors', () => {
    expect(
      t
        .null()
        .process(v => v)
        .parse(null)
    ).toEqual(null)
    expect(
      t
        .null()
        .preprocess<null>(v => v)
        .parse(null)
    ).toEqual(null)
  })
})
