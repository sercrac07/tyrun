import { describe, expect, it } from 'vitest'
import type { Expect } from './utils'

import { constants, errors, t, type T } from '../src'

const _schema = t.record(t.string(), t.string())
const _input: Expect<T.Input<typeof _schema>, Record<string, string>> = null as any
const _output: Expect<T.Output<typeof _schema>, Record<string, string>> = null as any

describe('record schema', () => {
  it('should be defined', () => {
    expect(t.record).toBeDefined()
  })

  it('should parse', async () => {
    expect(t.record(t.string(), t.string()).parse({ foo: 'bar' })).toEqual({ foo: 'bar' })
    await expect(t.record(t.string(), t.string()).parseAsync({ foo: 'bar' })).resolves.toEqual({ foo: 'bar' })

    expect(t.record(t.string(), t.string()).safeParse({ foo: 'bar' })).toEqual({ success: true, data: { foo: 'bar' } })
    await expect(t.record(t.string(), t.string()).safeParseAsync({ foo: 'bar' })).resolves.toEqual({ success: true, data: { foo: 'bar' } })
  })

  it('should parse default value', async () => {
    expect(t.record(t.string(), t.string()).default({ foo: 'bar' }).parse(undefined)).toEqual({ foo: 'bar' })
    expect(
      t
        .record(t.string(), t.string())
        .default(() => ({ foo: 'bar' }))
        .parse(undefined)
    ).toEqual({ foo: 'bar' })
    await expect(
      t
        .record(t.string(), t.string())
        .default(async () => ({ foo: 'bar' }))
        .parseAsync(undefined)
    ).resolves.toEqual({ foo: 'bar' })

    expect(t.record(t.string(), t.string()).fallback({ foo: 'bar' }).parse('foo')).toEqual({ foo: 'bar' })
    expect(
      t
        .record(t.string(), t.string())
        .fallback(() => ({ foo: 'bar' }))
        .parse('foo')
    ).toEqual({ foo: 'bar' })
    await expect(
      t
        .record(t.string(), t.string())
        .fallback(async () => ({ foo: 'bar' }))
        .parseAsync('foo')
    ).resolves.toEqual({ foo: 'bar' })
  })

  it('should fail parse', async () => {
    expect(() => t.record(t.string(), t.string()).parse('foo')).toThrow(errors.TyrunError)
    await expect(t.record(t.string(), t.string()).parseAsync('foo')).rejects.toThrow(errors.TyrunError)

    expect(t.record(t.string(), t.string()).safeParse('foo')).toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })
    await expect(t.record(t.string(), t.string()).safeParseAsync('foo')).resolves.toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })

    expect(() => t.record(t.string(), t.string()).parse(123)).toThrow(errors.TyrunError)
    expect(() => t.record(t.string(), t.string()).parse(123n)).toThrow(errors.TyrunError)
    expect(() => t.record(t.string(), t.string()).parse(true)).toThrow(errors.TyrunError)
    expect(() => t.record(t.string(), t.string()).parse(Symbol())).toThrow(errors.TyrunError)
    expect(() => t.record(t.string(), t.string()).parse(undefined)).toThrow(errors.TyrunError)
    expect(() => t.record(t.string(), t.string()).parse(null)).toThrow(errors.TyrunError)
    expect(() => t.record(t.string(), t.string()).parse([])).toThrow(errors.TyrunError)
    expect(() => t.record(t.string(), t.string()).parse({ foo: 123 })).toThrow(errors.TyrunError)
    // Both Date and File are objects and aren't suposed to be parsed as records
    // expect(() => t.record(t.string(), t.string()).parse(new Date())).toThrow(errors.TyrunError)
    // expect(() => t.record(t.string(), t.string()).parse(new File([''], 'bar'))).toThrow(errors.TyrunError)
  })

  it('should access inner properties', () => {
    expect(t.record(t.string(), t.string()).key).toEqual(t.string())
    expect(t.record(t.string(), t.string()).value).toEqual(t.string())
  })

  it('should throw `TyrunRuntimeError`', () => {
    expect(() =>
      t
        .record(t.string(), t.string())
        .default(async () => ({ foo: 'bar' }))
        .parse(undefined)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .record(t.string(), t.string())
        .validate(async () => 'Invalid value')
        .parse({ foo: 'bar' })
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .record(t.string(), t.string())
        .process(async () => ({ foo: 'bar' }))
        .parse({ foo: 'bar' })
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .record(t.string(), t.string())
        .preprocess(async () => ({ foo: 'bar' }))
        .parse({ foo: 'bar' })
    ).toThrow(errors.TyrunRuntimeError)
  })

  it('should parse with custom validators', () => {
    expect(
      t
        .record(t.string(), t.string())
        .validate(v => (v.foo === 'bar' ? null : 'Invalid value'))
        .parse({ foo: 'bar' })
    ).toEqual({ foo: 'bar' })
  })

  it('should fail parse with custom validators', () => {
    expect(() =>
      t
        .record(t.string(), t.string())
        .validate(v => (v.foo !== 'bar' ? null : 'Invalid value'))
        .parse({ foo: 'bar' })
    ).toThrow(errors.TyrunError)
  })

  it('should parse with custom processors and preprocessors', () => {
    expect(
      t
        .record(t.string(), t.string())
        .process(v => ({ foo: v.foo.toLowerCase() }))
        .parse({ foo: 'FOO' })
    ).toEqual({ foo: 'foo' })
    expect(
      t
        .record(t.string(), t.string())
        .preprocess<{ foo: string }>(v => ({ foo: v.foo.toLowerCase() }))
        .parse({ foo: 'FOO' })
    ).toEqual({ foo: 'foo' })
  })
})
