import { method, multi, Multi, fromMulti } from '@arrows/multimethod'
import { is } from './is'
import { Base, Constructor } from './Expression'
import { Real, real } from './real'
import { Complex, complex } from './complex'
import { Boolean } from './boolean'
import { Nil } from './nil'

export abstract class Binary extends Base {
  constructor(readonly left: Base, readonly right: Base) { super() }
}

const coerce = (b: Boolean) => real(b.value ? 1 : 0)

type when<P, R = P> = (left: P, right: P) => R
type cast<L, R, V> = (left: L, right: R) => V

type Choose<D, F> = F extends void ? D : F

type BinaryFn<T, R = void> = Multi
  & when<Real, Choose<Real, R>>
  & cast<Real, Complex, Choose<Complex, R>>
  & cast<Complex, Real, Choose<Complex, R>>
  & when<Complex, Choose<Complex, R>>
  & when<Boolean, Choose<Boolean, R>>
  & cast<Boolean, Base, Choose<Real, R>>
  & cast<Base, Boolean, Choose<Real, R>>
  & cast<Nil, Base, Choose<Real, R>>
  & cast<Base, Nil, Choose<Real, R>>
  & when<Base, T>

type MethodFn = typeof method

export const binary = <T extends Binary, R = void>(
  type: Constructor<T>, resultType?: Constructor<R>
) => {
  type Result<U extends Base> = R extends void ? U : R
  return (
    whenRxR: when<Real, Result<Real>>,
    whenCxC: when<Complex, Result<Complex>>,
    whenBxB?: when<Boolean, Result<Boolean>>
  ) => {
    const whenBaseXBase: when<Base, T> = (l, r) => new type(l, r)
    const fn: BinaryFn<T, R> = multi(
      method([is(Real), is(Real)], whenRxR),
      method([is(Complex), is(Complex)], whenCxC),
      method([is(Boolean), is(Boolean)], (whenBxB ?? ((l: Boolean, r: Boolean) => fn(coerce(l), coerce(r))))),
      method([is(Boolean), is(Base)], (l: Boolean, r: Base) => fn(coerce(l), r)),
      method([is(Base), is(Boolean)], (l: Base, r: Boolean) => fn(l, coerce(r))),
      method([is(Real), is(Complex)], (l: Real, r: Complex) => fn(complex(l.value, 0), r)),
      method([is(Complex), is(Real)], (l: Complex, r: Real) => fn(l, complex(r.value, 0))),
      method([is(Nil), is(Base)], real(NaN)),
      method([is(Base), is(Nil)], real(NaN)),
      method([is(Base), is(Base)], whenBaseXBase)
    )
    return (
      ...methods: MethodFn[]
    ): typeof fn => methods.length > 0 ? fromMulti(...methods)(fn) : fn
  }
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
