import { describe, expect, it } from 'vitest'
import type { Expect } from './utils'

import { constants, errors, t, type T } from '../src'

const _schema = t.nullable(t.string())
const _input: Expect<T.Input<typeof _schema>, string | null> = null as any
const _output: Expect<T.Output<typeof _schema>, string | null> = null as any

describe('nullable schema', () => {
  it('should be defined', () => {
    expect(t.nullable).toBeDefined()
  })

  it('should parse', async () => {
    expect(t.nullable(t.string()).parse('foo')).toEqual('foo')
    await expect(t.nullable(t.string()).parseAsync(null)).resolves.toEqual(null)

    expect(t.nullable(t.string()).safeParse('foo')).toEqual({ success: true, data: 'foo' })
    await expect(t.nullable(t.string()).safeParseAsync(null)).resolves.toEqual({ success: true, data: null })
  })

  it('should parse default value', async () => {
    expect(t.nullable(t.string()).default('foo').parse(undefined)).toEqual('foo')
    expect(
      t
        .nullable(t.string())
        .default(() => 'foo')
        .parse(undefined)
    ).toEqual('foo')
    await expect(
      t
        .nullable(t.string())
        .default(async () => 'foo')
        .parseAsync(undefined)
    ).resolves.toEqual('foo')

    expect(t.nullable(t.string()).fallback('foo').parse(123)).toEqual('foo')
    expect(
      t
        .nullable(t.string())
        .fallback(() => 'foo')
        .parse(123)
    ).toEqual('foo')
    await expect(
      t
        .nullable(t.string())
        .fallback(async () => 'foo')
        .parseAsync(123)
    ).resolves.toEqual('foo')
  })

  it('should fail parse', async () => {
    expect(() => t.nullable(t.string()).parse(123)).toThrow(errors.TyrunError)
    await expect(t.nullable(t.string()).parseAsync(123)).rejects.toThrow(errors.TyrunError)

    expect(t.nullable(t.string()).safeParse(123)).toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })
    await expect(t.nullable(t.string()).safeParseAsync(123)).resolves.toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })

    expect(() => t.nullable(t.string()).parse(123n)).toThrow(errors.TyrunError)
    expect(() => t.nullable(t.string()).parse(true)).toThrow(errors.TyrunError)
    expect(() => t.nullable(t.string()).parse(Symbol())).toThrow(errors.TyrunError)
    expect(() => t.nullable(t.string()).parse(undefined)).toThrow(errors.TyrunError)
    expect(() => t.nullable(t.string()).parse({})).toThrow(errors.TyrunError)
    expect(() => t.nullable(t.string()).parse([])).toThrow(errors.TyrunError)
    expect(() => t.nullable(t.string()).parse(new Date())).toThrow(errors.TyrunError)
    expect(() => t.nullable(t.string()).parse(new File([''], 'bar'))).toThrow(errors.TyrunError)
  })

  it('should access inner properties', () => {
    expect(t.nullable(t.string()).schema).toEqual(t.string())
  })

  it('should throw `TyrunRuntimeError`', () => {
    expect(() =>
      t
        .nullable(t.string())
        .default(async () => 'foo')
        .parse(undefined)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .nullable(t.string())
        .validate(async () => 'Invalid value')
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .nullable(t.string())
        .process(async () => 'foo')
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .nullable(t.string())
        .preprocess(async () => 'foo')
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
  })

  it('should parse with custom validators', () => {
    expect(
      t
        .nullable(t.string())
        .validate(v => (v === 'foo' ? null : 'Invalid value'))
        .parse('foo')
    ).toEqual('foo')
  })

  it('should fail parse with custom validators', () => {
    expect(() =>
      t
        .nullable(t.string())
        .validate(v => (v !== 'foo' ? null : 'Invalid value'))
        .parse('foo')
    ).toThrow(errors.TyrunError)
  })

  it('should parse with custom processors and preprocessors', () => {
    expect(
      t
        .nullable(t.string())
        .process(v => v?.trim() ?? null)
        .parse(' foo ')
    ).toEqual('foo')
    expect(
      t
        .nullable(t.string())
        .preprocess<string | null>(v => v?.trim() ?? null)
        .parse(' foo ')
    ).toEqual('foo')
  })
})
