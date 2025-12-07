import { describe, expect, it } from 'vitest'
import type { Expect } from './utils'

import t, { constants, errors, type T } from '../src'

const _schema = t.intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])])
const _input: Expect<T.Input<typeof _schema>, string> = null as any
const _output: Expect<T.Output<typeof _schema>, string> = null as any

describe('intersection schema', () => {
  it('should be defined', () => {
    expect(t.intersection).toBeDefined()
  })

  it('should parse', async () => {
    expect(t.intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])]).parse('foo')).toEqual('foo')
    await expect(t.intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])]).parseAsync('foo')).resolves.toEqual('foo')

    expect(t.intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])]).safeParse('foo')).toEqual({ success: true, data: 'foo' })
    await expect(t.intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])]).safeParseAsync('foo')).resolves.toEqual({ success: true, data: 'foo' })
  })

  it('should parse default value', async () => {
    expect(
      t
        .intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])])
        .default('foo')
        .parse(undefined)
    ).toEqual('foo')
    expect(
      t
        .intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])])
        .default(() => 'foo')
        .parse(undefined)
    ).toEqual('foo')
    await expect(
      t
        .intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])])
        .default(async () => 'foo')
        .parseAsync(undefined)
    ).resolves.toEqual('foo')

    expect(
      t
        .intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])])
        .fallback('foo')
        .parse(true)
    ).toEqual('foo')
    expect(
      t
        .intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])])
        .fallback(() => 'foo')
        .parse(true)
    ).toEqual('foo')
    await expect(
      t
        .intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])])
        .fallback(async () => 'foo')
        .parseAsync(true)
    ).resolves.toEqual('foo')
  })

  it('should fail parse', async () => {
    expect(() => t.intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])]).parse(true)).toThrow(errors.TyrunError)
    await expect(t.intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])]).parseAsync(false)).rejects.toThrow(errors.TyrunError)

    expect(t.intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])]).safeParse(true)).toEqual({
      success: false,
      issues: [
        { code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] },
        { code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] },
      ],
    })
    await expect(t.intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])]).safeParseAsync(false)).resolves.toEqual({
      success: false,
      issues: [
        { code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] },
        { code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] },
      ],
    })

    expect(() => t.intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])]).parse(123n)).toThrow(errors.TyrunError)
    expect(() => t.intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])]).parse(Symbol())).toThrow(errors.TyrunError)
    expect(() => t.intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])]).parse(undefined)).toThrow(errors.TyrunError)
    expect(() => t.intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])]).parse(null)).toThrow(errors.TyrunError)
    expect(() => t.intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])]).parse({})).toThrow(errors.TyrunError)
    expect(() => t.intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])]).parse([])).toThrow(errors.TyrunError)
    expect(() => t.intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])]).parse(new Date())).toThrow(errors.TyrunError)
    expect(() => t.intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])]).parse(new File([''], 'bar'))).toThrow(errors.TyrunError)
  })

  it('should throw `TyrunRuntimeError`', () => {
    expect(() =>
      t
        .intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])])
        .default(async () => 'foo')
        .parse(undefined)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])])
        .validate(async () => 'Invalid value')
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])])
        .process(async () => 'foo')
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])])
        .preprocess(async () => 'foo')
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
  })

  it('should parse with custom validators', () => {
    expect(
      t
        .intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])])
        .validate(v => (v === 'foo' ? null : 'Invalid value'))
        .parse('foo')
    ).toEqual('foo')
  })

  it('should fail parse with custom validators', () => {
    expect(() =>
      t
        .intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])])
        .validate(v => (v !== 'foo' ? null : 'Invalid value'))
        .parse('foo')
    ).toThrow(errors.TyrunError)
  })

  it('should parse with custom processors and preprocessors', () => {
    expect(
      t
        .intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])])
        .process(v => v.trim())
        .parse(' foo ')
    ).toEqual('foo')
    expect(
      t
        .intersection([t.union([t.string(), t.number()]), t.union([t.string(), t.boolean()])])
        .preprocess<(string | number) & (string | boolean)>(v => v.trim())
        .parse(' foo ')
    ).toEqual('foo')
  })
})
