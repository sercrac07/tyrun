# Tyrun

Validate your input types in runtime.

## Instalation

```bash
npm install tyrun
# or
pnpm add tyrun
# or
yarn add tyrun
# or
bun add tyrun
```

## Features

- **Runtime type safety**
- **Ease and intuitive API**
- **Lightweight**
- **Fully TypeScript typed**

## Usage

Import the main object `t` and start creating your schemas.

```ts
import { t } from 'tyrun'

// Define your schema
const usernameSchema = t
  .string()
  .min(3)
  .max(20)
  .regex(/^[^\s]+$/)

// Check your data
const usernameSafe = usernameSchema.parse('hello-world')

if (usernameSafe.success) {
  console.log(usernameSafe.data)
} else {
  console.log(usernameSafe.errors)
}
```

### String validator

Validates that the input is a string.

```ts
t.string()
t.string().min(10)
t.string().max(100)
t.string().regex(/^[a-zA-Z0-9]+$/)

// Coerce input to be an string
t.string().coerce()
```

### Number validator

Validates that the input is a number.

```ts
t.number()
t.number().min(10)
t.number().max(100)

// Coerce input to be a number
t.number().coerce()
```

### Boolean validator

Validates that the input is a boolean.

```ts
t.boolean()

// Coerce input to be a boolean
t.boolean().coerce()
```

### Object validator

Validates that the input is an object with the specified shape.

```ts
t.object({ name: t.string() })

// Access inner schema
t.object({ name: t.string() }).inner.name
```

### Array validator

Validates that the input is an array of the defined schema.

```ts
t.array(t.string())
t.array(t.string()).min(10)
t.array(t.string()).max(10)

// Access inner schema
t.array(t.string()).inner
```

### Enum validator

Validates that the input is one of the defined enum values.

```ts
t.enum(['a', 'b', 'c'])

// Access enum values
t.enum(['a', 'b', 'c']).values
```

### Record validator

Validates that the input is an object of the defined schema.

```ts
t.record(t.number())

// Access inner schema
t.record(t.number()).inner
```

### Union validator

Validates that the input is one of the defined union schemas.

```ts
t.union([t.string(), t.number()])
```

### Date validator

Validates that the input is a date.

```ts
t.date()
t.date().min(new Date('2025-09-05'))
t.date().max(new Date('2025-09-05'))

// Coerce input to be a date
t.date().coerce()
```
