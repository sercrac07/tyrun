import { describe, expect, it } from 'vitest'
import type { Expect } from './utils'

import { constants, errors, t, type T } from '../src'

const _schema = t.literal('foo')
const _input: Expect<T.Input<typeof _schema>, 'foo'> = null as any
const _output: Expect<T.Output<typeof _schema>, 'foo'> = null as any

describe('literal schema', () => {
  it('should be defined', () => {
    expect(t.literal).toBeDefined()
  })

  it('should parse', async () => {
    expect(t.literal('foo').parse('foo')).toEqual('foo')
    await expect(t.literal('foo').parseAsync('foo')).resolves.toEqual('foo')

    expect(t.literal('foo').safeParse('foo')).toEqual({ success: true, data: 'foo' })
    await expect(t.literal('foo').safeParseAsync('foo')).resolves.toEqual({ success: true, data: 'foo' })
  })

  it('should parse default value', async () => {
    expect(t.literal('foo').default('foo').parse(undefined)).toEqual('foo')
    expect(
      t
        .literal('foo')
        .default(() => 'foo')
        .parse(undefined)
    ).toEqual('foo')
    await expect(
      t
        .literal('foo')
        .default(async () => 'foo' as const)
        .parseAsync(undefined)
    ).resolves.toEqual('foo')

    expect(t.literal('foo').fallback('foo').parse('bar')).toEqual('foo')
    expect(
      t
        .literal('foo')
        .fallback(() => 'foo')
        .parse('bar')
    ).toEqual('foo')
    await expect(
      t
        .literal('foo')
        .fallback(async () => 'foo' as const)
        .parseAsync('bar')
    ).resolves.toEqual('foo')
  })

  it('should fail parse', async () => {
    expect(() => t.literal('foo').parse('bar')).toThrow(errors.TyrunError)
    await expect(t.literal('foo').parseAsync('bar')).rejects.toThrow(errors.TyrunError)

    expect(t.literal('foo').safeParse('bar')).toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.LITERAL.TYPE('foo'), path: [] }] })
    await expect(t.literal('foo').safeParseAsync('bar')).resolves.toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.LITERAL.TYPE('foo'), path: [] }] })

    expect(() => t.literal('foo').parse(123)).toThrow(errors.TyrunError)
    expect(() => t.literal('foo').parse(123n)).toThrow(errors.TyrunError)
    expect(() => t.literal('foo').parse(true)).toThrow(errors.TyrunError)
    expect(() => t.literal('foo').parse(Symbol())).toThrow(errors.TyrunError)
    expect(() => t.literal('foo').parse(undefined)).toThrow(errors.TyrunError)
    expect(() => t.literal('foo').parse(null)).toThrow(errors.TyrunError)
    expect(() => t.literal('foo').parse({})).toThrow(errors.TyrunError)
    expect(() => t.literal('foo').parse([])).toThrow(errors.TyrunError)
    expect(() => t.literal('foo').parse(new Date())).toThrow(errors.TyrunError)
    expect(() => t.literal('foo').parse(new File([''], 'bar'))).toThrow(errors.TyrunError)
  })

  it('should access inner properties', () => {
    expect(t.literal('foo').value).toEqual('foo')
  })

  it('should throw `TyrunRuntimeError`', () => {
    expect(() =>
      t
        .literal('foo')
        .default(async () => 'foo' as const)
        .parse(undefined)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .literal('foo')
        .validate(async () => 'Invalid value')
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .literal('foo')
        .process(async () => 'foo' as const)
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .literal('foo')
        .preprocess(async () => 'foo' as const)
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
  })

  it('should parse with custom validators', () => {
    expect(
      t
        .literal('foo')
        .validate(v => (v === 'foo' ? null : 'Invalid value'))
        .parse('foo')
    ).toEqual('foo')
  })

  it('should fail parse with custom validators', () => {
    expect(() =>
      t
        .literal('foo')
        .validate(v => (v !== 'foo' ? null : 'Invalid value'))
        .parse('foo')
    ).toThrow(errors.TyrunError)
  })

  it('should parse with custom processors and preprocessors', () => {
    expect(
      t
        .literal('foo')
        .process(() => 'foo')
        .parse('foo')
    ).toEqual('foo')
    expect(
      t
        .literal('foo')
        .preprocess<'foo'>(() => 'foo')
        .parse('bar')
    ).toEqual('foo')
  })
})
