import { method, multi, Multi } from '@arrows/multimethod'
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
    method(Real, whenReal),
    method(Complex, whenComplex),
    method(Base, otherwise)
  ) as UnaryFn
}
