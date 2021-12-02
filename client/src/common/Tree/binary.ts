import { method, multi, Multi } from '@arrows/multimethod'
import { Base } from './Expression'
import { Real } from './real'
import { Complex } from './complex'

export abstract class Binary extends Base {
  constructor(readonly left: Base, readonly right: Base) { super() }
}

export const binary = (
  whenRxR: (left: Real, right: Real) => Real, 
  whenCxC: (left: Complex, right: Complex) => Complex, 
  whenRxC: (left: Real, right: Complex) => Complex, 
  whenCxR: (left: Complex, right: Real) => Complex, 
  whenBxB: (left: Base, right: Base) => Base
) => {
  type BinaryFn = Multi & typeof whenRxR & typeof whenCxC 
    & typeof whenRxC & typeof whenCxR & typeof whenBxB
  return multi(
    method([Real, Real], whenRxR),
    method([Complex, Complex], whenCxC),
    method([Real, Complex], whenRxC),
    method([Complex, Real], whenCxR),
    method([Base, Base], whenBxB)
  ) as BinaryFn
}
