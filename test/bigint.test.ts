import { describe, expect, it } from 'vitest'
import type { Expect } from './utils'

import t, { constants, errors, type T } from '../src'

const _schema = t.bigint()
const _input: Expect<T.Input<typeof _schema>, bigint> = null as any
const _output: Expect<T.Output<typeof _schema>, bigint> = null as any

describe('bigint schema', () => {
  it('should be defined', () => {
    expect(t.bigint).toBeDefined()
  })

  it('should parse', async () => {
    expect(t.bigint().parse(123n)).toEqual(123n)
    await expect(t.bigint().parseAsync(123n)).resolves.toEqual(123n)

    expect(t.bigint().safeParse(123n)).toEqual({ success: true, data: 123n })
    await expect(t.bigint().safeParseAsync(123n)).resolves.toEqual({ success: true, data: 123n })
  })

  it('should parse default value', async () => {
    expect(t.bigint().default(123n).parse(undefined)).toEqual(123n)
    expect(
      t
        .bigint()
        .default(() => 123n)
        .parse(undefined)
    ).toEqual(123n)
    await expect(
      t
        .bigint()
        .default(async () => 123n)
        .parseAsync(undefined)
    ).resolves.toEqual(123n)

    expect(t.bigint().fallback(123n).parse('foo')).toEqual(123n)
    expect(
      t
        .bigint()
        .fallback(() => 123n)
        .parse('foo')
    ).toEqual(123n)
    await expect(
      t
        .bigint()
        .fallback(async () => 123n)
        .parseAsync('foo')
    ).resolves.toEqual(123n)
  })

  it('should fail parse', async () => {
    expect(() => t.bigint().parse('foo')).toThrow(errors.TyrunError)
    await expect(t.bigint().parseAsync('foo')).rejects.toThrow(errors.TyrunError)

    expect(t.bigint().safeParse('foo')).toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })
    await expect(t.bigint().safeParseAsync('foo')).resolves.toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })

    expect(() => t.bigint().parse(123)).toThrow(errors.TyrunError)
    expect(() => t.bigint().parse(NaN)).toThrow(errors.TyrunError)
    expect(() => t.bigint().parse(true)).toThrow(errors.TyrunError)
    expect(() => t.bigint().parse(Symbol())).toThrow(errors.TyrunError)
    expect(() => t.bigint().parse(undefined)).toThrow(errors.TyrunError)
    expect(() => t.bigint().parse(null)).toThrow(errors.TyrunError)
    expect(() => t.bigint().parse({})).toThrow(errors.TyrunError)
    expect(() => t.bigint().parse([])).toThrow(errors.TyrunError)
    expect(() => t.bigint().parse(new Date())).toThrow(errors.TyrunError)
    expect(() => t.bigint().parse(new File([''], 'bar'))).toThrow(errors.TyrunError)
  })

  it('should throw `TyrunRuntimeError`', () => {
    expect(() =>
      t
        .bigint()
        .default(async () => 123n)
        .parse(undefined)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .bigint()
        .validate(async () => 'Invalid value')
        .parse(123n)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .bigint()
        .process(async () => 123n)
        .parse(123n)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .bigint()
        .preprocess(async () => 123n)
        .parse(123n)
    ).toThrow(errors.TyrunRuntimeError)
  })

  it('should parse with validators', () => {
    expect(t.bigint().min(123n).parse(123n)).toEqual(123n)
    expect(t.bigint().max(123n).parse(123n)).toEqual(123n)
    expect(t.bigint().positive().parse(123n)).toEqual(123n)
    expect(t.bigint().negative().parse(-123n)).toEqual(-123n)
  })

  it('should fail parse with validators', () => {
    expect(() => t.bigint().min(124n).parse(123n)).toThrow(errors.TyrunError)
    expect(() => t.bigint().max(122n).parse(123n)).toThrow(errors.TyrunError)
    expect(() => t.bigint().positive().parse(-123n)).toThrow(errors.TyrunError)
    expect(() => t.bigint().negative().parse(123n)).toThrow(errors.TyrunError)
  })

  it('should parse with custom validators', () => {
    expect(
      t
        .bigint()
        .validate(v => (v === 123n ? null : 'Invalid value'))
        .parse(123n)
    ).toEqual(123n)
  })

  it('should fail parse with custom validators', () => {
    expect(() =>
      t
        .bigint()
        .validate(v => (v !== 123n ? null : 'Invalid value'))
        .parse(123n)
    ).toThrow(errors.TyrunError)
  })

  it('should parse with custom processors and preprocessors', () => {
    expect(
      t
        .bigint()
        .process(v => v * 2n)
        .parse(123n)
    ).toEqual(246n)
    expect(
      t
        .bigint()
        .preprocess<bigint>(v => v * 2n)
        .parse(123n)
    ).toEqual(246n)
  })
})
