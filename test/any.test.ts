import { describe, expect, it } from 'vitest'
import type { Expect } from './utils'

import { errors, t, type T } from '../src'

const _schema = t.any()
const _input: Expect<T.Input<typeof _schema>, any> = null as any
const _output: Expect<T.Output<typeof _schema>, any> = null as any

describe('any schema', () => {
  it('should be defined', () => {
    expect(t.any).toBeDefined()
  })

  it('should parse', async () => {
    expect(t.any().parse('foo')).toEqual('foo')
    await expect(t.any().parseAsync('foo')).resolves.toEqual('foo')

    expect(t.any().safeParse('foo')).toEqual({ success: true, data: 'foo' })
    await expect(t.any().safeParseAsync('foo')).resolves.toEqual({ success: true, data: 'foo' })
  })

  it('should parse default value', async () => {
    expect(t.any().default('foo').parse(undefined)).toEqual('foo')
    expect(
      t
        .any()
        .default(() => 'foo')
        .parse(undefined)
    ).toEqual('foo')
    await expect(
      t
        .any()
        .default(async () => 'foo')
        .parseAsync(undefined)
    ).resolves.toEqual('foo')
  })

  it('should throw `TyrunRuntimeError`', () => {
    expect(() =>
      t
        .any()
        .default(async () => 'foo')
        .parse(undefined)
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .any()
        .validate(async () => 'Invalid value')
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .any()
        .process(async () => 'foo')
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
    expect(() =>
      t
        .any()
        .preprocess(async () => 'foo')
        .parse('foo')
    ).toThrow(errors.TyrunRuntimeError)
  })

  it('should parse with custom validators', () => {
    expect(
      t
        .any()
        .validate(v => (v === 'foo' ? null : 'Invalid value'))
        .parse('foo')
    ).toEqual('foo')
  })

  it('should fail parse with custom validators', () => {
    expect(() =>
      t
        .any()
        .validate(v => (v !== 'foo' ? null : 'Invalid value'))
        .parse('foo')
    ).toThrow(errors.TyrunError)
  })

  it('should parse with custom processors and preprocessors', () => {
    expect(
      t
        .any()
        .process(v => v.trim())
        .parse(' foo ')
    ).toEqual('foo')
    expect(
      t
        .any()
        .preprocess<string>(v => v.trim())
        .parse(' foo ')
    ).toEqual('foo')
  })
})
