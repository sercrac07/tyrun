import { Input, Output, TyrunBaseType } from '../types'

export interface TyrunOptionalType<T extends TyrunBaseType<any, any>> extends TyrunBaseType<Input<T> | undefined, Output<T> | undefined> {
  readonly type: 'optional'
  /**
   * Wrapped schema whose input/output becomes optional.
   */
  readonly schema: T
}

export interface TyrunNullableType<T extends TyrunBaseType<any, any>> extends TyrunBaseType<Input<T> | null, Output<T> | null> {
  readonly type: 'nullable'
  /**
   * Wrapped schema whose input/output becomes `null`-able.
   */
  readonly schema: T
}

export interface TyrunNullishType<T extends TyrunBaseType<any, any>> extends TyrunBaseType<Input<T> | null | undefined, Output<T> | null | undefined> {
  readonly type: 'nullish'
  /**
   * Wrapped schema whose input/output becomes `null | undefined`.
   */
  readonly schema: T
}
