import { method, multi, Multi, _ } from '@arrows/multimethod';
import { 
  Base, Real, Complex, Exponentiation, Logarithm, Multiplication 
} from './Expression';
import { real } from './real';
import { complex } from './complex';
import { multiply } from './multiplication';
import { equals } from './equality';

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

const isN_LofN = (left: Base, right: Base) =>
  right instanceof Logarithm && equals(left, right.left)
const isE_A = (left: Base, _right: Base) =>
  left instanceof Exponentiation
const isM_A = (left: Base, _right: Base) =>
  left instanceof Multiplication

export type Raise = Multi
  & typeof raiseReals
  & typeof raiseComplex
  & typeof raiseRC
  & typeof raiseCR
  & typeof raiseBase

export const raise: Raise = multi(
  method([complex(0, 0), real(-1)], complex(Infinity, 0)),
  method([Real, Real], raiseReals),
  method([Complex, Complex], raiseComplex),
  method([Real, Complex], raiseRC),
  method([Complex, Real], raiseCR),
  method([real(0), _], real(0)),
  method([_, real(0)], real(1)),
  method([real(1), _], real(1)),
  method([_, real(1)], (l: Base, _r: Real) => l),
  method(isN_LofN, (_l: Base, r: Logarithm) => r.right),
  method(isE_A, (l: Exponentiation, r: Base) => raise(l.left, multiply(l.right, r))),
  method(isM_A, (l: Multiplication, r: Base) => multiply(raise(l.left, r), raise(l.right, r))),
  method([Base, Base], raiseBase)
)

function partialRight(right: Real) {
  type Unary = Multi
    & ((expression: Real) => Real)
    & ((expression: Complex) => Complex)
    & ((expression: Base) => Exponentiation)
  return multi(
    method(Base, (left: Base) => raise(left, right))
  ) as Unary
}

export const reciprocal = partialRight(real(-1))
export const square = partialRight(real(2))
export const sqrt = partialRight(real(0.5))
