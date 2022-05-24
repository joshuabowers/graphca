import { method, multi, Multi } from '@arrows/multimethod'
import { is } from './is'
import { Base, Constructor } from './Expression'
import { Real } from './real'
import { Complex, complex } from './complex'

export abstract class Binary extends Base {
  constructor(readonly left: Base, readonly right: Base) { super() }
}

type when<P, R = P> = (left: P, right: P) => R
type cast<L, R, V> = (left: L, right: R) => V

type BinaryFn<T> = Multi
  & when<Real>
  & cast<Real, Complex, Complex>
  & cast<Complex, Real, Complex>
  & when<Complex>
  & when<Base, T>

export const binary = <T extends Binary>(type: Constructor<T>) =>
  (
    whenRxR: when<Real>,
    whenCxC: when<Complex>
  ) => {
    const whenBxB: when<Base, T> = (l, r) => new type(l, r)
    const fn: BinaryFn<T> = multi(
      method([is(Real), is(Real)], whenRxR),
      method([is(Complex), is(Complex)], whenCxC),
      method([is(Real), is(Complex)], (l: Real, r: Complex) => fn(complex(l.value, 0), r)),
      method([is(Complex), is(Real)], (l: Complex, r: Real) => fn(l, complex(r.value, 0))),
      method([is(Base), is(Base)], whenBxB)
    )
    return fn  
  }

export type BindTo = (unbound: Base, bound: Base) => [Base, Base]

export const bindLeft: BindTo = (unbound, bound) => [bound, unbound]
export const bindRight: BindTo = (unbound, bound) => [unbound, bound]

export const unaryFrom = <T extends Binary>(fn: BinaryFn<T>, bind: BindTo) => {
  type UnaryFn = Multi
    & ((expression: Real) => Real)
    & ((expression: Complex) => Complex)
    & ((expression: Base) => T)
  return (bound: Base) => multi(
    method(is(Base), (unbound: Base) => fn(...bind(unbound, bound)))
  ) as UnaryFn
}

type BinaryMapFn = (left: Base, right: Base) => [Base, Base]

export const binaryFrom = <T extends Binary>(fn: BinaryFn<T>, map: BinaryMapFn): BinaryFn<T> => (
  multi(
    method([is(Base), is(Base)], (l: Base, r: Base) => fn(...map(l, r)))
  )
)
