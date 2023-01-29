import { _ } from '@arrows/multimethod'
import { Writer, unit } from '../monads/writer'
import { TreeNode, Clades, Genera, Species, Notation } from '../utility/tree'
import { Complex, real, complex, boolean, nan, isReal, isPrimitive, isComplex } from '../primitives'
import { Binary, binary, when, partialLeft, binaryFrom } from '../closures/binary'
import { add } from './addition'
import { 
  Exponentiation, isExponentiation, raise, reciprocal, square 
} from './exponentiation'
import { deepEquals, isValue } from '../utility/deepEquals'
import { identityRule, rule } from '../utility/rule'

export type Multiplication = Binary<Species.multiply, Genera.arithmetic>
type MultiplicationOfLeftExponential = Multiplication & {
  readonly left: Writer<Exponentiation>
}
type MultiplicationOfRightExponential = Multiplication & {
  readonly right: Writer<Exponentiation>
}

const isComplexWrapped = (v: Writer<TreeNode>): v is Writer<Complex> => 
  isComplex(v) && v.value.b === 0
const isImaginary = (v: Writer<TreeNode>): v is Writer<Complex> => 
  isComplex(v) && v.value.a === 0

export const [multiply, isMultiplication, $multiply] = binary<Multiplication>(
  '*', Notation.infix, Species.multiply, Genera.arithmetic
)(
  (l, r) => real(l.value * r.value),
  (l, r) => complex([
    (l.a * r.a) - (l.b * r.b),
    (l.a * r.b) + (l.b * r.a)
  ]),
  (l, r) => boolean(l.value && r.value)
)(
  when(
    [l => l.value.clade !== Clades.primitive, isPrimitive],
    (l, r) => [multiply(unit(r), unit(l)), rule`${r} * ${l}`, 'reorder operands']
  ),
  when<Complex, Complex>(
    [isComplexWrapped, isComplexWrapped], 
    (l, r) => [complex([l.a * r.a, 0]), rule`${complex([l.a * r.a, 0])}`, 'complex multiplication']
  ),
  when<Complex, Complex>(
    [isComplexWrapped, isImaginary],
    (l, r) => [complex([0, l.a * r.b]), rule`${complex([0, l.a * r.b])}`, 'complex multiplication']
  ),
  when<Complex, Complex>(
    [isImaginary, isComplexWrapped],
    (l, r) => [complex([0, l.b * r.a]), rule`${complex([0, l.b * r.a])}`, 'complex multiplication']
  ),
  when<Complex, Complex>(
    [isComplex, isComplexWrapped],
    (l, r) => [complex([l.a * r.a, 0]), rule`${complex([l.a * r.a, 0])}`, 'complex multiplication']
  ),
  when([isValue(real(0)), isValue(real(Infinity))], [nan, rule`${nan}`, 'incalculable']),
  when([isValue(real(Infinity)), isValue(real(0))], [nan, rule`${nan}`, 'incalculable']),
  when([isValue(real(0)), _], [real(0), rule`${real(0)}`, 'zero absorption']),
  when([isValue(complex([0, 0])), _], [complex([0, 0]), rule`${complex([0,0])}`, 'zero absorption']),
  when([isValue(real(1)), _], (_l, r) => [r, identityRule(r), 'multiplicative identity']),
  when([isValue(complex([1, 0])), _], (_l, r) => [r, identityRule(r), 'multiplicative identity']),
  when([isValue(real(Infinity)), _], [real(Infinity), rule`${real(Infinity)}`, 'infinite absorption']),
  when([isValue(real(-Infinity)), _], [real(-Infinity), rule`${real(-Infinity)}`, 'infinite absorption']),
  when<TreeNode, Multiplication>(
    (l, r) => isPrimitive(l) && isMultiplication(r) && isPrimitive(r.value.left),
    (l, r) => [
      multiply(multiply(unit(l), r.left), r.right),
      rule`(${l} * ${r.left}) * ${r.right}`,
      'multiplicative associativity'
    ]
  ),
  when(deepEquals, (l, _r) => [square(unit(l)), rule`${l}^2`, 'equivalence: replaced with square']),
  when<Multiplication, Multiplication>(
    (l, r) => isMultiplication(l) && isMultiplication(r)
      && deepEquals(l.value.left, r.value.left),
    (l, r) => [
      multiply(
        multiply(l.left, r.left),
        multiply(l.right, r.right)
      ),
      rule`(${l.left} * ${r.left}) * (${l.right} * ${r.right})`,
      'collecting equivalent left multiplicands'
    ]
  ),
  when<Multiplication, Multiplication>(
    (l, r) => isMultiplication(l) && isMultiplication(r)
      && deepEquals(l.value.left, r.value.right),
    (l, r) => [
      multiply(
        multiply(l.left, r.right),
        multiply(l.right, r.left)
      ),
      rule`(${l.left} * ${r.right}) * (${l.right} * ${r.left})`,
      'collecting equivalent left/right multiplicands'
    ]
  ),
  when<Multiplication, Multiplication>(
    (l, r) => isMultiplication(l) && isMultiplication(r)
      && deepEquals(l.value.right, r.value.left),
    (l, r) => [
      multiply(
        multiply(l.right, r.left),
        multiply(l.left, r.right)
      ),
      rule`(${l.right} * ${r.left}) * (${l.left} * ${r.right})`,
      'collecting equivalent right/left multiplicands'
    ]
  ),
  when<Multiplication, Multiplication>(
    (l, r) => isMultiplication(l) && isMultiplication(r)
      && deepEquals(l.value.right, r.value.right),
    (l, r) => [
      multiply(
        multiply(l.left, r.left),
        multiply(l.right, r.right)
      ),
      rule`(${l.left} * ${r.left}) * (${l.right} * ${r.right})`,
      'collecting equivalent right multiplicands'
    ]
  ),
  when<Multiplication, Multiplication>(
    (l, r) => isMultiplication(l) && isMultiplication(r)
      && deepEquals(l, r.value.left),
    (l, r) => [
      multiply(square(unit(l)), r.right), 
      rule`[${l}]^2 * ${r.right}`,
      'equivalent: left operand and left child of right operand'
    ]
  ),
  when<Multiplication, Multiplication>(
    (l, r) => isMultiplication(l) && isMultiplication(r)
      && deepEquals(l, r.value.right),
    (l, r) => [
      multiply(square(unit(l)), r.left), 
      rule`[${l}]^2 * ${r.left}`,
      'equivalent: left operand and right child of right operand'
    ]
  ),
  when<Multiplication, Multiplication>(
    (l, r) => isMultiplication(l) && isMultiplication(r)
      && deepEquals(l.value.left, r),
    (l, r) => [ 
      multiply(square(unit(r)), l.right),
      rule`[${r}]^2 * ${l.right}`,
      'equivalent: left child of left operand and right operand'
    ]
  ),
  when<Multiplication, Multiplication>(
    (l, r) => isMultiplication(l) && isMultiplication(r)
      && deepEquals(l.value.right, r),
    (l, r) => [
      multiply(square(unit(r)), l.left),
      rule`[${r}]^2 * ${l.left}`,
      'equivalent: right child of left operand and right operand'
    ]
  ),
  when<Multiplication, Multiplication>(
    (l, r) => isMultiplication(l) && isMultiplication(r)
      && ((
        isExponentiation(r.value.left)
        && (
          (isExponentiation(l.value.left) && deepEquals(l.value.left.value.left, r.value.left.value.left))
          || deepEquals(l.value.left, r.value.left.value.left)
        )
      ) || (
        isExponentiation(l.value.left)
        && (
          (isExponentiation(r.value.left) && deepEquals(l.value.left.value.left, r.value.left.value.left))
          || deepEquals(l.value.left.value.left, r.value.left)
        )
      ) || (
        isExponentiation(r.value.right)
        && (
          (isExponentiation(l.value.right) && deepEquals(l.value.right.value.left, r.value.right.value.left))
          || deepEquals(l.value.right, r.value.right.value.left)
        )
      ) || (
        isExponentiation(l.value.right)
        && (
          (isExponentiation(r.value.right) && deepEquals(l.value.right.value.left, r.value.right.value.left))
          || deepEquals(l.value.right.value.left, r.value.right)
        )
      )),
    (l, r) => [
      multiply(
        multiply(l.left, r.left),
        multiply(l.right, r.right)
      ),
      rule`(${l.left} * ${r.left}) * (${l.right} * ${r.right})`,
      'equivalent: left child of left multiplication and left child of right multiplication'
    ]
  ),
  when<Multiplication, Multiplication>(
    (l, r) => isMultiplication(l) && isMultiplication(r)
      && ((
        isExponentiation(r.value.right)
        && (
          (isExponentiation(l.value.left) && deepEquals(l.value.left.value.left, r.value.right.value.left))
          || deepEquals(l.value.left, r.value.right.value.left)
        )
      ) || (
        isExponentiation(l.value.right)
        && (
          (isExponentiation(r.value.left) && deepEquals(l.value.right.value.left, r.value.left.value.left))
          || deepEquals(l.value.right.value.left, r.value.left)
        )
      ) || (
        isExponentiation(r.value.left)
        && (
          (isExponentiation(l.value.right) && deepEquals(l.value.right.value.left, r.value.left.value.left))
          || deepEquals(l.value.right, r.value.left.value.left)
        )
      ) || (
        isExponentiation(l.value.left)
        && (
          (isExponentiation(r.value.right) && deepEquals(l.value.left.value.left, r.value.right.value.left))
          || deepEquals(l.value.left.value.left, r.value.right)
        )
      )),
    (l, r) => [
      multiply(
        multiply(l.left, r.right),
        multiply(l.right, r.left),
      ),
      rule`(${l.left} * ${r.right}) * (${l.right} * ${r.left})`,
      'equivalent: left child of left multiplication and right child of right multiplication'
    ]
  ),
  when<Exponentiation, Exponentiation>(
    (l, r) => isExponentiation(l) && isExponentiation(r) 
      && deepEquals(l.value.left, r.value.left),
    (l, r) => [
      raise(l.left, add(l.right, r.right)), 
      rule`${l.left}^(${l.right} + ${r.right})`,
      'combined like terms'
    ]
  ),
  when<Exponentiation, Multiplication>(
    (l, r) => isExponentiation(l) && isMultiplication(r)
      && deepEquals(l.value.left, r.value.left),
    (l, r) => [
      multiply(
        r.right, raise(l.left, add(l.right, real(1)))
      ),
      rule`${r.right} * ${l.left}^(${l.right} + ${real(1)})`,
      'equivalent: base of left exponentiation and left child of right'
    ]
  ),
  when<Exponentiation, Multiplication>(
    (l, r) => isExponentiation(l) && isMultiplication(r)
      && deepEquals(l.value.left, r.value.right),
    (l, r) => [
      multiply(
        r.left, raise(l.left, add(l.right, real(1)))
      ),
      rule`${r.left} * ${l.left}^(${l.right} + ${real(1)})`,
      'equivalent: base of left exponentiation and right child of right'
    ]
  ),
  when<Exponentiation, MultiplicationOfLeftExponential>(
    (l, r) => isExponentiation(l) && isMultiplication(r) 
      && isExponentiation(r.value.left) && deepEquals(l.value.left, r.value.left.value.left),
    (l, r) => [
      multiply(
        r.right,
        raise(l.left, add(l.right, r.left.value.right))
      ),
      rule`${r.right} * ${l.left}^(${l.right} + ${r.left.value.right})`,
      'equivalent: base of left exponentiation and base of left child exponentiation of right multiplication'
    ]
  ),
  when<Exponentiation, MultiplicationOfRightExponential>(
    (l, r) => isExponentiation(l) && isMultiplication(r)
      && isExponentiation(r.value.right) && deepEquals(l.value.left, r.value.right.value.left),
    (l, r) => [
      multiply(
        r.left,
        raise(l.left, add(l.right, r.right.value.right))
      ),
      rule`${r.left} * ${l.left}^(${l.right} + ${r.right.value.right})`,
      'equivalent: base of left exponentiation and base of right child exponentiation of right multiplication'
    ]
  ),
  when<Multiplication, Exponentiation>(
    (l, r) => isMultiplication(l) && isExponentiation(r)
      && deepEquals(l.value.left, r.value.left),
    (l, r) => [
      multiply(
        l.right, raise(r.left, add(r.right, real(1)))
      ),
      rule`${l.right} * ${r.left}^(${r.right} + ${real(1)})`,
      'equivalent: left child of left and base of right exponentiation'
    ]
  ),
  when<Multiplication, Exponentiation>(
    (l, r) => isMultiplication(l) && isExponentiation(r)
      && deepEquals(l.value.right, r.value.left),
    (l, r) => [
      multiply(
        l.left, raise(r.left, add(r.right, real(1)))
      ),
      rule`${l.left} * ${r.left}^(${r.right} + ${real(1)})`,
      'equivalent: right child of left and base of right exponentiation'
    ]
  ),
  when<MultiplicationOfLeftExponential, Exponentiation>(
    (l, r) => isMultiplication(l) && isExponentiation(l.value.left)
      && isExponentiation(r) && deepEquals(l.value.left.value.left, r.value.left),
    (l, r) => [
      multiply(
        l.right,
        raise(r.left, add(l.left.value.right, r.right))
      ),
      rule`${l.right} * ${r.left}^(${l.left.value.right} + ${r.right})`,
      'equivalent: base of left child exponentiation of left multiplication and base of right exponentiation'
    ]
  ),
  when<MultiplicationOfRightExponential, Exponentiation>(
    (l, r) => isMultiplication(l) && isExponentiation(l.value.right)
      && isExponentiation(r) && deepEquals(l.value.right.value.left, r.value.left),
    (l, r) => [
      multiply(
        l.left,
        raise(r.left, add(l.right.value.right, r.right))
      ),
      rule`${l.left} * ${r.left}^(${l.right.value.right} + ${r.right})`,
      'equivalent: base of right child exponentiation of left multiplication and base of right exponentiation'
    ]
  ),
  when<TreeNode, Multiplication>(
    (l, r) => isMultiplication(r) && deepEquals(l, r.value.left),
    (l, r) => [
      multiply(
        r.right, multiply(unit(l), r.left)
      ),
      rule`${r.right} * (${l} * ${r.left})`,
      'equivalent: left operand and left child of right operand'
    ]
  ),
  when<TreeNode, Multiplication>(
    (l, r) => isMultiplication(r) && deepEquals(l, r.value.right),
    (l, r) => [
      multiply(
        r.left, multiply(unit(l), r.right)
      ),
      rule`${r.left} * (${l} * ${r.right})`,
      'equivalent: left operand and right child of right operand'
    ]
  ),
  when<TreeNode, MultiplicationOfLeftExponential>(
    (l, r) => isMultiplication(r) && isExponentiation(r.value.left)
      && deepEquals(l, r.value.left.value.left),
    (l, r) => [
      multiply(
        r.right, raise(unit(l), add(real(1), r.left.value.right))
      ),
      rule`${r.right} * ${l}^(${real(1)} + ${r.left.value.right})`,
      'equivalent: left operand and base of left child exponentiation of right multiplication'
    ]
  ),
  when<TreeNode, MultiplicationOfRightExponential>(
    (l, r) => isMultiplication(r) && isExponentiation(r.value.right)
      && deepEquals(l, r.value.right.value.left),
    (l, r) => [
      multiply(
        r.left, raise(unit(l), add(real(1), r.right.value.right))
      ),
      rule`${r.left} * ${l}^(${real(1)} + ${r.right.value.right})`,
      'equivalent: left operand and base of right child exponentiation of right multiplication'
    ]
  ),
  when<Multiplication, TreeNode>(
    (l, r) => isMultiplication(l) && deepEquals(l.value.left, r),
    (l, r) => [
      multiply(
        l.right, multiply(unit(r), l.left)
      ),
      rule`${l.right} * (${r} * ${l.left})`,
      'equivalent: left child of left operand and right operand'
    ]
  ),
  when<Multiplication, TreeNode>(
    (l, r) => isMultiplication(l) && deepEquals(l.value.right, r),
    (l, r) => [
      multiply(
        l.left, multiply(unit(r), l.right)
      ),
      rule`${l.left} * (${r} * ${l.right})`,
      'equivalent: right child of left operand and right operand'
    ]
  ),
  when<MultiplicationOfLeftExponential, TreeNode>(
    (l, r) => isMultiplication(l) && isExponentiation(l.value.left)
      && deepEquals(l.value.left.value.left, r),
    (l, r) => [
      multiply(
        l.right, raise(unit(r), add(real(1), l.left.value.right))
      ),
      rule`${l.right} * ${r}^(${real(1)} + ${l.left.value.right})`,
      'equivalent: base of left child exponentiation of left multiplication and right operand'
    ]
  ),
  when<MultiplicationOfRightExponential, TreeNode>(
    (l, r) => isMultiplication(l) && isExponentiation(l.value.right)
      && deepEquals(l.value.right.value.left, r),
    (l, r) => [
      multiply(
        l.left, raise(unit(r), add(real(1), l.right.value.right))
      ),
      rule`${l.left} * ${r}^(${real(1)} + ${l.right.value.right})`,
      'equivalent: base of right child exponentiation of left multiplication and right operand'
    ]
  ),
  when<TreeNode, Exponentiation>(
    (l, r) => isExponentiation(r) && deepEquals(l, r.value.left),
    (l, r) => [
      raise(unit(l), add(real(1), r.right)), 
      rule`${l}^(${real(1)} + ${r.right})`,
      'combined like terms'
    ]
  ),
  when<Exponentiation, TreeNode>(
    (l, r) => isExponentiation(l) && deepEquals(l.value.left, r),
    (l, r) => [
      raise(unit(r), add(real(1), l.right)), 
      rule`${r}^(${real(1)} + ${l.right})`,
      'combined like terms'
    ]
  )
)

const fromMultiply = partialLeft(multiply)
export const negate = fromMultiply(real(-1))
export const double = fromMultiply(real(2))

export const divide = binaryFrom(multiply)(undefined, r => reciprocal(r))
