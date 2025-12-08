# Tyrun - Typed Runtime

`tyrun` is a lightweight runtime type validator for JavaScript and TypeScript. Define extensible schemas, add custom validation rules, and optionally transform inputs during validation. Designed for minimal overhead and easy integration into node and browser projects.

## Features

- **Extensible Schemas**: Define custom validation schemas for your data.
- **Custom Validation Rules**: Add your own validation logic to schemas.
- **Ease and Intuitive API**: Simple and straightforward to use.
- **Lightweight**: Minimal overhead, optimized for performance.
- **Fully TypeScript Typed**: Enjoy type safety with TypeScript.

## Usage

Import the main object `t` and start creating your schemas.

```ts
import { t } from 'tyrun'

// Parse throws an error if something is not valid
const value = t.string().nonEmpty().parse('hello')

// Safe parse returns a result object with value or error
const result = t.number().min(0).safeParse(42)

if (result.success) {
  console.log(result.value)
} else {
  console.error(result.issues)
}
```

## Primitives

### `t.string(error?)`

Validators: `nonEmpty()`, `min(length)`, `max(length)`, `regex(pattern)`, `email()`, `url()`

```ts
t.string()
t.string().nonEmpty()
t.string().min(3)
t.string().max(3)
t.string().regex(/^[a-z]+$/i)
t.string().email()
t.string().url()
```

### `t.number(error?)`

Validators: `min(value)`, `max(value)`, `integer()`, `positive()`, `negative()`

```ts
t.number()
t.number().min(0)
t.number().max(100)
t.number().integer()
t.number().positive()
t.number().negative()
```

### `t.bigint(error?)`

Validators: `min(value)`, `max(value)`, `positive()`, `negative()`

```ts
t.bigint()
t.bigint().min(0n)
t.bigint().max(100n)
t.bigint().positive()
t.bigint().negative()
```

### `t.boolean(error?)`

```ts
t.boolean()
```

### `t.symbol(error?)`

```ts
t.symbol()
```

### `t.undefined(error?)`

```ts
t.undefined()
```

### `t.null(error?)`

```ts
t.null()
```

### `t.literal(value, error?)`

```ts
t.literal('ACTIVE')
t.literal(10)
t.literal(true)
t.literal(99n)

t.literal('ACTIVE').value // 'ACTIVE'
```

### `t.date(error?)`

Validators: `min(value)`, `max(value)`

```ts
t.date()
t.date().min(new Date('2000-01-01'))
t.date().max(new Date('2000-01-01'))
```

### `t.file(error?)`

Validators: `min(bytes)`, `max(bytes)`, `mime(mimeTypes)`

```ts
t.file()
t.file().min(1024)
t.file().max(1024 * 1024)
t.file().mime(['image/png', 'image/jpeg'])
```

## Structural Schemas

### `t.array(schema, error?)`

Validators: `nonEmpty()`, `min(length)`, `max(length)`

```ts
t.array(t.string())
t.array(t.string()).nonEmpty()
t.array(t.string()).min(3)
t.array(t.string()).max(3)

t.array(t.string()).schema // t.string()
```

### `t.object(shape, error?)`

```ts
t.object({ name: t.string() })

t.object({ name: t.string() }).shape.name // t.string()
```

### `t.tuple([...schemas], error?)`

```ts
t.tuple([t.string(), t.number()])

t.tuple([t.string(), t.number()]).schema[0] // t.string()
t.tuple([t.string(), t.number()]).schema[1] // t.number()
```

### `t.record(keySchema, valueSchema, error?)`

```ts
t.record(t.string(), t.number())

t.record(t.string(), t.number()).key // t.string()
t.record(t.string(), t.number()).value // t.number()
```

### `t.enum([...values], error?)`

```ts
t.enum(['ACTIVE', 'INACTIVE'])

t.enum(['ACTIVE', 'INACTIVE']).values[0] // 'ACTIVE'
t.enum(['ACTIVE', 'INACTIVE']).values[1] // 'INACTIVE'
```

## Special Schemas

### `t.any()`

It accepts any value.

```ts
t.any()
```

### `t.booleanish(errorOrConfig?)`

Converts string values to boolean depending on `trueValues` and `falseValues` list.

