import { describe, expect, it } from 'vitest'
import type { Expect } from './utils'

import { constants, errors, t, type T } from '../src'

const _schema = t.string()
const _input: Expect<T.Input<typeof _schema>, string> = null as any
const _output: Expect<T.Output<typeof _schema>, string> = null as any

describe('string schema', () => {
  it('should be defined', () => {
    expect(t.string).toBeDefined()
  })

  it('should parse', async () => {
    expect(t.string().parse('foo')).toEqual('foo')
    await expect(t.string().parseAsync('foo')).resolves.toEqual('foo')

    expect(t.string().safeParse('foo')).toEqual({ success: true, data: 'foo' })
    await expect(t.string().safeParseAsync('foo')).resolves.toEqual({ success: true, data: 'foo' })
  })

  it('should parse default value', async () => {
    expect(t.string().default('foo').parse(undefined)).toEqual('foo')
    expect(
      t
        .string()
        .default(() => 'foo')
        .parse(undefined)
    ).toEqual('foo')
    await expect(
      t
        .string()
        .default(async () => 'foo')
        .parseAsync(undefined)
    ).resolves.toEqual('foo')

    expect(t.string().fallback('foo').parse(123)).toEqual('foo')
    expect(
      t
        .string()
        .fallback(() => 'foo')
        .parse(123)
    ).toEqual('foo')
    await expect(
      t
        .string()
        .fallback(async () => 'foo')
        .parseAsync(123)
    ).resolves.toEqual('foo')
  })

  it('should fail parse', async () => {
    expect(() => t.string().parse(123)).toThrow(errors.TyrunError)
    await expect(t.string().parseAsync(123)).rejects.toThrow(errors.TyrunError)

    expect(t.string().safeParse(123)).toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })
    await expect(t.string().safeParseAsync(123)).resolves.toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })

    expect(() => t.string().parse(123n)).toThrow(errors.TyrunError)
    expect(() => t.string().parse(true)).toThrow(errors.TyrunError)
    expect(() => t.string().parse(Symbol())).toThrow(errors.TyrunError)
    expect(() => t.string().parse(undefined)).toThrow(errors.TyrunError)
    expect(() => t.string().parse(null)).toThrow(errors.TyrunError)
    expect(() => t.string().parse({})).toThrow(errors.TyrunError)
    expect(() => t.string().parse([])).toThrow(errors.TyrunError)
    expect(() => t.string().parse(new Date())).toThrow(errors.TyrunError)
    expect(() => t.string().parse(new File([''], 'bar'))).toThrow(errors.TyrunError)
  })

  it('should throw `TyrunRuntimeError`', () => {
    expect(() =>
      t
        .string()
        .default(async () => 'foo')
        .parse(undefined)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .string()
        .validate(async () => 'Invalid value')
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .string()
        .process(async () => 'foo')
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .string()
        .preprocess(async () => 'foo')
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
  })

  it('should parse with validators', () => {
    expect(t.string().nonEmpty().parse('foo')).toEqual('foo')
    expect(t.string().min(3).parse('foo')).toEqual('foo')
    expect(t.string().max(3).parse('foo')).toEqual('foo')
    expect(t.string().regex(/[a-z]/).parse('foo')).toEqual('foo')
    expect(t.string().email().parse('foo@bar.buzz')).toEqual('foo@bar.buzz')
    expect(t.string().url().parse('https://foo.bar')).toEqual('https://foo.bar')
  })

  it('should fail parse with validators', () => {
    expect(() => t.string().nonEmpty().parse('')).toThrow(errors.TyrunError)
    expect(() => t.string().min(4).parse('foo')).toThrow(errors.TyrunError)
    expect(() => t.string().max(2).parse('foo')).toThrow(errors.TyrunError)
    expect(() => t.string().regex(/[0-9]/).parse('foo')).toThrow(errors.TyrunError)
    expect(() => t.string().email().parse('foo')).toThrow(errors.TyrunError)
    expect(() => t.string().url().parse('foo')).toThrow(errors.TyrunError)
  })

  it('should parse with custom validators', () => {
    expect(
      t
        .string()
        .validate(v => (v === 'foo' ? null : 'Invalid value'))
        .parse('foo')
    ).toEqual('foo')
  })

  it('should fail parse with custom validators', () => {
    expect(() =>
      t
        .string()
        .validate(v => (v !== 'foo' ? null : 'Invalid value'))
        .parse('foo')
    ).toThrow(errors.TyrunError)
  })

  it('should parse with custom processors and preprocessors', () => {
    expect(
      t
        .string()
        .process(v => v.trim())
        .parse(' foo ')
    ).toEqual('foo')
    expect(
      t
        .string()
        .preprocess<string>(v => v.trim())
        .parse(' foo ')
    ).toEqual('foo')
  })
})
