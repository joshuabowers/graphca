import { method, multi, Multi, fromMulti } from '@arrows/multimethod'
import { is } from './is'
import { Base, Constructor } from './Expression'
import { Binary, BindTo } from './binary'
import { Real, real } from './real'
import { Complex } from './complex'
import { Boolean } from './boolean'
import { Nil } from './nil'

export { bindLeft, bindRight } from './binary'

export abstract class Unary extends Base {
  constructor(readonly expression: Base) { super() }
}

type when<T, R = T> = (expression: T) => R

type Choose<D, F> = F extends void ? D : F

export type UnaryFn<T, R = void> = Multi 
  & when<Real, Choose<Real, R>>
  & when<Complex, Choose<Complex, R>>
  & when<Boolean, Choose<Real|Boolean, R>>
  & when<Nil, Choose<Real, R>>
  & when<Base, T>

const notValue = (v: Nil) => real(NaN)
const coerce = (b: Boolean) => real(b.value ? 1 : 0)

type MethodFn = typeof method

export const unary = <T extends Unary, R = void>(type: Constructor<T>, resultType?: Constructor<R>) => {
  type Result<U extends Base> = R extends void ? U : R
  return (
    whenReal: when<Real, Result<Real>>, 
    whenComplex: when<Complex, Result<Complex>>,
    whenBoolean?: when<Boolean, Result<Real|Boolean>>,
    whenNil?: when<Nil, Result<Real>>
  ) => {
    const fn: UnaryFn<T, R> = multi(
      method(is(Real), whenReal),
      method(is(Complex), whenComplex),
      method(is(Boolean), whenBoolean ?? ((e: Boolean) => fn(coerce(e)))),
      method(is(Nil), whenNil ?? ((e: Nil) => fn(notValue(e)))),
      method(is(Base), (expression: Base) => new type(expression))
    )
    return (
      ...methods: MethodFn[]
    ): typeof fn => methods.length > 0 ? fromMulti(...methods)(fn) : fn
  }
}

export const unaryVia = <T extends Binary>(type: Constructor<T>, bind: BindTo) => 
  (bound: Base) => 
    (
      whenReal: when<Real>,
      whenComplex: when<Complex>,
      whenBoolean: when<Boolean, Real|Boolean> = coerce,
      whenNil: when<Nil, Real> = notValue
    ): UnaryFn<T> => {
      return multi(
        method(is(Real), whenReal),
        method(is(Complex), whenComplex),
        method(is(Boolean), whenBoolean),
        method(is(Nil), whenNil),
        method(is(Base), (expression: Base) => new type(...(bind(expression, bound))))
      )
    }
