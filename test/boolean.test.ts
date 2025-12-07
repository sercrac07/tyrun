import { describe, expect, it } from 'vitest'
import type { Expect } from './utils'

import t, { constants, errors, type T } from '../src'

const _schema = t.boolean()
const _input: Expect<T.Input<typeof _schema>, boolean> = null as any
const _output: Expect<T.Output<typeof _schema>, boolean> = null as any

describe('boolean schema', () => {
  it('should be defined', () => {
    expect(t.boolean).toBeDefined()
  })

  it('should parse', async () => {
    expect(t.boolean().parse(true)).toEqual(true)
    await expect(t.boolean().parseAsync(false)).resolves.toEqual(false)

    expect(t.boolean().safeParse(true)).toEqual({ success: true, data: true })
    await expect(t.boolean().safeParseAsync(false)).resolves.toEqual({ success: true, data: false })
  })

  it('should parse default value', async () => {
    expect(t.boolean().default(true).parse(undefined)).toEqual(true)
    expect(
      t
        .boolean()
        .default(() => true)
        .parse(undefined)
    ).toEqual(true)
    await expect(
      t
        .boolean()
        .default(async () => true)
        .parseAsync(undefined)
    ).resolves.toEqual(true)

    expect(t.boolean().fallback(true).parse('foo')).toEqual(true)
    expect(
      t
        .boolean()
        .fallback(() => true)
        .parse('foo')
    ).toEqual(true)
    await expect(
      t
        .boolean()
        .fallback(async () => true)
        .parseAsync('foo')
    ).resolves.toEqual(true)
  })

  it('should fail parse', async () => {
    expect(() => t.boolean().parse('foo')).toThrow(errors.TyrunError)
    await expect(t.boolean().parseAsync('foo')).rejects.toThrow(errors.TyrunError)

    expect(t.boolean().safeParse('foo')).toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })
    await expect(t.boolean().safeParseAsync('foo')).resolves.toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })

    expect(() => t.boolean().parse(123)).toThrow(errors.TyrunError)
    expect(() => t.boolean().parse(123n)).toThrow(errors.TyrunError)
    expect(() => t.boolean().parse(Symbol())).toThrow(errors.TyrunError)
    expect(() => t.boolean().parse(undefined)).toThrow(errors.TyrunError)
    expect(() => t.boolean().parse(null)).toThrow(errors.TyrunError)
    expect(() => t.boolean().parse({})).toThrow(errors.TyrunError)
    expect(() => t.boolean().parse([])).toThrow(errors.TyrunError)
    expect(() => t.boolean().parse(new Date())).toThrow(errors.TyrunError)
    expect(() => t.boolean().parse(new File([''], 'bar'))).toThrow(errors.TyrunError)
  })

  it('should throw `TyrunRuntimeError`', () => {
    expect(() =>
      t
        .boolean()
        .default(async () => true)
        .parse(undefined)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .boolean()
        .validate(async () => 'Invalid value')
        .parse(true)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .boolean()
        .process(async () => true)
        .parse(true)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .boolean()
        .preprocess(async () => true)
        .parse(true)
    ).toThrow(errors.TyrunRuntimeError)
  })

  it('should parse with custom validators', () => {
    expect(
      t
        .boolean()
        .validate(v => (v === true ? null : 'Invalid value'))
        .parse(true)
    ).toEqual(true)
  })

  it('should fail parse with custom validators', () => {
    expect(() =>
      t
        .boolean()
        .validate(v => (v !== true ? null : 'Invalid value'))
        .parse(true)
    ).toThrow(errors.TyrunError)
  })

  it('should parse with custom processors and preprocessors', () => {
    expect(
      t
        .boolean()
        .process(v => !v)
        .parse(false)
    ).toEqual(true)
    expect(
      t
        .boolean()
        .preprocess<boolean>(v => !v)
        .parse(false)
    ).toEqual(true)
  })
})
