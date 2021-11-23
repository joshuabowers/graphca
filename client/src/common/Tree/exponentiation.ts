import { method, multi, Multi, _ } from '@arrows/multimethod';
import { Kind, Base, Real, Complex, Exponentiation } from './Expression';
import { partialRight } from './partial';
import { real } from './real';
import { complex } from './complex';

const raiseReals = (left: Real, right: Real) => real(left.value ** right.value)
const raiseComplex = (left: Complex, right: Complex) => {
  const p = Math.hypot(left.a, left.b), arg = Math.atan2(left.b, left.a)
  const dLnP = right.b * Math.log(p), cArg = right.a * arg
  const multiplicand = (p ** right.a) * Math.exp(-right.b * arg)
  return complex(
    multiplicand * Math.cos(dLnP + cArg),
    multiplicand * Math.sin(dLnP + cArg)
  )
}
const raiseRC = (left: Real, right: Complex) => raise(complex(left.value, 0), right)
const raiseCR = (left: Complex, right: Real) => raise(left, complex(right.value, 0))
const raiseBase = (left: Base, right: Base) => new Exponentiation(left, right)

export type Raise = Multi
  & typeof raiseReals
  & typeof raiseComplex
  & typeof raiseRC
  & typeof raiseCR
  & typeof raiseBase

export const raise: Raise = multi(
  method([Real, Real], raiseReals),
  method([Complex, Complex], raiseComplex),
  method([Real, Complex], raiseRC),
  method([Complex, Real], raiseCR),
  method([Base, Base], raiseBase)
)

export const reciprocal = partialRight(raise, real(-1))
export const square = partialRight(raise, real(2))
export const sqrt = partialRight(raise, real(0.5))