```ts
t.booleanish()
t.booleanish({ trueValues: ['1', 'true'], falseValues: ['0', 'false'] })

t.booleanish().trueValues // ['y', 'yes', 'true', '1', 'on']
t.booleanish().falseValues // ['n', 'no', 'false', '0', 'off']
```

### `t.union([...schemas])`

```ts
t.union([t.string(), t.number()])

t.union([t.string(), t.number()]).schema[0] // t.string()
t.union([t.string(), t.number()]).schema[1] // t.number()
```

### `t.intersection([...schemas])`

```ts
t.intersection([t.string(), t.number()])

t.intersection([t.string(), t.number()]).schema[0] // t.string()
t.intersection([t.string(), t.number()]).schema[1] // t.number()
```

### `t.lazy(() => schema)`

Useful for recursive schemas.

```ts
t.lazy(() => t.string())

const recursiveSchema = t.lazy(() => t.array(recursiveSchema))

t.lazy(() => t.string()).schema // () => t.string()
```

### `t.mutate(from, to, mutator)`

```ts
t.mutate(t.string(), t.number(), value => value.length)

t.mutate(t.string(), t.number(), value => value.length).from // t.string()
t.mutate(t.string(), t.number(), value => value.length).to // t.number()
t.mutate(t.string(), t.number(), value => value.length).mutator // (value: string) => number
```

### Utility Wrappers

### `t.optional(schema)`

```ts
t.optional(t.string())

t.optional(t.string()).schema // t.string()
```

### `t.nullable(schema)`

```ts
t.nullable(t.string())

t.nullable(t.string()).schema // t.string()
```

### `t.nullish(schema)`

```ts
t.nullish(t.string())

t.nullish(t.string()).schema // t.string()
```

## Pipelines: `preprocess`, `validate`, `process`

All schemas support the following pipelines: `preprocess`, `validate`, `process`.

- `preprocess` - transforms the value before validation
- `validate` - validates the value
- `process` - transforms the value after validation

```ts
const schema = t
  .string()
  .preprocess(v => String(v))
  .preprocess<string>(v => v.trim())
  .validate(v => (v.length > 0 ? undefined : 'Empty string'))
  .process(v => v.toUpperCase())

schema.parse(' hello ') // 'HELLO'
```

## Defaults and Fallbacks

- `.default(valueOrFactory)` - sets the default value if the value is undefined
- `.fallback(valueOrFactory)` - sets the fallback value if the schema validation fails

```ts
t.string().default('N/A').parse(undefined) // 'N/A'

t.number().min(0).fallback(0).parse(-1) // 0
```

## Sync vs Async

- `parse`/`safeParse` - sync pipelines
- `asyncParse`/`asyncSafeParse` - async pipelines

```ts
t.string()
  .validate(async v => ((await isTaken(v)) ? 'Username is taken' : undefined))
  .parse('foo') // throws TyrunRuntimeError
await t
  .string()
  .validate(async v => ((await isTaken(v)) ? 'Username is taken' : undefined))
  .parseAsync('foo')
```

## Error Handling

Structured errors use `TyrunError` and `Issue[]`. Codes and messages are defined in `constants.CODES` and `constants.ERRORS`.

```ts
try {
  t.number().min(10).parse(3)
} catch (e) {
  if (e instanceof errors.TyrunError) {
    console.log(e.issues) // [{ code, error, path }]
  }
}
```

## Type Utilities

Available on `T`:

- `T.Input<Schema>` and `T.Output<Schema>`
- `T.InputShape<Shape>` and `T.OutputShape<Shape>`
- `T.InputIntersection<[...]>` and `T.OutputIntersection<[...]>`

```ts
import { t, type T } from 'tyrun'

const User = t.object({
  id: t.number().integer(),
  name: t.string().nonEmpty(),
  email: t.string().email(),
})

type UserIn = T.Input<typeof User> // { id: number, name: string, email: string }
type UserOut = T.Output<typeof User> // { id: number, name: string, email: string } -> No mutations
```

## Custom Schemas

You can create custom schemas by extending the base schema class.

