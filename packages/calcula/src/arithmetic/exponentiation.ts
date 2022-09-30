import { _ } from '@arrows/multimethod'
import { unit } from '../monads/writer'
import { TreeNode, Genera, Species } from "../utility/tree"
import { real, complex, boolean } from "../primitives"
import { Binary, binary, when, partialRight } from "../closures/binary"
import { deepEquals, isValue } from "../utility/deepEquals"
import { isMultiplication, Multiplication, multiply } from './multiplication'
import { isLogarithm, Logarithm } from '../functions/logarithmic'

export type Exponentiation = Binary<Species.raise, Genera.arithmetic>

export const [raise, isExponentiation, $raise] = binary<Exponentiation>(
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
  when([isValue(complex([0, 0])), isValue(real(-1))], [complex([Infinity, 0]), 'division by complex zero']),
  when([isValue(real(0)), isValue(real(-1))], [real(Infinity), 'division by zero']),
  when([isValue(real(-0)), isValue(real(-1))], [real(-Infinity), 'division by negative zero']),
  when([isValue(real(0)), _], [real(0), 'powers of 0']),
  when([_, isValue(real(0))], [real(1), 'exponent of 0']),
  when([isValue(real(1)), _], [real(1), 'powers of 1']),
  when([_, isValue(real(1))], (l, _r) => [unit(l), 'exponent of 1']),
  when<TreeNode, Logarithm>(
    (l, r) => isLogarithm(r) && deepEquals(l, r.value.left),
    (_l, r) => [r.right, 'inverse function cancellation']
  ),
  when<Exponentiation, TreeNode>(
    (l, _r) => isExponentiation(l),
    (l, r) => [raise(l.left, multiply(l.right, unit(r))), 'exponential product']
  ),
  when<Multiplication, TreeNode>(
    (l, _r) => isMultiplication(l),
    (l, r) => [
      multiply(raise(l.left, unit(r)), raise(l.right, unit(r))), 
      'exponential distribution'
    ]
  )
)

export const reciprocal = partialRight(raise)(real(-1))
export const square = partialRight(raise)(real(2))
export const sqrt = partialRight(raise)(real(0.5))
