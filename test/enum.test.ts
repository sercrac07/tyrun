import { describe, expect, it } from 'vitest'
import type { Expect } from './utils'

import { constants, errors, t, type T } from '../src'

const _schema = t.enum(['foo', 'bar'])
const _input: Expect<T.Input<typeof _schema>, 'foo' | 'bar'> = null as any
const _output: Expect<T.Output<typeof _schema>, 'foo' | 'bar'> = null as any

describe('enum schema', () => {
  it('should be defined', () => {
    expect(t.enum).toBeDefined()
  })

  it('should parse', async () => {
    expect(t.enum(['foo', 'bar']).parse('foo')).toEqual('foo')
    await expect(t.enum(['foo', 'bar']).parseAsync('bar')).resolves.toEqual('bar')

    expect(t.enum(['foo', 'bar']).safeParse('foo')).toEqual({ success: true, data: 'foo' })
    await expect(t.enum(['foo', 'bar']).safeParseAsync('bar')).resolves.toEqual({ success: true, data: 'bar' })
  })

  it('should parse default value', async () => {
    expect(t.enum(['foo', 'bar']).default('foo').parse(undefined)).toEqual('foo')
    expect(
      t
        .enum(['foo', 'bar'])
        .default(() => 'foo')
        .parse(undefined)
    ).toEqual('foo')
    await expect(
      t
        .enum(['foo', 'bar'])
        .default(async () => 'foo' as const)
        .parseAsync(undefined)
    ).resolves.toEqual('foo')

    expect(t.enum(['foo', 'bar']).fallback('foo').parse('buzz')).toEqual('foo')
    expect(
      t
        .enum(['foo', 'bar'])
        .fallback(() => 'foo')
        .parse('buzz')
    ).toEqual('foo')
    await expect(
      t
        .enum(['foo', 'bar'])
        .fallback(async () => 'foo' as const)
        .parseAsync('buzz')
    ).resolves.toEqual('foo')
  })

  it('should fail parse', async () => {
    expect(() => t.enum(['foo', 'bar']).parse('buzz')).toThrow(errors.TyrunError)
    await expect(t.enum(['foo', 'bar']).parseAsync('buzz')).rejects.toThrow(errors.TyrunError)

    expect(t.enum(['foo', 'bar']).safeParse('buzz')).toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.ENUM.TYPE(['foo', 'bar']), path: [] }] })
    await expect(t.enum(['foo', 'bar']).safeParseAsync('buzz')).resolves.toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.ENUM.TYPE(['foo', 'bar']), path: [] }] })

    expect(() => t.enum(['foo', 'bar']).parse(123)).toThrow(errors.TyrunError)
    expect(() => t.enum(['foo', 'bar']).parse(123n)).toThrow(errors.TyrunError)
    expect(() => t.enum(['foo', 'bar']).parse(true)).toThrow(errors.TyrunError)
    expect(() => t.enum(['foo', 'bar']).parse(Symbol())).toThrow(errors.TyrunError)
    expect(() => t.enum(['foo', 'bar']).parse(undefined)).toThrow(errors.TyrunError)
    expect(() => t.enum(['foo', 'bar']).parse(null)).toThrow(errors.TyrunError)
    expect(() => t.enum(['foo', 'bar']).parse({})).toThrow(errors.TyrunError)
    expect(() => t.enum(['foo', 'bar']).parse([])).toThrow(errors.TyrunError)
    expect(() => t.enum(['foo', 'bar']).parse(new Date())).toThrow(errors.TyrunError)
    expect(() => t.enum(['foo', 'bar']).parse(new File([''], 'bar'))).toThrow(errors.TyrunError)
  })

  it('should access inner properties', () => {
    expect(t.enum(['foo', 'bar']).values[0]).toEqual('foo')
    expect(t.enum(['foo', 'bar']).values[1]).toEqual('bar')
  })

  it('should throw `TyrunRuntimeError`', () => {
    expect(() =>
      t
        .enum(['foo', 'bar'])
        .default(async () => 'foo' as const)
        .parse(undefined)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .enum(['foo', 'bar'])
        .validate(async () => 'Invalid value')
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .enum(['foo', 'bar'])
        .process(async () => 'foo' as const)
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .enum(['foo', 'bar'])
        .preprocess(async () => 'foo' as const)
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
  })

  it('should parse with custom validators', () => {
    expect(
      t
        .enum(['foo', 'bar'])
        .validate(v => (v === 'foo' ? null : 'Invalid value'))
        .parse('foo')
    ).toEqual('foo')
  })

  it('should fail parse with custom validators', () => {
    expect(() =>
      t
        .enum(['foo', 'bar'])
        .validate(v => (v !== 'foo' ? null : 'Invalid value'))
        .parse('foo')
    ).toThrow(errors.TyrunError)
  })

  it('should parse with custom processors and preprocessors', () => {
    expect(
      t
        .enum(['foo', 'bar'])
        .process(v => (v === 'foo' ? 'bar' : 'foo'))
        .parse('bar')
    ).toEqual('foo')
    expect(
      t
        .enum(['foo', 'bar'])
        .preprocess<'foo' | 'bar'>(v => (v === 'foo' ? 'bar' : 'foo'))
        .parse('bar')
    ).toEqual('foo')
  })
})
