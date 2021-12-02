import { method, fromMulti, _ } from '@arrows/multimethod';
import { Base } from './Expression';
import { Real, real } from './real';
import { complex } from './complex';
import { Binary, binary, unaryFrom, bindRight } from './binary';
import { Multiplication, multiply } from './multiplication';
import { Logarithm } from './logarithmic';
import { equals } from './equality';

export class Exponentiation extends Binary {
  readonly $kind = 'Exponentiation'
}

const isN_LofN = (left: Base, right: Base) =>
  right instanceof Logarithm && equals(left, right.left)
const isE_A = (left: Base, _right: Base) =>
  left instanceof Exponentiation
const isM_A = (left: Base, _right: Base) =>
  left instanceof Multiplication

const rawRaise = binary(
  (l, r) => real(l.value ** r.value),
  (l, r) => {
    const p = Math.hypot(l.a, l.b), arg = Math.atan2(l.b, l.a)
    const dLnP = r.b * Math.log(p), cArg = r.a * arg
    const multiplicand = (p ** r.a) * Math.exp(-r.b * arg)
    return complex(
      multiplicand * Math.cos(dLnP + cArg),
      multiplicand * Math.sin(dLnP + cArg)
    )
  },
  (l, r) => new Exponentiation(l, r)
)
export type RaiseFn = typeof rawRaise

export const raise: RaiseFn = fromMulti(
  method([complex(0, 0), real(-1)], complex(Infinity, 0)),
  method([real(0), real(-1)], real(Infinity)),
  method([real(-0), real(-1)], real(-Infinity)),
  method([real(0), _], real(0)),
  method([_, real(0)], real(1)),
  method([real(1), _], real(1)),
  method([_, real(1)], (l: Base, _r: Real) => l),
  method(isN_LofN, (_l: Base, r: Logarithm) => r.right),
  method(isE_A, (l: Exponentiation, r: Base) => raise(l.left, multiply(l.right, r))),
  method(isM_A, (l: Multiplication, r: Base) => multiply(raise(l.left, r), raise(l.right, r))),
)(rawRaise)

export const reciprocal = unaryFrom(raise, bindRight, real(-1))
export const square = unaryFrom(raise, bindRight, real(2))
export const sqrt = unaryFrom(raise, bindRight, real(0.5))
