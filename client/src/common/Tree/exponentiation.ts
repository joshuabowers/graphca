import { method, fromMulti, _ } from '@arrows/multimethod';
import { Base } from './Expression';
import { Real, real } from './real';
import { complex } from './complex';
import { Binary, binary, unaryFrom, bindRight } from './binary';
import { Multiplication, multiply } from './multiplication';
import { Logarithm } from './logarithmic';
import { visit, identity, leftChild } from './predicates';

export class Exponentiation extends Binary {
  readonly $kind = 'Exponentiation'
}

const isExponentiation = (left: Base, _right: Base) =>
  left instanceof Exponentiation
const isMultiplication = (left: Base, _right: Base) =>
  left instanceof Multiplication

const rawRaise = binary(Exponentiation)(
  (l, r) => real(l.value ** r.value),
  (l, r) => {
    const p = Math.hypot(l.a, l.b), arg = Math.atan2(l.b, l.a)
    const dLnP = r.b * Math.log(p), cArg = r.a * arg
    const multiplicand = (p ** r.a) * Math.exp(-r.b * arg)
    return complex(
      multiplicand * Math.cos(dLnP + cArg),
      multiplicand * Math.sin(dLnP + cArg)
    )
  }
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
  visit(Base, Logarithm)(identity, leftChild)((_l, r) => r.right),
  method(isExponentiation, (l: Exponentiation, r: Base) => raise(l.left, multiply(l.right, r))),
  method(isMultiplication, (l: Multiplication, r: Base) => multiply(raise(l.left, r), raise(l.right, r))),
)(rawRaise)

const fromRaise = unaryFrom(raise, bindRight)
export const reciprocal = fromRaise(real(-1))
export const square = fromRaise(real(2))
export const sqrt = fromRaise(real(0.5))
