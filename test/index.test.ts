import { describe, expect, it } from 'vitest'
import { t, type ParseResult } from '../src'

const generateSuccess = <T>(data: T): ParseResult<T> => ({ success: true, data })
const generateError = (...errors: string[]): ParseResult<void> => ({ success: false, errors })

describe('string', () => {
  it('should be defined', () => {
    expect(t.string).toBeDefined()
  })

  it('should parse', () => {
    expect(t.string().parse('Hello World!')).toEqual(generateSuccess('Hello World!'))
    expect(t.string().optional().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.string().nullable().parse(null)).toEqual(generateSuccess(null))
    expect(t.string().nullish().parse(null)).toEqual(generateSuccess(null))

    expect(t.string().min(5).parse('Hello')).toEqual(generateSuccess('Hello'))
    expect(t.string().max(5).parse('Hello')).toEqual(generateSuccess('Hello'))

    expect(
      t
        .string()
        .regex(/^[^\s]+$/)
        .parse('Hello')
    ).toEqual(generateSuccess('Hello'))
  })

  it("shouldn't parse", () => {
    expect(t.string().parse(123)).toEqual(generateError('Value must be a string'))
    expect(t.string().parse(true)).toEqual(generateError('Value must be a string'))
    expect(t.string().parse({ name: 'John' })).toEqual(generateError('Value must be a string'))
    expect(t.string().parse(['Hello World!'])).toEqual(generateError('Value must be a string'))

    expect(t.string().min(6).parse('Hello')).toEqual(generateError('Value must be at least 6 characters long'))
    expect(t.string().max(4).parse('Hello')).toEqual(generateError('Value must be at most 4 characters long'))

    expect(
      t
        .string()
        .regex(/^[^\s]+$/)
        .parse('Hel lo')
    ).toEqual(generateError('Value does not match regex: /^[^\\s]+$/'))
  })
})

describe('number', () => {
  it('should be defined', () => {
    expect(t.number).toBeDefined()
  })

  it('should parse', () => {
    expect(t.number().parse(123)).toEqual(generateSuccess(123))
    expect(t.number().optional().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.number().nullable().parse(null)).toEqual(generateSuccess(null))
    expect(t.number().nullish().parse(undefined)).toEqual(generateSuccess(undefined))

    expect(t.number().min(5).parse(5)).toEqual(generateSuccess(5))
    expect(t.number().max(5).parse(5)).toEqual(generateSuccess(5))
  })

  it("shouldn't parse", () => {
    expect(t.number().parse('123')).toEqual(generateError('Value must be a number'))
    expect(t.number().parse(true)).toEqual(generateError('Value must be a number'))
    expect(t.number().parse({ name: 'John' })).toEqual(generateError('Value must be a number'))
    expect(t.number().parse([123])).toEqual(generateError('Value must be a number'))

    expect(t.number().min(6).parse(5)).toEqual(generateError('Value must be greater or equal than 6'))
    expect(t.number().max(4).parse(5)).toEqual(generateError('Value must be lower or equal than 4'))
  })
})

describe('boolean', () => {
  it('should be defined', () => {
    expect(t.boolean).toBeDefined()
  })

  it('should parse', () => {
    expect(t.boolean().parse(false)).toEqual(generateSuccess(false))
    expect(t.boolean().optional().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.boolean().nullable().parse(null)).toEqual(generateSuccess(null))
    expect(t.boolean().nullish().parse(null)).toEqual(generateSuccess(null))
  })

  it("shouldn't parse", () => {
    expect(t.boolean().parse('true')).toEqual(generateError('Value must be a boolean'))
    expect(t.boolean().parse(1)).toEqual(generateError('Value must be a boolean'))
    expect(t.boolean().parse({ name: false })).toEqual(generateError('Value must be a boolean'))
    expect(t.boolean().parse([false])).toEqual(generateError('Value must be a boolean'))
  })
})

describe('object', () => {
  it('should be defined', () => {
    expect(t.object).toBeDefined()
  })

  it('should parse', () => {
    expect(t.object({ name: t.string(), age: t.number() }).parse({ name: 'John', age: 18 })).toEqual(generateSuccess({ name: 'John', age: 18 }))
    expect(t.object({ name: t.string(), age: t.number() }).optional().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.object({ name: t.string(), age: t.number() }).nullable().parse(null)).toEqual(generateSuccess(null))
    expect(t.object({ name: t.string(), age: t.number() }).nullish().parse(undefined)).toEqual(generateSuccess(undefined))
  })

  it("shouldn't parse", () => {
    expect(t.object({ name: t.string(), age: t.number() }).parse('{"name":"John","age":18}')).toEqual(generateError('Value must be an object'))
    expect(t.object({ name: t.string(), age: t.number() }).parse(18)).toEqual(generateError('Value must be an object'))
    expect(t.object({ name: t.string(), age: t.number() }).parse(false)).toEqual(generateError('Value must be an object'))
    expect(t.object({ name: t.string(), age: t.number() }).parse(['name', 'John'])).toEqual(generateError('Value must be an object'))
  })
})

