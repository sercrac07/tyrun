import { describe, expect, it } from 'vitest'
import type { Expect } from './utils'

import t, { constants, errors, type T } from '../src'

const _schema = t.number()
const _input: Expect<T.Input<typeof _schema>, number> = null as any
const _output: Expect<T.Output<typeof _schema>, number> = null as any

describe('number schema', () => {
  it('should be defined', () => {
    expect(t.number).toBeDefined()
  })

  it('should parse', async () => {
    expect(t.number().parse(123)).toEqual(123)
    await expect(t.number().parseAsync(123)).resolves.toEqual(123)

    expect(t.number().safeParse(123)).toEqual({ success: true, data: 123 })
    await expect(t.number().safeParseAsync(123)).resolves.toEqual({ success: true, data: 123 })
  })

  it('should parse default value', async () => {
    expect(t.number().default(123).parse(undefined)).toEqual(123)
    expect(
      t
        .number()
        .default(() => 123)
        .parse(undefined)
    ).toEqual(123)
    await expect(
      t
        .number()
        .default(async () => 123)
        .parseAsync(undefined)
    ).resolves.toEqual(123)

    expect(t.number().fallback(123).parse('foo')).toEqual(123)
    expect(
      t
        .number()
        .fallback(() => 123)
        .parse('foo')
    ).toEqual(123)
    await expect(
      t
        .number()
        .fallback(async () => 123)
        .parseAsync('foo')
    ).resolves.toEqual(123)
  })

  it('should fail parse', async () => {
    expect(() => t.number().parse('foo')).toThrow(errors.TyrunError)
    await expect(t.number().parseAsync('foo')).rejects.toThrow(errors.TyrunError)

    expect(t.number().safeParse('foo')).toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })
    await expect(t.number().safeParseAsync('foo')).resolves.toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })

    expect(() => t.number().parse(NaN)).toThrow(errors.TyrunError)
    expect(() => t.number().parse(123n)).toThrow(errors.TyrunError)
    expect(() => t.number().parse(true)).toThrow(errors.TyrunError)
    expect(() => t.number().parse(Symbol())).toThrow(errors.TyrunError)
    expect(() => t.number().parse(undefined)).toThrow(errors.TyrunError)
    expect(() => t.number().parse(null)).toThrow(errors.TyrunError)
    expect(() => t.number().parse({})).toThrow(errors.TyrunError)
    expect(() => t.number().parse([])).toThrow(errors.TyrunError)
    expect(() => t.number().parse(new Date())).toThrow(errors.TyrunError)
    expect(() => t.number().parse(new File([''], 'bar'))).toThrow(errors.TyrunError)
  })

  it('should throw `TyrunRuntimeError`', () => {
    expect(() =>
      t
        .number()
        .default(async () => 123)
        .parse(undefined)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .number()
        .validate(async () => 'Invalid value')
        .parse(123)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .number()
        .process(async () => 123)
        .parse(123)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .number()
        .preprocess(async () => 123)
        .parse(123)
    ).toThrow(errors.TyrunRuntimeError)
  })

  it('should parse with validators', () => {
    expect(t.number().min(123).parse(123)).toEqual(123)
    expect(t.number().max(123).parse(123)).toEqual(123)
    expect(t.number().integer().parse(123)).toEqual(123)
    expect(t.number().positive().parse(123)).toEqual(123)
    expect(t.number().negative().parse(-123)).toEqual(-123)
  })

  it('should fail parse with validators', () => {
    expect(() => t.number().min(124).parse(123)).toThrow(errors.TyrunError)
    expect(() => t.number().max(122).parse(123)).toThrow(errors.TyrunError)
    expect(() => t.number().integer().parse(123.123)).toThrow(errors.TyrunError)
    expect(() => t.number().positive().parse(-123)).toThrow(errors.TyrunError)
    expect(() => t.number().negative().parse(123)).toThrow(errors.TyrunError)
  })

  it('should parse with custom validators', () => {
    expect(
      t
        .number()
        .validate(v => (v === 123 ? null : 'Invalid value'))
        .parse(123)
    ).toEqual(123)
  })

  it('should fail parse with custom validators', () => {
    expect(() =>
      t
        .number()
        .validate(v => (v !== 123 ? null : 'Invalid value'))
        .parse(123)
    ).toThrow(errors.TyrunError)
  })

  it('should parse with custom processors and preprocessors', () => {
    expect(
      t
        .number()
        .process(v => v * 2)
        .parse(123)
    ).toEqual(246)
    expect(
      t
        .number()
        .preprocess<number>(v => v * 2)
        .parse(123)
    ).toEqual(246)
  })
})
