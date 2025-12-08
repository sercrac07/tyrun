import { describe, expect, it } from 'vitest'
import type { Expect } from './utils'

import { constants, errors, t, type T } from '../src'

const _schema = t.symbol()
const _input: Expect<T.Input<typeof _schema>, symbol> = null as any
const _output: Expect<T.Output<typeof _schema>, symbol> = null as any

describe('symbol schema', () => {
  it('should be defined', () => {
    expect(t.symbol).toBeDefined()
  })

  const value = Symbol()

  it('should parse', async () => {
    expect(t.symbol().parse(value)).toEqual(value)
    await expect(t.symbol().parseAsync(value)).resolves.toEqual(value)

    expect(t.symbol().safeParse(value)).toEqual({ success: true, data: value })
    await expect(t.symbol().safeParseAsync(value)).resolves.toEqual({ success: true, data: value })
  })

  it('should parse default value', async () => {
    expect(t.symbol().default(value).parse(undefined)).toEqual(value)
    expect(
      t
        .symbol()
        .default(() => value)
        .parse(undefined)
    ).toEqual(value)
    await expect(
      t
        .symbol()
        .default(async () => value)
        .parseAsync(undefined)
    ).resolves.toEqual(value)

    expect(t.symbol().fallback(value).parse('foo')).toEqual(value)
    expect(
      t
        .symbol()
        .fallback(() => value)
        .parse('foo')
    ).toEqual(value)
    await expect(
      t
        .symbol()
        .fallback(async () => value)
        .parseAsync('foo')
    ).resolves.toEqual(value)
  })

  it('should fail parse', async () => {
    expect(() => t.symbol().parse('foo')).toThrow(errors.TyrunError)
    await expect(t.symbol().parseAsync('foo')).rejects.toThrow(errors.TyrunError)

    expect(t.symbol().safeParse('foo')).toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })
    await expect(t.symbol().safeParseAsync('foo')).resolves.toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })

    expect(() => t.symbol().parse(123)).toThrow(errors.TyrunError)
    expect(() => t.symbol().parse(123n)).toThrow(errors.TyrunError)
    expect(() => t.symbol().parse(true)).toThrow(errors.TyrunError)
    expect(() => t.symbol().parse(undefined)).toThrow(errors.TyrunError)
    expect(() => t.symbol().parse(null)).toThrow(errors.TyrunError)
    expect(() => t.symbol().parse({})).toThrow(errors.TyrunError)
    expect(() => t.symbol().parse([])).toThrow(errors.TyrunError)
    expect(() => t.symbol().parse(new Date())).toThrow(errors.TyrunError)
    expect(() => t.symbol().parse(new File([''], 'bar'))).toThrow(errors.TyrunError)
  })

  it('should throw `TyrunRuntimeError`', () => {
    expect(() =>
      t
        .symbol()
        .default(async () => value)
        .parse(undefined)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .symbol()
        .validate(async () => 'Invalid value')
        .parse(value)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .symbol()
        .process(async () => value)
        .parse(value)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .symbol()
        .preprocess(async () => value)
        .parse(value)
    ).toThrow(errors.TyrunRuntimeError)
  })

  it('should parse with custom validators', () => {
    expect(
      t
        .symbol()
        .validate(v => (v === value ? null : 'Invalid value'))
        .parse(value)
    ).toEqual(value)
  })

  it('should fail parse with custom validators', () => {
    expect(() =>
      t
        .symbol()
        .validate(v => (v !== value ? null : 'Invalid value'))
        .parse(value)
    ).toThrow(errors.TyrunError)
  })

  it('should parse with custom processors and preprocessors', () => {
    expect(
      t
        .symbol()
        .process(() => value)
        .parse(value)
    ).toEqual(value)
    expect(
      t
        .symbol()
        .preprocess<symbol>(() => value)
        .parse(value)
    ).toEqual(value)
  })
})
