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

```ts
import { t } from 'tyrun'

// Define your schema
const stringSchema = t.string().min(3).max(20)

// Check your data
try {
  stringSchema.parse('This is valid') // Passes
  stringSchema.parse(123) // Throws an error
} catch (error) {
  console.error('Validation error:', error)
}

if (usernameSafe.success) {
  console.log(usernameSafe.data)
} else {
  console.log(usernameSafe.errors)
}
```
