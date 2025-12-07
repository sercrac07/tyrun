import { describe, expect, it } from 'vitest'
import type { Expect } from './utils'

import t, { constants, errors, type T } from '../src'

const _schema = t.date()
const _input: Expect<T.Input<typeof _schema>, Date> = null as any
const _output: Expect<T.Output<typeof _schema>, Date> = null as any

describe('date schema', () => {
  it('should be defined', () => {
    expect(t.date).toBeDefined()
  })

  it('should parse', async () => {
    expect(t.date().parse(new Date('2000-01-01'))).toEqual(new Date('2000-01-01'))
    await expect(t.date().parseAsync(new Date('2000-01-01'))).resolves.toEqual(new Date('2000-01-01'))

    expect(t.date().safeParse(new Date('2000-01-01'))).toEqual({ success: true, data: new Date('2000-01-01') })
    await expect(t.date().safeParseAsync(new Date('2000-01-01'))).resolves.toEqual({ success: true, data: new Date('2000-01-01') })
  })

  it('should parse default value', async () => {
    expect(t.date().default(new Date('2000-01-01')).parse(undefined)).toEqual(new Date('2000-01-01'))
    expect(
      t
        .date()
        .default(() => new Date('2000-01-01'))
        .parse(undefined)
    ).toEqual(new Date('2000-01-01'))
    await expect(
      t
        .date()
        .default(async () => new Date('2000-01-01'))
        .parseAsync(undefined)
    ).resolves.toEqual(new Date('2000-01-01'))

    expect(t.date().fallback(new Date('2000-01-01')).parse('foo')).toEqual(new Date('2000-01-01'))
    expect(
      t
        .date()
        .fallback(() => new Date('2000-01-01'))
        .parse('foo')
    ).toEqual(new Date('2000-01-01'))
    await expect(
      t
        .date()
        .fallback(async () => new Date('2000-01-01'))
        .parseAsync('foo')
    ).resolves.toEqual(new Date('2000-01-01'))
  })

  it('should fail parse', async () => {
    expect(() => t.date().parse('foo')).toThrow(errors.TyrunError)
    await expect(t.date().parseAsync('foo')).rejects.toThrow(errors.TyrunError)

    expect(t.date().safeParse('foo')).toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })
    await expect(t.date().safeParseAsync('foo')).resolves.toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })

    expect(() => t.date().parse(123)).toThrow(errors.TyrunError)
    expect(() => t.date().parse(123n)).toThrow(errors.TyrunError)
    expect(() => t.date().parse(true)).toThrow(errors.TyrunError)
    expect(() => t.date().parse(Symbol())).toThrow(errors.TyrunError)
    expect(() => t.date().parse(undefined)).toThrow(errors.TyrunError)
    expect(() => t.date().parse(null)).toThrow(errors.TyrunError)
    expect(() => t.date().parse({})).toThrow(errors.TyrunError)
    expect(() => t.date().parse([])).toThrow(errors.TyrunError)
    expect(() => t.date().parse(new File([''], 'bar'))).toThrow(errors.TyrunError)
  })

  it('should throw `TyrunRuntimeError`', () => {
    expect(() =>
      t
        .date()
        .default(async () => new Date('2000-01-01'))
        .parse(undefined)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .date()
        .validate(async () => 'Invalid value')
        .parse(new Date('2000-01-01'))
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .date()
        .process(async () => new Date('2000-01-01'))
        .parse(new Date('2000-01-01'))
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .date()
        .preprocess(async () => new Date('2000-01-01'))
        .parse(new Date('2000-01-01'))
    ).toThrow(errors.TyrunRuntimeError)
  })

  it('should parse with validators', () => {
    expect(t.date().min(new Date('2000-01-01')).parse(new Date('2000-01-01'))).toEqual(new Date('2000-01-01'))
    expect(t.date().max(new Date('2000-01-01')).parse(new Date('2000-01-01'))).toEqual(new Date('2000-01-01'))
  })

  it('should fail parse with validators', () => {
    expect(() => t.date().min(new Date('2001-01-01')).parse(new Date('2000-01-01'))).toThrow(errors.TyrunError)
    expect(() => t.date().max(new Date('1999-01-01')).parse(new Date('2000-01-01'))).toThrow(errors.TyrunError)
  })

  it('should parse with custom validators', () => {
    expect(
      t
        .date()
        .validate(v => (v.getTime() === new Date('2000-01-01').getTime() ? null : 'Invalid value'))
        .parse(new Date('2000-01-01'))
    ).toEqual(new Date('2000-01-01'))
  })

  it('should fail parse with custom validators', () => {
    expect(() =>
      t
        .date()
        .validate(v => (v.getTime() !== new Date('2000-01-01').getTime() ? null : 'Invalid value'))
        .parse(new Date('2000-01-01'))
    ).toThrow(errors.TyrunError)
  })

  it('should parse with custom processors and preprocessors', () => {
    expect(
      t
        .date()
        .process(v => new Date(v.getTime()))
        .parse(new Date('2000-01-01'))
    ).toEqual(new Date('2000-01-01'))
    expect(
      t
        .date()
        .preprocess<Date>(v => new Date(v.getTime()))
        .parse(new Date('2000-01-01'))
    ).toEqual(new Date('2000-01-01'))
  })
})
