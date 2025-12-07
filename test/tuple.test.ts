import { describe, expect, it } from 'vitest'
import type { Expect } from './utils'

import t, { constants, errors, type T } from '../src'

const _schema = t.tuple([t.string(), t.number()])
const _input: Expect<T.Input<typeof _schema>, [string, number]> = null as any
const _output: Expect<T.Output<typeof _schema>, [string, number]> = null as any

describe('tuple schema', () => {
  it('should be defined', () => {
    expect(t.tuple).toBeDefined()
  })

  it('should parse', async () => {
    expect(t.tuple([t.string(), t.number()]).parse(['foo', 123])).toEqual(['foo', 123])
    await expect(t.tuple([t.string(), t.number()]).parseAsync(['foo', 123])).resolves.toEqual(['foo', 123])

    expect(t.tuple([t.string(), t.number()]).safeParse(['foo', 123])).toEqual({ success: true, data: ['foo', 123] })
    await expect(t.tuple([t.string(), t.number()]).safeParseAsync(['foo', 123])).resolves.toEqual({ success: true, data: ['foo', 123] })
  })

  it('should parse default value', async () => {
    expect(t.tuple([t.string(), t.number()]).default(['foo', 123]).parse(undefined)).toEqual(['foo', 123])
    expect(
      t
        .tuple([t.string(), t.number()])
        .default(() => ['foo', 123])
        .parse(undefined)
    ).toEqual(['foo', 123])
    await expect(
      t
        .tuple([t.string(), t.number()])
        .default(async () => ['foo', 123])
        .parseAsync(undefined)
    ).resolves.toEqual(['foo', 123])

    expect(t.tuple([t.string(), t.number()]).fallback(['foo', 123]).parse('foo')).toEqual(['foo', 123])
    expect(
      t
        .tuple([t.string(), t.number()])
        .fallback(() => ['foo', 123])
        .parse('foo')
    ).toEqual(['foo', 123])
    await expect(
      t
        .tuple([t.string(), t.number()])
        .fallback(async () => ['foo', 123])
        .parseAsync('foo')
    ).resolves.toEqual(['foo', 123])
  })

  it('should fail parse', async () => {
    expect(() => t.tuple([t.string(), t.number()]).parse('foo')).toThrow(errors.TyrunError)
    await expect(t.tuple([t.string(), t.number()]).parseAsync('foo')).rejects.toThrow(errors.TyrunError)

    expect(t.tuple([t.string(), t.number()]).safeParse('foo')).toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })
    await expect(t.tuple([t.string(), t.number()]).safeParseAsync('foo')).resolves.toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })

    expect(() => t.tuple([t.string(), t.number()]).parse(123)).toThrow(errors.TyrunError)
    expect(() => t.tuple([t.string(), t.number()]).parse(123n)).toThrow(errors.TyrunError)
    expect(() => t.tuple([t.string(), t.number()]).parse(true)).toThrow(errors.TyrunError)
    expect(() => t.tuple([t.string(), t.number()]).parse(Symbol())).toThrow(errors.TyrunError)
    expect(() => t.tuple([t.string(), t.number()]).parse(undefined)).toThrow(errors.TyrunError)
    expect(() => t.tuple([t.string(), t.number()]).parse(null)).toThrow(errors.TyrunError)
    expect(() => t.tuple([t.string(), t.number()]).parse([])).toThrow(errors.TyrunError)
    expect(() => t.tuple([t.string(), t.number()]).parse(['foo'])).toThrow(errors.TyrunError)
    expect(() => t.tuple([t.string(), t.number()]).parse([123])).toThrow(errors.TyrunError)
    expect(() => t.tuple([t.string(), t.number()]).parse(['foo', 'foo'])).toThrow(errors.TyrunError)
    expect(() => t.tuple([t.string(), t.number()]).parse([123, 'foo'])).toThrow(errors.TyrunError)
    expect(() => t.tuple([t.string(), t.number()]).parse([123, 123])).toThrow(errors.TyrunError)
    expect(() => t.tuple([t.string(), t.number()]).parse({})).toThrow(errors.TyrunError)
    expect(() => t.tuple([t.string(), t.number()]).parse(new Date())).toThrow(errors.TyrunError)
    expect(() => t.tuple([t.string(), t.number()]).parse(new File([''], 'bar'))).toThrow(errors.TyrunError)
  })

  it('should access inner properties', () => {
    expect(t.tuple([t.string(), t.number()]).schema[0]).toEqual(t.string())
    expect(t.tuple([t.string(), t.number()]).schema[1]).toEqual(t.number())
  })

  it('should throw `TyrunRuntimeError`', () => {
    expect(() =>
      t
        .tuple([t.string(), t.number()])
        .default(async () => ['foo', 123])
        .parse(undefined)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .tuple([t.string(), t.number()])
        .validate(async () => 'Invalid value')
        .parse(['foo', 123])
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .tuple([t.string(), t.number()])
        .process(async () => ['foo', 123])
        .parse(['foo', 123])
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .tuple([t.string(), t.number()])
        .preprocess(async () => ['foo', 123])
        .parse(['foo', 123])
    ).toThrow(errors.TyrunRuntimeError)
  })

  it('should parse with custom validators', () => {
    expect(
      t
        .tuple([t.string(), t.number()])
        .validate(v => (v[0] === 'foo' ? null : 'Invalid value'))
        .parse(['foo', 123])
    ).toEqual(['foo', 123])
  })

  it('should fail parse with custom validators', () => {
    expect(() =>
      t
        .tuple([t.string(), t.number()])
        .validate(v => (v[0] !== 'foo' ? null : 'Invalid value'))
        .parse(['foo', 123])
    ).toThrow(errors.TyrunError)
  })

  it('should parse with custom processors and preprocessors', () => {
    expect(
      t
        .tuple([t.string(), t.number()])
        .process(v => v.map(i => (typeof i === 'string' ? i.toLowerCase() : i * 2)) as [string, number])
        .parse(['FOO', 123])
    ).toEqual(['foo', 246])
    expect(
      t
        .tuple([t.string(), t.number()])
        .preprocess<string[]>(v => v.map(i => (typeof i === 'string' ? i.toLowerCase() : i * 2)) as [string, number])
        .parse(['FOO', 123])
    ).toEqual(['foo', 246])
  })
})
