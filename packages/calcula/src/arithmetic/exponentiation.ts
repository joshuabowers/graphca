import { _ } from '@arrows/multimethod'
import { TreeNode, Genera, Species, Notation } from "../utility/tree"
import { real, complex, boolean } from "../primitives"
import { Binary, binary, when, partialRight } from "../closures/binary"
import { deepEquals, isValue } from "../utility/deepEquals"
import { isMultiplication, Multiplication, multiply } from './multiplication'
import { isLogarithm, Logarithm } from '../functions/logarithmic'

export type Exponentiation = Binary<Species.raise, Genera.arithmetic>

export const [raise, isExponentiation, $raise] = binary<Exponentiation>(
  '^', Notation.infix, Species.raise, Genera.arithmetic
)(
  (l, r) => real(l.value.value ** r.value.value),
  (l, r) => {
    const p = Math.hypot(l.value.a, l.value.b), arg = Math.atan2(l.value.b, l.value.a)
    const dLnP = r.value.b * Math.log(p), cArg = r.value.a * arg
    const multiplicand = (p ** r.value.a) * Math.exp(-r.value.b * arg)
    return complex([
      multiplicand * Math.cos(dLnP + cArg),
      multiplicand * Math.sin(dLnP + cArg)
    ])
  },
  (l, r) => boolean(l.value.value || !r.value.value)
)(
  when(
    [isValue(complex([0, 0])), isValue(real(-1))], 
    [complex([Infinity, 0]), 'division by complex zero']
  ),
  when(
    [isValue(real(0)), isValue(real(-1))], 
    [real(Infinity), 'division by zero']
  ),
  when(
    [isValue(real(-0)), isValue(real(-1))], 
    [real(-Infinity), 'division by negative zero']
  ),
  when([isValue(real(0)), _], [real(0), 'powers of 0']),
  when([_, isValue(real(0))], [real(1), 'exponent of 0']),
  when([isValue(real(1)), _], [real(1), 'powers of 1']),
  when([_, isValue(real(1))], (l, _r) => [l, 'exponent of 1']),

  when<TreeNode, Logarithm>(
    (l, r) => isLogarithm(r) && deepEquals(l, r.value.left),
    (_l, r) => [r.value.right, 'inverse function cancellation']
  ),
  when<Exponentiation, TreeNode>(
    (l, _r) => isExponentiation(l),
    (l, r) => [
      raise(l.value.left, multiply(l.value.right, r)), 
      'exponential product'
    ]
  ),
  when<Multiplication, TreeNode>(
    (l, _r) => isMultiplication(l),
    (l, r) => [
      multiply(raise(l.value.left, r), raise(l.value.right, r)), 
      'exponential distribution'
    ]
  )
)

export const reciprocal = partialRight(raise)(real(-1))
export const square = partialRight(raise)(real(2))
export const sqrt = partialRight(raise)(real(0.5))
