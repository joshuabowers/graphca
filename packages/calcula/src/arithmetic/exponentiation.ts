import { _ } from '@arrows/multimethod'
import { unit } from '../monads/writer'
import { TreeNode, Genera, Species, Notation } from "../utility/tree"
import { real, complex, boolean } from "../primitives"
import { Binary, binary, when, partialRight } from "../closures/binary"
import { deepEquals, isValue } from "../utility/deepEquals"
import { isMultiplication, Multiplication, multiply } from './multiplication'
import { isLogarithm, Logarithm } from '../functions/logarithmic'
import { rule } from '../utility/rule'

export type Exponentiation = Binary<Species.raise, Genera.arithmetic>

export const [raise, isExponentiation, $raise] = binary<Exponentiation>(
  '^', Notation.infix, Species.raise, Genera.arithmetic
)(
  (l, r) => real(l.value ** r.value),
  (l, r) => {
    const p = Math.hypot(l.a, l.b), arg = Math.atan2(l.b, l.a)
    const dLnP = r.b * Math.log(p), cArg = r.a * arg
    const multiplicand = (p ** r.a) * Math.exp(-r.b * arg)
    return complex([
      multiplicand * Math.cos(dLnP + cArg),
      multiplicand * Math.sin(dLnP + cArg)
    ])
  },
  (l, r) => boolean(l.value || !r.value)
)(
  when(
    [isValue(complex([0, 0])), isValue(real(-1))], 
    [complex([Infinity, 0]), rule`${complex([Infinity, 0])}`, 'division by complex zero']
  ),
  when(
    [isValue(real(0)), isValue(real(-1))], 
    [real(Infinity), rule`${real(Infinity)}`, 'division by zero']
  ),
  when(
    [isValue(real(-0)), isValue(real(-1))], 
    [real(-Infinity), rule`${real(-Infinity)}`, 'division by negative zero']
  ),
  when([isValue(real(0)), _], [real(0), rule`${real(0)}`, 'powers of 0']),
  when([_, isValue(real(0))], [real(1), rule`${real(1)}`, 'exponent of 0']),
  when([isValue(real(1)), _], [real(1), rule`${real(1)}`, 'powers of 1']),
  when([_, isValue(real(1))], (l, _r) => [unit(l), rule`${l}`, 'exponent of 1']),

  // QUESTION: Should this be `${l}^log(${l}, ${r.right})`? That would make
  // the rewrite obvious.
  when<TreeNode, Logarithm>(
    (l, r) => isLogarithm(r) && deepEquals(l, r.value.left),
    (_l, r) => [r.right, rule`${r.right}`, 'inverse function cancellation']
  ),
  when<Exponentiation, TreeNode>(
    (l, _r) => isExponentiation(l),
    (l, r) => [
      raise(l.left, multiply(l.right, unit(r))), 
      rule`${l.left}^(${l.right} * ${r})`,
      'exponential product'
    ]
  ),
  when<Multiplication, TreeNode>(
    (l, _r) => isMultiplication(l),
    (l, r) => [
      multiply(raise(l.left, unit(r)), raise(l.right, unit(r))), 
      rule`(${l.left}^${r}) * (${l.right}^${r})`,
      'exponential distribution'
    ]
  )
)

export const reciprocal = partialRight(raise)(real(-1))
export const square = partialRight(raise)(real(2))
export const sqrt = partialRight(raise)(real(0.5))
