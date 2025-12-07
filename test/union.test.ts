import { describe, expect, it } from 'vitest'
import type { Expect } from './utils'

import t, { constants, errors, type T } from '../src'

const _schema = t.union([t.string(), t.number()])
const _input: Expect<T.Input<typeof _schema>, string | number> = null as any
const _output: Expect<T.Output<typeof _schema>, string | number> = null as any

describe('union schema', () => {
  it('should be defined', () => {
    expect(t.union).toBeDefined()
  })

  it('should parse', async () => {
    expect(t.union([t.string(), t.number()]).parse('foo')).toEqual('foo')
    await expect(t.union([t.string(), t.number()]).parseAsync('foo')).resolves.toEqual('foo')

    expect(t.union([t.string(), t.number()]).safeParse('foo')).toEqual({ success: true, data: 'foo' })
    await expect(t.union([t.string(), t.number()]).safeParseAsync('foo')).resolves.toEqual({ success: true, data: 'foo' })
  })

  it('should parse default value', async () => {
    expect(t.union([t.string(), t.number()]).default('foo').parse(undefined)).toEqual('foo')
    expect(
      t
        .union([t.string(), t.number()])
        .default(() => 'foo')
        .parse(undefined)
    ).toEqual('foo')
    await expect(
      t
        .union([t.string(), t.number()])
        .default(async () => 'foo')
        .parseAsync(undefined)
    ).resolves.toEqual('foo')

    expect(t.union([t.string(), t.number()]).fallback('foo').parse(true)).toEqual('foo')
    expect(
      t
        .union([t.string(), t.number()])
        .fallback(() => 'foo')
        .parse(true)
    ).toEqual('foo')
    await expect(
      t
        .union([t.string(), t.number()])
        .fallback(async () => 'foo')
        .parseAsync(true)
    ).resolves.toEqual('foo')
  })

  it('should fail parse', async () => {
    expect(() => t.union([t.string(), t.number()]).parse(true)).toThrow(errors.TyrunError)
    await expect(t.union([t.string(), t.number()]).parseAsync(false)).rejects.toThrow(errors.TyrunError)

    expect(t.union([t.string(), t.number()]).safeParse(true)).toEqual({
      success: false,
      issues: [
        { code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] },
        { code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] },
      ],
    })
    await expect(t.union([t.string(), t.number()]).safeParseAsync(false)).resolves.toEqual({
      success: false,
      issues: [
        { code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] },
        { code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] },
      ],
    })

    expect(() => t.union([t.string(), t.number()]).parse(123n)).toThrow(errors.TyrunError)
    expect(() => t.union([t.string(), t.number()]).parse(Symbol())).toThrow(errors.TyrunError)
    expect(() => t.union([t.string(), t.number()]).parse(undefined)).toThrow(errors.TyrunError)
    expect(() => t.union([t.string(), t.number()]).parse(null)).toThrow(errors.TyrunError)
    expect(() => t.union([t.string(), t.number()]).parse({})).toThrow(errors.TyrunError)
    expect(() => t.union([t.string(), t.number()]).parse([])).toThrow(errors.TyrunError)
    expect(() => t.union([t.string(), t.number()]).parse(new Date())).toThrow(errors.TyrunError)
    expect(() => t.union([t.string(), t.number()]).parse(new File([''], 'bar'))).toThrow(errors.TyrunError)
  })

  it('should throw `TyrunRuntimeError`', () => {
    expect(() =>
      t
        .union([t.string(), t.number()])
        .default(async () => 'foo')
        .parse(undefined)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .union([t.string(), t.number()])
        .validate(async () => 'Invalid value')
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .union([t.string(), t.number()])
        .process(async () => 'foo')
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .union([t.string(), t.number()])
        .preprocess(async () => 'foo')
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
  })

  it('should parse with custom validators', () => {
    expect(
      t
        .union([t.string(), t.number()])
        .validate(v => (v === 'foo' ? null : 'Invalid value'))
        .parse('foo')
    ).toEqual('foo')
  })

  it('should fail parse with custom validators', () => {
    expect(() =>
      t
        .union([t.string(), t.number()])
        .validate(v => (v !== 'foo' ? null : 'Invalid value'))
        .parse('foo')
    ).toThrow(errors.TyrunError)
  })

  it('should parse with custom processors and preprocessors', () => {
    expect(
      t
        .union([t.string(), t.number()])
        .process(v => (typeof v === 'string' ? v.trim() : v * 2))
        .parse(' foo ')
    ).toEqual('foo')
    expect(
      t
        .union([t.string(), t.number()])
        .preprocess<string | number>(v => (typeof v === 'string' ? v.trim() : v))
        .parse(' foo ')
    ).toEqual('foo')
  })
})
