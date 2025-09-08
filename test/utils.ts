import { T } from '../src'

export function generateSuccess<G>(value: G): T.ParseResult<G> {
  return {
    success: true,
    data: value,
  }
}

export function generateError(...errors: string[]): T.ParseResult<never> {
  return {
    success: false,
    errors,
  }
}
