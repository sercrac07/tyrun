import { T } from '../src'

export function generateSuccess<G>(value: G): T.ParseResult<G> {
  return { data: value }
}

export function generateError(...errors: string[]): T.ParseResult<never> {
  return { errors }
}
