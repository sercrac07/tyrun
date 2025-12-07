import type { Issue } from './types'

/**
 * Error thrown when parsing a schema fails due to validation issues.
 * Contains a list of `Issue` entries for detailed diagnostics.
 */
export class TyrunError extends Error {
  constructor(public issues: Issue[]) {
    super('Error while parsing a schema')
    this.name = 'TyrunError'
  }
}

/**
 * Error thrown when runtime misuse occurs, e.g., using async validators/processors in a synchronous parse path.
 */
export class TyrunRuntimeError extends Error {
  constructor(error: string) {
    super(error)
    this.name = 'TyrunRuntimeError'
  }
}
