// import { method, _ } from '@arrows/multimethod';
// import { Base } from './Expression';
// import { Real, real } from './real';
// import { complex } from './complex';
// import { Binary, binary, unaryFrom, bindRight } from './binary';
// import { Multiplication, multiply } from './multiplication';
// import { Logarithm } from './logarithmic';
// import { visit, identity, leftChild } from './predicates';

// export class Exponentiation extends Binary {
//   readonly $kind = 'Exponentiation'
// }

// const isExponentiation = (left: Base, _right: Base) =>
//   left instanceof Exponentiation
// const isMultiplication = (left: Base, _right: Base) =>
//   left instanceof Multiplication

import { Genera, Species } from "../utility/tree"
import { ComplexInfinity } from "../primitives/complex"
import { real, complex, boolean } from "../primitives"
import { Binary, binary, when, partialRight } from "../closures/binary"

export type Exponentiation = Binary<Species.raise, Genera.arithmetic>

export const [raise, isExponentiation] = binary<Exponentiation>(
  Species.raise, Genera.arithmetic
)(
  (l, r) => [real(l.value ** r.value), 'real exponentiation'],
  (l, r) => {
    const p = Math.hypot(l.a, l.b), arg = Math.atan2(l.b, l.a)
    const dLnP = r.b * Math.log(p), cArg = r.a * arg
    const multiplicand = (p ** r.a) * Math.exp(-r.b * arg)
    return [
      complex([
        multiplicand * Math.cos(dLnP + cArg),
        multiplicand * Math.sin(dLnP + cArg)
      ]),
      'complex exponentiation'
    ]
  },
  (l, r) => [boolean(l.value || !r.value), 'boolean exponentiation']
)(
  when([complex([0, 0]), real(-1)], [ComplexInfinity, 'division by complex zero']),
  when([real(0), real(-1)], [real(Infinity), 'division by zero']),
  when([real(-0), real(-1)], [real(-Infinity), 'division by negative zero'])
  // method([real(0), _], real(0)),
  // method([_, real(0)], real(1)),
  // method([real(1), _], real(1)),
  // method([_, real(1)], (l: Base, _r: Real) => l),
  // visit(Base, Logarithm)(identity, leftChild)((_l, r) => r.right),
  // method(isExponentiation, (l: Exponentiation, r: Base) => raise(l.left, multiply(l.right, r))),
  // method(isMultiplication, (l: Multiplication, r: Base) => multiply(raise(l.left, r), raise(l.right, r))),
)

export const reciprocal = partialRight(raise)(real(-1))
export const square = partialRight(raise)(real(2))
export const sqrt = partialRight(raise)(real(0.5))
