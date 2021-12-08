import { method, multi, Multi } from '@arrows/multimethod'
import { is } from './is'
import { Base } from './Expression'
import { Real } from './real'
import { Complex } from './complex'

export abstract class Unary extends Base {
  constructor(readonly expression: Base) { super() }
}

export function unary(
  whenReal: (expression: Real) => Real, 
  whenComplex: (expression: Complex) => Complex, 
  otherwise: (expression: Base) => Base
) {
  type UnaryFn = (Multi & typeof whenReal & typeof whenComplex & typeof otherwise)
  return multi(
    method(is(Real), whenReal),
    method(is(Complex), whenComplex),
    method(is(Base), otherwise)
  ) as UnaryFn
}
