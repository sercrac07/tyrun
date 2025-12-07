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
import t from 'tyrun'

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
import t, { type T } from 'tyrun'

const User = t.object({
  id: t.number().integer(),
  name: t.string().nonEmpty(),
  email: t.string().email(),
})

type UserIn = T.Input<typeof User> // { id: number, name: string, email: string }
type UserOut = T.Output<typeof User> // { id: number, name: string, email: string } -> No mutations
```
