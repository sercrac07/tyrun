import { describe, expect, it } from 'vitest'
import type { Expect } from './utils'

import { constants, errors, t, type T } from '../src'

const _schema = t.optional(t.string())
const _input: Expect<T.Input<typeof _schema>, string | undefined> = null as any
const _output: Expect<T.Output<typeof _schema>, string | undefined> = null as any

describe('optional schema', () => {
  it('should be defined', () => {
    expect(t.optional).toBeDefined()
  })

  it('should parse', async () => {
    expect(t.optional(t.string()).parse('foo')).toEqual('foo')
    await expect(t.optional(t.string()).parseAsync(undefined)).resolves.toEqual(undefined)

    expect(t.optional(t.string()).safeParse('foo')).toEqual({ success: true, data: 'foo' })
    await expect(t.optional(t.string()).safeParseAsync(undefined)).resolves.toEqual({ success: true, data: undefined })
  })

  it('should parse default value', async () => {
    expect(t.optional(t.string()).default('foo').parse(undefined)).toEqual('foo')
    expect(
      t
        .optional(t.string())
        .default(() => 'foo')
        .parse(undefined)
    ).toEqual('foo')
    await expect(
      t
        .optional(t.string())
        .default(async () => 'foo')
        .parseAsync(undefined)
    ).resolves.toEqual('foo')

    expect(t.optional(t.string()).fallback('foo').parse(123)).toEqual('foo')
    expect(
      t
        .optional(t.string())
        .fallback(() => 'foo')
        .parse(123)
    ).toEqual('foo')
    await expect(
      t
        .optional(t.string())
        .fallback(async () => 'foo')
        .parseAsync(123)
    ).resolves.toEqual('foo')
  })

  it('should fail parse', async () => {
    expect(() => t.optional(t.string()).parse(123)).toThrow(errors.TyrunError)
    await expect(t.optional(t.string()).parseAsync(123)).rejects.toThrow(errors.TyrunError)

    expect(t.optional(t.string()).safeParse(123)).toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })
    await expect(t.optional(t.string()).safeParseAsync(123)).resolves.toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })

    expect(() => t.optional(t.string()).parse(123n)).toThrow(errors.TyrunError)
    expect(() => t.optional(t.string()).parse(true)).toThrow(errors.TyrunError)
    expect(() => t.optional(t.string()).parse(Symbol())).toThrow(errors.TyrunError)
    expect(() => t.optional(t.string()).parse(null)).toThrow(errors.TyrunError)
    expect(() => t.optional(t.string()).parse({})).toThrow(errors.TyrunError)
    expect(() => t.optional(t.string()).parse([])).toThrow(errors.TyrunError)
    expect(() => t.optional(t.string()).parse(new Date())).toThrow(errors.TyrunError)
    expect(() => t.optional(t.string()).parse(new File([''], 'bar'))).toThrow(errors.TyrunError)
  })

  it('should access inner properties', () => {
    expect(t.optional(t.string()).schema).toEqual(t.string())
  })

  it('should throw `TyrunRuntimeError`', () => {
    expect(() =>
      t
        .optional(t.string())
        .default(async () => 'foo')
        .parse(undefined)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .optional(t.string())
        .validate(async () => 'Invalid value')
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .optional(t.string())
        .process(async () => 'foo')
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .optional(t.string())
        .preprocess(async () => 'foo')
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
  })

  it('should parse with custom validators', () => {
    expect(
      t
        .optional(t.string())
        .validate(v => (v === 'foo' ? null : 'Invalid value'))
        .parse('foo')
    ).toEqual('foo')
  })

  it('should fail parse with custom validators', () => {
    expect(() =>
      t
        .optional(t.string())
        .validate(v => (v !== 'foo' ? null : 'Invalid value'))
        .parse('foo')
    ).toThrow(errors.TyrunError)
  })

  it('should parse with custom processors and preprocessors', () => {
    expect(
      t
        .optional(t.string())
        .process(v => v?.trim())
        .parse(' foo ')
    ).toEqual('foo')
    expect(
      t
        .optional(t.string())
        .preprocess<string | undefined>(v => v?.trim())
        .parse(' foo ')
    ).toEqual('foo')
  })
})
