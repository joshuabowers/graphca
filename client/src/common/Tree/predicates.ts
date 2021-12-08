import { method } from '@arrows/multimethod'
import { Base } from './Expression'
import { Binary } from './binary'
import { equals } from './equality'

export const not = <T>(type: new(...args: any[]) => T) => 
  (value: unknown) => !(value instanceof type)
export const notAny = <T extends Base>(...types: (new(...args: any[]) => T)[]) => 
  (value: unknown) => types.every((type) => !(value instanceof type))
export const any = <T extends Base>(...types: (new(...args: any[]) => T)[]) => 
  (value: unknown) => types.some(type => value instanceof type)

export type Which<T extends Base> = (t: T) => Base
export type Constructor<T> = Function & { prototype: T }

// type can occasionally be undefined, so the guard needs to account for that.
export const is = <T>(type: Constructor<T>) => 
  (v: unknown): v is T => type && v instanceof type

export const areEqual = <L extends Base, R extends Base>(leftType: Constructor<L>, rightType: Constructor<R>) =>
  (leftSelect: Which<L>, rightSelect: Which<R>) =>
    (left: Base, right: Base) => 
      is(leftType)(left) && is(rightType)(right)
      && equals(leftSelect(left), rightSelect(right))

export const identity = <T extends Base>(t: T) => t
export const leftChild = <T extends Binary>(t: T) => t.left
export const rightChild = <T extends Binary>(t: T) => t.right

export type AreEqualFn = typeof areEqual

export const visit = <L extends Base, R extends Base>(leftType: Constructor<L>, rightType: Constructor<R>) =>
  (leftSelect: Which<L>, rightSelect: Which<R>) =>
    (fn: (left: L, right: R) => Base) =>
      method(areEqual(leftType, rightType)(leftSelect, rightSelect), fn)
