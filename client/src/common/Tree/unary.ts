import { method, multi, Multi } from '@arrows/multimethod'
import { is } from './is'
import { Base, Constructor } from './Expression'
import { Binary, BindTo } from './binary'
import { Real } from './real'
import { Complex } from './complex'

export { bindLeft, bindRight } from './binary'

export abstract class Unary extends Base {
  constructor(readonly expression: Base) { super() }
}

type when<T, R = T> = (expression: T) => R

type UnaryFn<T> = Multi 
  & when<Real>
  & when<Complex>
  & when<Base, T>

export const unary = <T extends Unary>(type: Constructor<T>) => 
  (
    whenReal: when<Real>, 
    whenComplex: when<Complex>
  ): UnaryFn<T> => {
    return multi(
      method(is(Real), whenReal),
      method(is(Complex), whenComplex),
      method(is(Base), (expression: Base) => new type(expression))
    )
  }

export const unaryVia = <T extends Binary>(type: Constructor<T>, bind: BindTo) => 
  (bound: Base) => 
    (
      whenReal: when<Real>,
      whenComplex: when<Complex>
    ): UnaryFn<T> => {
      return multi(
        method(is(Real), whenReal),
        method(is(Complex), whenComplex),
        method(is(Base), (expression: Base) => new type(...(bind(expression, bound))))
      )
    }
