import { describe, expect, it } from 'vitest'
import type { Expect } from './utils'

import t, { constants, errors, type T } from '../src'

const _schema = t.nullish(t.string())
const _input: Expect<T.Input<typeof _schema>, string | null | undefined> = null as any
const _output: Expect<T.Output<typeof _schema>, string | null | undefined> = null as any

describe('nullish schema', () => {
  it('should be defined', () => {
    expect(t.nullish).toBeDefined()
  })

  it('should parse', async () => {
    expect(t.nullish(t.string()).parse('foo')).toEqual('foo')
    await expect(t.nullish(t.string()).parseAsync(null)).resolves.toEqual(null)

    expect(t.nullish(t.string()).safeParse('foo')).toEqual({ success: true, data: 'foo' })
    await expect(t.nullish(t.string()).safeParseAsync(undefined)).resolves.toEqual({ success: true, data: undefined })
  })

  it('should parse default value', async () => {
    expect(t.nullish(t.string()).default('foo').parse(undefined)).toEqual('foo')
    expect(
      t
        .nullish(t.string())
        .default(() => 'foo')
        .parse(undefined)
    ).toEqual('foo')
    await expect(
      t
        .nullish(t.string())
        .default(async () => 'foo')
        .parseAsync(undefined)
    ).resolves.toEqual('foo')

    expect(t.nullish(t.string()).fallback('foo').parse(123)).toEqual('foo')
    expect(
      t
        .nullish(t.string())
        .fallback(() => 'foo')
        .parse(123)
    ).toEqual('foo')
    await expect(
      t
        .nullish(t.string())
        .fallback(async () => 'foo')
        .parseAsync(123)
    ).resolves.toEqual('foo')
  })

  it('should fail parse', async () => {
    expect(() => t.nullish(t.string()).parse(123)).toThrow(errors.TyrunError)
    await expect(t.nullish(t.string()).parseAsync(123)).rejects.toThrow(errors.TyrunError)

    expect(t.nullish(t.string()).safeParse(123)).toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })
    await expect(t.nullish(t.string()).safeParseAsync(123)).resolves.toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })

    expect(() => t.nullish(t.string()).parse(123n)).toThrow(errors.TyrunError)
    expect(() => t.nullish(t.string()).parse(true)).toThrow(errors.TyrunError)
    expect(() => t.nullish(t.string()).parse(Symbol())).toThrow(errors.TyrunError)
    expect(() => t.nullish(t.string()).parse({})).toThrow(errors.TyrunError)
    expect(() => t.nullish(t.string()).parse([])).toThrow(errors.TyrunError)
    expect(() => t.nullish(t.string()).parse(new Date())).toThrow(errors.TyrunError)
    expect(() => t.nullish(t.string()).parse(new File([''], 'bar'))).toThrow(errors.TyrunError)
  })

  it('should access inner properties', () => {
    expect(t.nullish(t.string()).schema).toEqual(t.string())
  })

  it('should throw `TyrunRuntimeError`', () => {
    expect(() =>
      t
        .nullish(t.string())
        .default(async () => 'foo')
        .parse(undefined)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .nullish(t.string())
        .validate(async () => 'Invalid value')
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .nullish(t.string())
        .process(async () => 'foo')
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .nullish(t.string())
        .preprocess(async () => 'foo')
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
  })

  it('should parse with custom validators', () => {
    expect(
      t
        .nullish(t.string())
        .validate(v => (v === 'foo' ? null : 'Invalid value'))
        .parse('foo')
    ).toEqual('foo')
  })

  it('should fail parse with custom validators', () => {
    expect(() =>
      t
        .nullish(t.string())
        .validate(v => (v !== 'foo' ? null : 'Invalid value'))
        .parse('foo')
    ).toThrow(errors.TyrunError)
  })

  it('should parse with custom processors and preprocessors', () => {
    expect(
      t
        .nullish(t.string())
        .process(v => v?.trim())
        .parse(' foo ')
    ).toEqual('foo')
    expect(
      t
        .nullish(t.string())
        .preprocess<string | null | undefined>(v => v?.trim())
        .parse(' foo ')
    ).toEqual('foo')
  })
})
