import { describe, expect, it } from 'vitest'
import type { Expect } from './utils'

import t, { constants, errors, type T } from '../src'

const _schema = t.booleanish()
const _input: Expect<T.Input<typeof _schema>, string> = null as any
const _output: Expect<T.Output<typeof _schema>, boolean> = null as any

describe('booleanish schema', () => {
  it('should be defined', () => {
    expect(t.booleanish).toBeDefined()
  })

  it('should parse', async () => {
    expect(t.booleanish().parse('yes')).toEqual(true)
    await expect(t.booleanish().parseAsync('no')).resolves.toEqual(false)

    expect(t.booleanish().safeParse('y')).toEqual({ success: true, data: true })
    await expect(t.booleanish().safeParseAsync('n')).resolves.toEqual({ success: true, data: false })
  })

  it('should parse default value', async () => {
    expect(t.booleanish().default(true).parse(undefined)).toEqual(true)
    expect(
      t
        .booleanish()
        .default(() => true)
        .parse(undefined)
    ).toEqual(true)
    await expect(
      t
        .booleanish()
        .default(async () => true)
        .parseAsync(undefined)
    ).resolves.toEqual(true)

    expect(t.booleanish().fallback(true).parse('foo')).toEqual(true)
    expect(
      t
        .booleanish()
        .fallback(() => true)
        .parse('foo')
    ).toEqual(true)
    await expect(
      t
        .booleanish()
        .fallback(async () => true)
        .parseAsync('foo')
    ).resolves.toEqual(true)
  })

  it('should fail parse', async () => {
    expect(() => t.booleanish().parse('foo')).toThrow(errors.TyrunError)
    await expect(t.booleanish().parseAsync('foo')).rejects.toThrow(errors.TyrunError)

    expect(t.booleanish().safeParse('foo')).toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })
    await expect(t.booleanish().safeParseAsync('foo')).resolves.toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })

    expect(() => t.booleanish().parse(123)).toThrow(errors.TyrunError)
    expect(() => t.booleanish().parse(123n)).toThrow(errors.TyrunError)
    expect(() => t.booleanish().parse(true)).toThrow(errors.TyrunError)
    expect(() => t.booleanish().parse(false)).toThrow(errors.TyrunError)
    expect(() => t.booleanish().parse(Symbol())).toThrow(errors.TyrunError)
    expect(() => t.booleanish().parse(undefined)).toThrow(errors.TyrunError)
    expect(() => t.booleanish().parse(null)).toThrow(errors.TyrunError)
    expect(() => t.booleanish().parse({})).toThrow(errors.TyrunError)
    expect(() => t.booleanish().parse([])).toThrow(errors.TyrunError)
    expect(() => t.booleanish().parse(new Date())).toThrow(errors.TyrunError)
    expect(() => t.booleanish().parse(new File([''], 'bar'))).toThrow(errors.TyrunError)
  })

  it('should throw `TyrunRuntimeError`', () => {
    expect(() =>
      t
        .booleanish()
        .default(async () => true)
        .parse(undefined)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .booleanish()
        .validate(async () => 'Invalid value')
        .parse('yes')
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .booleanish()
        .process(async () => true)
        .parse('yes')
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .booleanish()
        .preprocess(async () => 'yes')
        .parse('yes')
    ).toThrow(errors.TyrunRuntimeError)
  })

  it('should parse with custom validators', () => {
    expect(
      t
        .booleanish()
        .validate(v => (v === true ? null : 'Invalid value'))
        .parse('yes')
    ).toEqual(true)
  })

  it('should fail parse with custom validators', () => {
    expect(() =>
      t
        .booleanish()
        .validate(v => (v !== true ? null : 'Invalid value'))
        .parse('yes')
    ).toThrow(errors.TyrunError)
  })

  it('should parse with custom processors and preprocessors', () => {
    expect(
      t
        .booleanish()
        .process(v => !v)
        .parse('no')
    ).toEqual(true)
    expect(
      t
        .booleanish()
        .preprocess<string>(v => (v === 'no' ? 'yes' : 'no'))
        .parse('no')
    ).toEqual(true)
  })
})