```ts
import { type T, TyrunBaseSchema } from 'tyrun'

type UUID = `${string}-${string}-${string}-${string}-${string}`

// Default configuration for the UUID schema
type UUIDConfig = {
  error: string
  allowNumbers: boolean
}
// Custom type for the UUID schema
interface UUIDType extends T.TyrunBaseType<string, UUID> {
  // Override the type to 'uuid'
  readonly type: 'uuid'
}

class UUIDSchema extends TyrunBaseSchema<string, UUID, UUIDConfig> implements UUIDType {
  // Override the type to 'uuid'
  public override readonly type: 'uuid' = 'uuid' as const

  // Override the constructor to accept the custom configuration
  constructor(config: T.TyrunBaseConfig<UUIDConfig, string, UUID>) {
    super(config)
  }

  // Override the parse method to validate the UUID format
  public override parse(input: unknown): UUID {
    // Wrap the parse method in a try-catch block to handle fallback value
    try {
      // Check if the input is undefined and a default value is provided
      if (input === undefined && this.__config.default !== undefined) return this.runDefault()

      // Run preprocessors
      const preprocessed = this.runPreprocessors(input)

      // Main validation logic
      if (typeof preprocessed !== 'string') throw new errors.TyrunError([this.buildIssue(constants.CODES.BASE.TYPE, constants.ERRORS.BASE.TYPE, [], this.__config.error)])
      if (!this.__config.allowNumbers && /\d/.test(preprocessed)) throw new errors.TyrunError([this.buildIssue(constants.CODES.BASE.TYPE, constants.ERRORS.BASE.TYPE, [], this.__config.error)])
      if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(preprocessed)) throw new errors.TyrunError([this.buildIssue(constants.CODES.BASE.TYPE, constants.ERRORS.BASE.TYPE, [], this.__config.error)])

      // Run validators
      const issues = this.runValidators(preprocessed as UUID)
      if (issues.length > 0) throw new errors.TyrunError(issues)

      // Run processors
      const processed = this.runProcessors(preprocessed as UUID)
      return processed
    } catch (error) {
      // Handle fallback value if the schema validation fails
      if (error instanceof errors.TyrunError && this.__config.fallback !== undefined) return this.runFallback()
      throw error
    }
  }
  // Override the async parse method to validate the UUID format
  public override async parseAsync(input: unknown): Promise<UUID> {
    try {
      if (input === undefined && this.__config.default !== undefined) return await this.runDefaultAsync() // Async default value

      const preprocessed = await this.runPreprocessorsAsync(input) // Async preprocessors

      if (typeof preprocessed !== 'string') throw new errors.TyrunError([this.buildIssue(constants.CODES.BASE.TYPE, constants.ERRORS.BASE.TYPE, [], this.__config.error)])
      if (!this.__config.allowNumbers && /\d/.test(preprocessed)) throw new errors.TyrunError([this.buildIssue(constants.CODES.BASE.TYPE, constants.ERRORS.BASE.TYPE, [], this.__config.error)])
      if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(preprocessed)) throw new errors.TyrunError([this.buildIssue(constants.CODES.BASE.TYPE, constants.ERRORS.BASE.TYPE, [], this.__config.error)])

      const issues = await this.runValidatorsAsync(preprocessed as UUID) // Async validators
      if (issues.length > 0) throw new errors.TyrunError(issues)

      const processed = await this.runProcessorsAsync(preprocessed as UUID) // Async procesors
      return processed
    } catch (error) {
      if (error instanceof errors.TyrunError && this.__config.fallback !== undefined) return await this.runFallbackAsync() // Async fallback value
      throw error
    }
  }
  // Wrap the parse method in a try-catch block
  public override safeParse(input: unknown): T.Result<UUID> {
    try {
      const data = this.parse(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof errors.TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }
  // Wrap the async parse method in a try-catch block
  public override async safeParseAsync(input: unknown): Promise<T.Result<UUID>> {
    try {
      const data = await this.parseAsync(input)
      return { success: true, data }
    } catch (error) {
      if (error instanceof errors.TyrunError) return { success: false, issues: error.issues }
      throw error
    }
  }

  // Clone the schema with the same configuration
  public override clone(): UUIDSchema {
    return new UUIDSchema(this.__config)
  }

  // Any other custom methods can be added here
}

function uuidSchema(error: string | Partial<UUIDConfig> = constants.ERRORS.BASE.TYPE): UUIDSchema {
  const config: UUIDConfig = { error: constants.ERRORS.BASE.TYPE, allowNumbers: true, ...(typeof error === 'string' ? { error } : error) }
  return new UUIDSchema({ ...config, default: undefined, fallback: undefined, validators: [], processors: [], preprocessors: [] })
}
```
