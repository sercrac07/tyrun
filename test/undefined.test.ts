import { describe, expect, it } from 'vitest'
import type { Expect } from './utils'

import { constants, errors, t, type T } from '../src'

const _schema = t.undefined()
const _input: Expect<T.Input<typeof _schema>, undefined> = null as any
const _output: Expect<T.Output<typeof _schema>, undefined> = null as any

describe('undefined schema', () => {
  it('should be defined', () => {
    expect(t.undefined).toBeDefined()
  })

  it('should parse', async () => {
    expect(t.undefined().parse(undefined)).toEqual(undefined)
    await expect(t.undefined().parseAsync(undefined)).resolves.toEqual(undefined)

    expect(t.undefined().safeParse(undefined)).toEqual({ success: true, data: undefined })
    await expect(t.undefined().safeParseAsync(undefined)).resolves.toEqual({ success: true, data: undefined })
  })

  it('should parse default value', async () => {
    expect(t.undefined().default(undefined).parse(undefined)).toEqual(undefined)
    expect(
      t
        .undefined()
        .default(() => undefined)
        .parse(undefined)
    ).toEqual(undefined)
    await expect(
      t
        .undefined()
        .default(async () => undefined)
        .parseAsync(undefined)
    ).resolves.toEqual(undefined)

    // This throws an error because `fallback` is undefined so it is not called
    // expect(t.undefined().fallback(undefined).parse('foo')).toEqual(undefined)
    expect(
      t
        .undefined()
        .fallback(() => undefined)
        .parse('foo')
    ).toEqual(undefined)
    await expect(
      t
        .undefined()
        .fallback(async () => undefined)
        .parseAsync('foo')
    ).resolves.toEqual(undefined)
  })

  it('should fail parse', async () => {
    expect(() => t.undefined().parse('foo')).toThrow(errors.TyrunError)
    await expect(t.undefined().parseAsync('foo')).rejects.toThrow(errors.TyrunError)

    expect(t.undefined().safeParse('foo')).toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })
    await expect(t.undefined().safeParseAsync('foo')).resolves.toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })

    expect(() => t.undefined().parse(123)).toThrow(errors.TyrunError)
    expect(() => t.undefined().parse(123n)).toThrow(errors.TyrunError)
    expect(() => t.undefined().parse(true)).toThrow(errors.TyrunError)
    expect(() => t.undefined().parse(Symbol())).toThrow(errors.TyrunError)
    expect(() => t.undefined().parse(null)).toThrow(errors.TyrunError)
    expect(() => t.undefined().parse({})).toThrow(errors.TyrunError)
    expect(() => t.undefined().parse([])).toThrow(errors.TyrunError)
    expect(() => t.undefined().parse(new Date())).toThrow(errors.TyrunError)
    expect(() => t.undefined().parse(new File([''], 'bar'))).toThrow(errors.TyrunError)
  })

  it('should throw `TyrunRuntimeError`', () => {
    expect(() =>
      t
        .undefined()
        .default(async () => undefined)
        .parse(undefined)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .undefined()
        .validate(async () => 'Invalid value')
        .parse(undefined)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .undefined()
        .process(async () => undefined)
        .parse(undefined)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .undefined()
        .preprocess(async () => undefined)
        .parse(undefined)
    ).toThrow(errors.TyrunRuntimeError)
  })

  it('should parse with custom validators', () => {
    expect(
      t
        .undefined()
        .validate(v => (v === undefined ? null : 'Invalid value'))
        .parse(undefined)
    ).toEqual(undefined)
  })

  it('should fail parse with custom validators', () => {
    expect(() =>
      t
        .undefined()
        .validate(v => (v !== undefined ? null : 'Invalid value'))
        .parse(undefined)
    ).toThrow(errors.TyrunError)
  })

  it('should parse with custom processors and preprocessors', () => {
    expect(
      t
        .undefined()
        .process(v => v)
        .parse(undefined)
    ).toEqual(undefined)
    expect(
      t
        .undefined()
        .preprocess<undefined>(v => v)
        .parse(undefined)
    ).toEqual(undefined)
  })
})
