import { method, multi, Multi } from '@arrows/multimethod'
import { Base } from './Expression'
import { Real } from './real'
import { Complex, complex } from './complex'

export abstract class Binary extends Base {
  constructor(readonly left: Base, readonly right: Base) { super() }
}

export const binary = (
  whenRxR: (left: Real, right: Real) => Real, 
  whenCxC: (left: Complex, right: Complex) => Complex, 
  whenBxB: (left: Base, right: Base) => Base
) => {
  type BinaryFn = Multi & typeof whenRxR 
    & ((left: Real, right: Complex) => Complex)
    & ((left: Complex, right: Real) => Complex)
    & typeof whenCxC & typeof whenBxB
  const fn = multi(
    method([Real, Real], whenRxR),
    method([Complex, Complex], whenCxC),
    method([Real, Complex], (l: Real, r: Complex) => fn(complex(l.value, 0), r)),
    method([Complex, Real], (l: Complex, r: Real) => fn(l, complex(r.value, 0))),
    method([Base, Base], whenBxB)
  ) as BinaryFn
  return fn
}

type BinaryFn = ReturnType<typeof binary>
type BindTo = (unbound: Base, bound: Base) => [Base, Base]

export const bindLeft: BindTo = (unbound, bound) => [bound, unbound]
export const bindRight: BindTo = (unbound, bound) => [unbound, bound]

export const unaryFrom = (fn: BinaryFn, bind: BindTo, bound: Base) => {
  type UnaryFn = Multi
    & ((expression: Real) => Real)
    & ((expression: Complex) => Complex)
    & ((expression: Base) => Base)
  return multi(
    method(Base, (unbound: Base) => fn(...bind(unbound, bound)))
  ) as UnaryFn
}