describe('array', () => {
  it('should be defined', () => {
    expect(t.array).toBeDefined()
  })

  it('should parse', () => {
    expect(t.array(t.string()).parse(['Hello', 'World!'])).toEqual(generateSuccess(['Hello', 'World!']))
    expect(t.array(t.string()).optional().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.array(t.string()).nullable().parse(null)).toEqual(generateSuccess(null))
    expect(t.array(t.string()).nullish().parse(null)).toEqual(generateSuccess(null))

    expect(t.array(t.string()).min(2).parse(['1', '2'])).toEqual(generateSuccess(['1', '2']))
    expect(t.array(t.string()).max(2).parse(['1', '2'])).toEqual(generateSuccess(['1', '2']))
  })

  it("shouldn't parse", () => {
    expect(t.array(t.string()).parse('["Hello","World!"]')).toEqual(generateError('Value must be an array'))
    expect(t.array(t.string()).parse(18)).toEqual(generateError('Value must be an array'))
    expect(t.array(t.string()).parse(false)).toEqual(generateError('Value must be an array'))
    expect(t.array(t.string()).parse({ Hello: 'World!' })).toEqual(generateError('Value must be an array'))

    expect(t.array(t.string()).min(3).parse(['1', '2'])).toEqual(generateError('Value must contain at least 3 items'))
    expect(t.array(t.string()).max(1).parse(['1', '2'])).toEqual(generateError('Value must contain at most 1 items'))
  })
})

describe('enum', () => {
  it('should be defined', () => {
    expect(t.enum).toBeDefined()
  })

  it('should parse', () => {
    expect(t.enum(['Hello', 'World'] as const).parse('Hello')).toEqual(generateSuccess('Hello'))
    expect(
      t
        .enum(['Hello', 'World'] as const)
        .optional()
        .parse(undefined)
    ).toEqual(generateSuccess(undefined))
    expect(
      t
        .enum(['Hello', 'World'] as const)
        .nullable()
        .parse(null)
    ).toEqual(generateSuccess(null))
    expect(
      t
        .enum(['Hello', 'World'] as const)
        .nullish()
        .parse(undefined)
    ).toEqual(generateSuccess(undefined))
  })

  it("shouldn't parse", () => {
    expect(t.enum(['Hello', 'World'] as const).parse('Hello World!')).toEqual(generateError('Value must be one from the options: Hello, World'))
    expect(t.enum(['Hello', 'World'] as const).parse(1)).toEqual(generateError('Value must be one from the options: Hello, World'))
    expect(t.enum(['Hello', 'World'] as const).parse(false)).toEqual(generateError('Value must be one from the options: Hello, World'))
    expect(t.enum(['Hello', 'World'] as const).parse({ Hello: 'World' })).toEqual(generateError('Value must be one from the options: Hello, World'))
    expect(t.enum(['Hello', 'World'] as const).parse(['Hello'])).toEqual(generateError('Value must be one from the options: Hello, World'))
  })
})

describe('record', () => {
  it('should be defined', () => {
    expect(t.record).toBeDefined()
  })

  it('should parse', () => {
    expect(t.record(t.number()).parse({ name: 1, age: 18 })).toEqual(generateSuccess({ name: 1, age: 18 }))
    expect(t.record(t.number()).optional().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.record(t.number()).nullable().parse(null)).toEqual(generateSuccess(null))
    expect(t.record(t.number()).nullish().parse(null)).toEqual(generateSuccess(null))
  })

  it("shouldn't parse", () => {
    expect(t.record(t.number()).parse('{"name":1,"age":18}')).toEqual(generateError('Value must be an object'))
    expect(t.record(t.number()).parse(1)).toEqual(generateError('Value must be an object'))
    expect(t.record(t.number()).parse(false)).toEqual(generateError('Value must be an object'))
    expect(t.record(t.number()).parse({ name: 'Hello' })).toEqual(generateError('Value must be a string'))
    expect(t.record(t.number()).parse([1, 18])).toEqual(generateError('Value must be an object'))
  })
})
