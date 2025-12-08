import { describe, expect, it } from 'vitest'
import type { Expect } from './utils'

import { constants, errors, t, type T } from '../src'

const _schema = t.mutate(t.string(), t.number(), v => v.length)
const _input: Expect<T.Input<typeof _schema>, string> = null as any
const _output: Expect<T.Output<typeof _schema>, number> = null as any

describe('mutate schema', () => {
  it('should be defined', () => {
    expect(t.mutate).toBeDefined()
  })

  it('should parse', async () => {
    expect(t.mutate(t.string(), t.number(), v => v.length).parse('foo')).toEqual(3)
    await expect(t.mutate(t.string(), t.number(), v => v.length).parseAsync('foo')).resolves.toEqual(3)

    expect(t.mutate(t.string(), t.number(), v => v.length).safeParse('foo')).toEqual({ success: true, data: 3 })
    await expect(t.mutate(t.string(), t.number(), v => v.length).safeParseAsync('foo')).resolves.toEqual({ success: true, data: 3 })
  })

  it('should parse default value', async () => {
    expect(
      t
        .mutate(t.string(), t.number(), v => v.length)
        .default(3)
        .parse(undefined)
    ).toEqual(3)
    expect(
      t
        .mutate(t.string(), t.number(), v => v.length)
        .default(() => 3)
        .parse(undefined)
    ).toEqual(3)
    await expect(
      t
        .mutate(t.string(), t.number(), v => v.length)
        .default(async () => 3)
        .parseAsync(undefined)
    ).resolves.toEqual(3)

    expect(
      t
        .mutate(t.string(), t.number(), v => v.length)
        .fallback(3)
        .parse(123)
    ).toEqual(3)
    expect(
      t
        .mutate(t.string(), t.number(), v => v.length)
        .fallback(() => 3)
        .parse(123)
    ).toEqual(3)
    await expect(
      t
        .mutate(t.string(), t.number(), v => v.length)
        .fallback(async () => 3)
        .parseAsync(123)
    ).resolves.toEqual(3)
  })

  it('should fail parse', async () => {
    expect(() => t.mutate(t.string(), t.number(), v => v.length).parse(123)).toThrow(errors.TyrunError)
    await expect(t.mutate(t.string(), t.number(), v => v.length).parseAsync(123)).rejects.toThrow(errors.TyrunError)

    expect(t.mutate(t.string(), t.number(), v => v.length).safeParse(123)).toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })
    await expect(t.mutate(t.string(), t.number(), v => v.length).safeParseAsync(123)).resolves.toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })

    expect(() => t.mutate(t.string(), t.number(), v => v.length).parse(123n)).toThrow(errors.TyrunError)
    expect(() => t.mutate(t.string(), t.number(), v => v.length).parse(true)).toThrow(errors.TyrunError)
    expect(() => t.mutate(t.string(), t.number(), v => v.length).parse(Symbol())).toThrow(errors.TyrunError)
    expect(() => t.mutate(t.string(), t.number(), v => v.length).parse(undefined)).toThrow(errors.TyrunError)
    expect(() => t.mutate(t.string(), t.number(), v => v.length).parse(null)).toThrow(errors.TyrunError)
    expect(() => t.mutate(t.string(), t.number(), v => v.length).parse({})).toThrow(errors.TyrunError)
    expect(() => t.mutate(t.string(), t.number(), v => v.length).parse([])).toThrow(errors.TyrunError)
    expect(() => t.mutate(t.string(), t.number(), v => v.length).parse(new Date())).toThrow(errors.TyrunError)
    expect(() => t.mutate(t.string(), t.number(), v => v.length).parse(new File([''], 'bar'))).toThrow(errors.TyrunError)
  })

  it('should access inner properties', () => {
    expect(t.mutate(t.string(), t.number(), v => v.length).from).toEqual(t.string())
    expect(t.mutate(t.string(), t.number(), v => v.length).to).toEqual(t.number())
    expect(t.mutate(t.string(), t.number(), v => v.length).mutator).toBeInstanceOf(Function)
  })

  it('should throw `TyrunRuntimeError`', () => {
    expect(() =>
      t
        .mutate(t.string(), t.number(), v => v.length)
        .default(async () => 3)
        .parse(undefined)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .mutate(t.string(), t.number(), v => v.length)
        .validate(async () => 'Invalid value')
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .mutate(t.string(), t.number(), v => v.length)
        .process(async () => 3)
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .mutate(t.string(), t.number(), v => v.length)
        .preprocess(async () => 'foo')
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
  })

  it('should parse with custom validators', () => {
    expect(
      t
        .mutate(t.string(), t.number(), v => v.length)
        .validate(v => (v === 3 ? null : 'Invalid value'))
        .parse('foo')
    ).toEqual(3)
  })

  it('should fail parse with custom validators', () => {
    expect(() =>
      t
        .mutate(t.string(), t.number(), v => v.length)
        .validate(v => (v !== 3 ? null : 'Invalid value'))
        .parse('foo')
    ).toThrow(errors.TyrunError)
  })

  it('should parse with custom processors and preprocessors', () => {
    expect(
      t
        .mutate(t.string(), t.number(), v => v.length)
        .process(v => v * 2)
        .parse('foo')
    ).toEqual(6)
    expect(
      t
        .mutate(t.string(), t.number(), v => v.length)
        .preprocess<string>(v => v.trim())
        .parse(' foo ')
    ).toEqual(3)
  })
})
