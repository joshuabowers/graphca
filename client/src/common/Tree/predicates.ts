import { Multi, method } from '@arrows/multimethod'
import { Base } from './Expression'
import { real, Real } from './real'
import { Complex } from './complex'
import { Binary } from './binary'
import { is, Constructor } from './is'
import { equals } from './equality'

export type Predicate<T extends Base> = (t: T) => boolean

export type ConstantPredicate = Multi 
  & Predicate<Real>
  & Predicate<Complex>

export const not = <T>(type: new(...args: any[]) => T) => 
  (value: unknown) => !(value instanceof type)
export const notAny = <T extends Base>(...types: (new(...args: any[]) => T)[]) => 
  (value: unknown) => types.every((type) => !(value instanceof type))
export const any = <T extends Base>(...types: (new(...args: any[]) => T)[]) => 
  (value: unknown) => types.some(type => value instanceof type)

export type Which<T extends Base> = (t: T) => Base

export const areEqual = <L extends Base, R extends Base>(leftType: Constructor<L>, rightType: Constructor<R>) =>
  (leftSelect: Which<L>, rightSelect: Which<R>) =>
    (left: Base, right: Base) => 
      is(leftType)(left) && is(rightType)(right)
      && equals(leftSelect(left), rightSelect(right))

export const identity = <T extends Base>(t: T) => t
export const leftChild = <T extends Binary>(t: T) => t.left
export const rightChild = <T extends Binary>(t: T) => t.right
export const negated = <T extends Binary, U extends Binary>(sub: Which<U>) =>
  (t: T) =>
    (equals(t.left, real(-1)) && is(Binary)(t.right) && sub(t.right as U)) || real(NaN)

export type AreEqualFn = typeof areEqual

export const visit = <L extends Base, R extends Base>(leftType: Constructor<L>, rightType: Constructor<R>) =>
  (leftSelect: Which<L>, rightSelect: Which<R>) =>
    (fn: (left: L, right: R) => Base) =>
      method(areEqual(leftType, rightType)(leftSelect, rightSelect), fn)
