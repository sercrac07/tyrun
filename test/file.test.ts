import { describe, expect, it } from 'vitest'
import type { Expect } from './utils'

import { constants, errors, t, type T } from '../src'

const _schema = t.file()
const _input: Expect<T.Input<typeof _schema>, File> = null as any
const _output: Expect<T.Output<typeof _schema>, File> = null as any

describe('file schema', () => {
  it('should be defined', () => {
    expect(t.file).toBeDefined()
  })

  it('should parse', async () => {
    expect(t.file().parse(new File(['foo'], 'bar', { lastModified: 0 }))).toEqual(new File(['foo'], 'bar', { lastModified: 0 }))
    await expect(t.file().parseAsync(new File(['foo'], 'bar', { lastModified: 0 }))).resolves.toEqual(new File(['foo'], 'bar', { lastModified: 0 }))

    expect(t.file().safeParse(new File(['foo'], 'bar', { lastModified: 0 }))).toEqual({ success: true, data: new File(['foo'], 'bar', { lastModified: 0 }) })
    await expect(t.file().safeParseAsync(new File(['foo'], 'bar', { lastModified: 0 }))).resolves.toEqual({ success: true, data: new File(['foo'], 'bar', { lastModified: 0 }) })
  })

  it('should parse default value', async () => {
    expect(
      t
        .file()
        .default(new File(['foo'], 'bar', { lastModified: 0 }))
        .parse(undefined)
    ).toEqual(new File(['foo'], 'bar', { lastModified: 0 }))
    expect(
      t
        .file()
        .default(() => new File(['foo'], 'bar', { lastModified: 0 }))
        .parse(undefined)
    ).toEqual(new File(['foo'], 'bar', { lastModified: 0 }))
    await expect(
      t
        .file()
        .default(async () => new File(['foo'], 'bar', { lastModified: 0 }))
        .parseAsync(undefined)
    ).resolves.toEqual(new File(['foo'], 'bar', { lastModified: 0 }))

    expect(
      t
        .file()
        .fallback(new File(['foo'], 'bar', { lastModified: 0 }))
        .parse('foo')
    ).toEqual(new File(['foo'], 'bar', { lastModified: 0 }))
    expect(
      t
        .file()
        .fallback(() => new File(['foo'], 'bar', { lastModified: 0 }))
        .parse('foo')
    ).toEqual(new File(['foo'], 'bar', { lastModified: 0 }))
    await expect(
      t
        .file()
        .fallback(async () => new File(['foo'], 'bar', { lastModified: 0 }))
        .parseAsync('foo')
    ).resolves.toEqual(new File(['foo'], 'bar', { lastModified: 0 }))
  })

  it('should fail parse', async () => {
    expect(() => t.file().parse('foo')).toThrow(errors.TyrunError)
    await expect(t.file().parseAsync('foo')).rejects.toThrow(errors.TyrunError)

    expect(t.file().safeParse('foo')).toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })
    await expect(t.file().safeParseAsync('foo')).resolves.toEqual({ success: false, issues: [{ code: constants.CODES.BASE.TYPE, error: constants.ERRORS.BASE.TYPE, path: [] }] })

    expect(() => t.file().parse(123)).toThrow(errors.TyrunError)
    expect(() => t.file().parse(123n)).toThrow(errors.TyrunError)
    expect(() => t.file().parse(true)).toThrow(errors.TyrunError)
    expect(() => t.file().parse(Symbol())).toThrow(errors.TyrunError)
    expect(() => t.file().parse(undefined)).toThrow(errors.TyrunError)
    expect(() => t.file().parse(null)).toThrow(errors.TyrunError)
    expect(() => t.file().parse({})).toThrow(errors.TyrunError)
    expect(() => t.file().parse([])).toThrow(errors.TyrunError)
    expect(() => t.file().parse(new Date())).toThrow(errors.TyrunError)
  })

  it('should throw `TyrunRuntimeError`', () => {
    expect(() =>
      t
        .file()
        .default(async () => new File(['foo'], 'bar', { lastModified: 0 }))
        .parse(undefined)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .file()
        .validate(async () => 'Invalid value')
        .parse(new File(['foo'], 'bar', { lastModified: 0 }))
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .file()
        .process(async () => new File(['foo'], 'bar', { lastModified: 0 }))
        .parse(new File(['foo'], 'bar', { lastModified: 0 }))
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .file()
        .preprocess(async () => new File(['foo'], 'bar', { lastModified: 0 }))
        .parse(new File(['foo'], 'bar', { lastModified: 0 }))
    ).toThrow(errors.TyrunRuntimeError)
  })

  it('should parse with validators', () => {
    expect(
      t
        .file()
        .min(3)
        .parse(new File(['foo'], 'bar', { lastModified: 0 }))
    ).toEqual(new File(['foo'], 'bar', { lastModified: 0 }))
    expect(
      t
        .file()
        .max(3)
        .parse(new File(['foo'], 'bar', { lastModified: 0 }))
    ).toEqual(new File(['foo'], 'bar', { lastModified: 0 }))
    expect(
      t
        .file()
        .mime(['image/png'])
        .parse(new File(['foo'], 'bar', { lastModified: 0, type: 'image/png' }))
    ).toEqual(new File(['foo'], 'bar', { lastModified: 0, type: 'image/png' }))
  })

  it('should fail parse with validators', () => {
    expect(() =>
      t
        .file()
        .min(4)
        .parse(new File(['foo'], 'bar', { lastModified: 0 }))
    ).toThrow(errors.TyrunError)
    expect(() =>
      t
        .file()
        .max(2)
        .parse(new File(['foo'], 'bar', { lastModified: 0 }))
    ).toThrow(errors.TyrunError)
    expect(() =>
      t
        .file()
        .mime(['image/jpeg'])
        .parse(new File(['foo'], 'bar', { lastModified: 0, type: 'image/png' }))
    ).toThrow(errors.TyrunError)
  })

  it('should parse with custom validators', () => {
    expect(
      t
        .file()
        .validate(v => (v.size === 3 ? null : 'Invalid value'))
        .parse(new File(['foo'], 'bar', { lastModified: 0 }))
    ).toEqual(new File(['foo'], 'bar', { lastModified: 0 }))
  })

  it('should fail parse with custom validators', () => {
    expect(() =>
      t
        .file()
        .validate(v => (v.size !== 3 ? null : 'Invalid value'))
        .parse(new File(['foo'], 'bar', { lastModified: 0 }))
    ).toThrow(errors.TyrunError)
  })

  it('should parse with custom processors and preprocessors', () => {
    expect(
      t
        .file()
        .process(v => new File([v], v.name, { lastModified: v.lastModified }))
        .parse(new File(['foo'], 'bar', { lastModified: 0 }))
    ).toEqual(new File(['foo'], 'bar', { lastModified: 0 }))
    expect(
      t
        .file()
        .preprocess<File>(v => new File([v], v.name, { lastModified: v.lastModified }))
        .parse(new File(['foo'], 'bar', { lastModified: 0 }))
    ).toEqual(new File(['foo'], 'bar', { lastModified: 0 }))
  })
})
