import { describe, expect, it } from 'vitest'
import { t, type T } from '../src'

const generateSuccess = <T>(data: T): T.ParseResult<T> => ({ success: true, data })
const generateError = (...errors: string[]): T.ParseResult<void> => ({ success: false, errors })

describe('string', () => {
  it('should be defined', () => {
    expect(t.string).toBeDefined()
  })

  it('should parse', () => {
    expect(t.string().parse('Hello World!')).toEqual(generateSuccess('Hello World!'))
    expect(t.string().optional().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.string().nullable().parse(null)).toEqual(generateSuccess(null))
    expect(t.string().nullish().parse(null)).toEqual(generateSuccess(null))
    expect(t.string().coerce().parse(123)).toEqual(generateSuccess('123'))
    expect(
      t
        .string()
        .mutate(v => Boolean(v))
        .parse('hello')
    ).toEqual(generateSuccess(true))

    expect(t.string().type).toBe('string')

    expect(
      t
        .string()
        .refine(v => v.toUpperCase() === v)
        .parse('HELLO')
    ).toEqual(generateSuccess('HELLO'))
    expect(
      t
        .string()
        .transform(v => v.toUpperCase())
        .parse('hello')
    ).toEqual(generateSuccess('HELLO'))
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
    expect(t.number().coerce().parse('123')).toEqual(generateSuccess(123))
    expect(
      t
        .number()
        .mutate(v => v.toString())
        .parse(123)
    ).toEqual(generateSuccess('123'))

    expect(t.number().type).toBe('number')

    expect(
      t
        .number()
        .refine(v => Boolean(v) === false)
        .parse(0)
    ).toEqual(generateSuccess(0))
    expect(
      t
        .number()
        .transform(v => v * 2)
        .parse(2)
    ).toEqual(generateSuccess(4))
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
    expect(t.boolean().coerce().parse('Hello')).toEqual(generateSuccess(true))
    expect(
      t
        .boolean()
        .mutate(v => v.toString())
        .parse(true)
    ).toEqual(generateSuccess('true'))

    expect(t.boolean().type).toBe('boolean')

    expect(
      t
        .boolean()
        .refine(v => v === false)
        .parse(false)
    ).toEqual(generateSuccess(false))
    expect(
      t
        .boolean()
        .transform(v => !v)
        .parse(false)
    ).toEqual(generateSuccess(true))
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
    expect(
      t
        .object({ name: t.string(), age: t.number() })
        .mutate(v => v.toString())
        .parse({ name: 'John', age: 18 })
    ).toEqual(generateSuccess('[object Object]'))

    expect(t.object({ name: t.string(), age: t.number() }).type).toBe('object')

    expect(t.object({ name: t.string(), age: t.number() }).inner.name.parse('John')).toEqual(generateSuccess('John'))
    expect(
      t
        .object({ name: t.string(), age: t.number() })
        .refine(v => v.name === v.age.toString())
        .parse({ name: '18', age: 18 })
    ).toEqual(generateSuccess({ name: '18', age: 18 }))
    expect(
      t
        .object({ name: t.string(), age: t.number() })
        .transform(v => ({ ...v, age: v.age + 1 }))
        .parse({ name: '18', age: 18 })
    ).toEqual(generateSuccess({ name: '18', age: 19 }))
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
    expect(
      t
        .array(t.string())
        .mutate(v => v.toString())
        .parse(['Hello', 'World!'])
    ).toEqual(generateSuccess('Hello,World!'))

    expect(t.array(t.string()).type).toBe('array')

    expect(t.array(t.string()).inner.parse('Hello')).toEqual(generateSuccess('Hello'))
    expect(
      t
        .array(t.string())
        .refine(v => v.every(item => item === 'Hello'))
        .parse(['Hello', 'Hello'])
    ).toEqual(generateSuccess(['Hello', 'Hello']))
    expect(
      t
        .array(t.string())
        .transform(v => v.map(item => item.toUpperCase()))
        .parse(['Hello', 'Hello'])
    ).toEqual(generateSuccess(['HELLO', 'HELLO']))
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
    expect(t.enum(['Hello', 'World']).parse('Hello')).toEqual(generateSuccess('Hello'))
    expect(t.enum(['Hello', 'World']).optional().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.enum(['Hello', 'World']).nullable().parse(null)).toEqual(generateSuccess(null))
    expect(t.enum(['Hello', 'World']).nullish().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(
      t
        .enum(['Hello', 'World'])
        .mutate(v => v === 'Hello')
        .parse('Hello')
    ).toEqual(generateSuccess(true))

    expect(t.enum(['Hello', 'World']).type).toBe('enum')

    expect(t.enum(['Hello', 'World']).values).toEqual(['Hello', 'World'])
    expect(
      t
        .enum(['Hello', 'World'])
        .refine(v => v === 'Hello')
        .parse('Hello')
    ).toEqual(generateSuccess('Hello'))
    expect(
      t
        .enum(['Hello', 'World'])
        .transform(v => (v === 'Hello' ? 'World' : 'Hello'))
        .parse('Hello')
    ).toEqual(generateSuccess('World'))
  })

  it("shouldn't parse", () => {
    expect(t.enum(['Hello', 'World']).parse('Hello World!')).toEqual(generateError('Value must be one from the options: Hello, World'))
    expect(t.enum(['Hello', 'World']).parse(1)).toEqual(generateError('Value must be one from the options: Hello, World'))
    expect(t.enum(['Hello', 'World']).parse(false)).toEqual(generateError('Value must be one from the options: Hello, World'))
    expect(t.enum(['Hello', 'World']).parse({ Hello: 'World' })).toEqual(generateError('Value must be one from the options: Hello, World'))
    expect(t.enum(['Hello', 'World']).parse(['Hello'])).toEqual(generateError('Value must be one from the options: Hello, World'))
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
    expect(
      t
        .record(t.number())
        .mutate(v => v.name === v.age)
        .parse({ name: 18, age: 18 })
    ).toEqual(generateSuccess(true))

    expect(t.record(t.number()).type).toBe('record')

    expect(t.record(t.number()).inner.parse(18)).toEqual(generateSuccess(18))
    expect(
      t
        .record(t.number())
        .refine(v => v.name === v.age)
        .parse({ name: 18, age: 18 })
    ).toEqual(generateSuccess({ name: 18, age: 18 }))
    expect(
      t
        .record(t.number())
        .transform(v => ({ ...v, extra: 18 }))
        .parse({ name: 18, age: 18 })
    ).toEqual(generateSuccess({ name: 18, age: 18, extra: 18 }))
  })

  it("shouldn't parse", () => {
    expect(t.record(t.number()).parse('{"name":1,"age":18}')).toEqual(generateError('Value must be an object'))
    expect(t.record(t.number()).parse(1)).toEqual(generateError('Value must be an object'))
    expect(t.record(t.number()).parse(false)).toEqual(generateError('Value must be an object'))
    expect(t.record(t.number()).parse({ name: 'Hello' })).toEqual(generateError('Value must be a number'))
    expect(t.record(t.number()).parse([1, 18])).toEqual(generateError('Value must be an object'))
  })
})

describe('union', () => {
  it('should be defined', () => {
    expect(t.union).toBeDefined()
  })

  it('should parse', () => {
    expect(t.union([t.string(), t.number()]).parse('Hello')).toEqual(generateSuccess('Hello'))
    expect(t.union([t.string(), t.number()]).parse(18)).toEqual(generateSuccess(18))
    expect(t.union([t.string(), t.number()]).optional().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.union([t.string(), t.number()]).nullable().parse(null)).toEqual(generateSuccess(null))
    expect(t.union([t.string(), t.number()]).nullish().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(
      t
        .union([t.string(), t.number()])
        .mutate(v => typeof v)
        .parse(18)
    ).toEqual(generateSuccess('number'))

    expect(t.union([t.string(), t.number()]).type).toBe('union')

    expect(
      t
        .union([t.string(), t.number()])
        .refine(v => typeof v === 'number')
        .parse(123)
    ).toEqual(generateSuccess(123))
    expect(
      t
        .union([t.string(), t.number()])
        .transform(v => (typeof v === 'string' ? v.toUpperCase() : v))
        .parse('Hello')
    ).toEqual(generateSuccess('HELLO'))
  })

  it("shouldn't parse", () => {
    expect(t.union([t.string(), t.number()]).parse(true)).toEqual(generateError('Value must be a string', 'Value must be a number'))
    expect(t.union([t.string(), t.number()]).parse({ hello: 18 })).toEqual(generateError('Value must be a string', 'Value must be a number'))
    expect(t.union([t.string(), t.number()]).parse(['Hello', 18])).toEqual(generateError('Value must be a string', 'Value must be a number'))
  })
})

describe('date', () => {
  it('should be defined', () => {
    expect(t.date).toBeDefined()
  })

  it('should parse', () => {
    expect(t.date().parse(new Date())).toEqual(generateSuccess(new Date()))
    expect(t.date().optional().parse(undefined)).toEqual(generateSuccess(undefined))
    expect(t.date().nullable().parse(null)).toEqual(generateSuccess(null))
    expect(t.date().nullish().parse(null)).toEqual(generateSuccess(null))
    expect(t.date().coerce().parse('2025-09-05')).toEqual(generateSuccess(new Date('2025-09-05')))
    expect(
      t
        .date()
        .mutate(v => v.getFullYear())
        .parse(new Date('2025-09-05'))
    ).toEqual(generateSuccess(2025))
    expect(
      t
        .date()
        .refine(v => v.getFullYear() === 2025)
        .parse(new Date('2025-09-05'))
    ).toEqual(generateSuccess(new Date('2025-09-05')))
    expect(
      t
        .date()
        .transform(v => new Date(`${v.getFullYear() + 1}-09-05`))
        .parse(new Date('2025-09-05'))
    ).toEqual(generateSuccess(new Date('2026-09-05')))

    expect(t.date().type).toBe('date')

    expect(t.date().min(new Date('2025-09-05')).parse(new Date('2025-09-05'))).toEqual(generateSuccess(new Date('2025-09-05')))
    expect(t.date().max(new Date('2025-09-05')).parse(new Date('2025-09-05'))).toEqual(generateSuccess(new Date('2025-09-05')))
  })

  it("shouldn't parse", () => {
    expect(t.date().parse('2025-09-05')).toEqual(generateError('Value must be a date'))
    expect(t.date().parse(18)).toEqual(generateError('Value must be a date'))
    expect(t.date().parse(true)).toEqual(generateError('Value must be a date'))
    expect(t.date().parse({ hello: 18 })).toEqual(generateError('Value must be a date'))
    expect(t.date().parse([1, 18])).toEqual(generateError('Value must be a date'))

    expect(t.date().min(new Date('2025-09-05')).parse(new Date('2024-09-05'))).toEqual(generateError('Value must be greater than Fri Sep 05 2025'))
    expect(t.date().max(new Date('2025-09-05')).parse(new Date('2026-09-05'))).toEqual(generateError('Value must be less than Fri Sep 05 2025'))
  })
})
