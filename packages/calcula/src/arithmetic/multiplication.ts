import { _ } from '@arrows/multimethod'
import { Writer } from '../monads/writer'
import { Operation } from '../utility/operation'
import { TreeNode, Clades, Genera, Species, Notation } from '../utility/tree'
import { Complex, real, complex, boolean, nan, isReal, isPrimitive, isComplex } from '../primitives'
import { Binary, binary, when, partialLeft, binaryFrom } from '../closures/binary'
import { add } from './addition'
import { 
  Exponentiation, isExponentiation, raise, reciprocal, square 
} from './exponentiation'
import { deepEquals, isValue } from '../utility/deepEquals'

export type Multiplication = Binary<Species.multiply, Genera.arithmetic>
type MultiplicationOfLeftExponential = Multiplication & {
  readonly left: Writer<Exponentiation, Operation>
}
type MultiplicationOfRightExponential = Multiplication & {
  readonly right: Writer<Exponentiation, Operation>
}

const isComplexWrapped = (v: Writer<TreeNode, Operation>): v is Writer<Complex, Operation> => 
  isComplex(v) && v.value.raw.b === 0
const isImaginary = (v: Writer<TreeNode, Operation>): v is Writer<Complex, Operation> => 
  isComplex(v) && v.value.raw.a === 0

export const [multiply, isMultiplication, $multiply] = binary<Multiplication>(
  '*', Notation.infix, Species.multiply, Genera.arithmetic
)(
  (l, r) => real(l.value.raw * r.value.raw),
  (l, r) => complex(
    (l.value.raw.a * r.value.raw.a) - (l.value.raw.b * r.value.raw.b),
    (l.value.raw.a * r.value.raw.b) + (l.value.raw.b * r.value.raw.a)
  ),
  (l, r) => boolean(l.value.raw && r.value.raw)
)(
  when(
    [l => l.value.clade !== Clades.primitive, isPrimitive],
    (l, r) => [multiply(r, l), 'reorder operands']
  ),
  when<Complex, Complex>(
    [isComplexWrapped, isComplexWrapped], 
    (l, r) => [complex(l.value.raw.a * r.value.raw.a, 0), 'complex multiplication']
  ),
  when<Complex, Complex>(
    [isComplexWrapped, isImaginary],
    (l, r) => [complex(0, l.value.raw.a * r.value.raw.b), 'complex multiplication']
  ),
  when<Complex, Complex>(
    [isImaginary, isComplexWrapped],
    (l, r) => [complex(0, l.value.raw.b * r.value.raw.a), 'complex multiplication']
  ),
  when<Complex, Complex>(
    [isComplex, isComplexWrapped],
    (l, r) => [complex(l.value.raw.a * r.value.raw.a, 0), 'complex multiplication']
  ),
  when([isValue(real(0)), isValue(real(Infinity))], [nan, 'incalculable']),
  when([isValue(real(Infinity)), isValue(real(0))], [nan, 'incalculable']),
  when([isValue(real(0)), _], [real(0), 'zero absorption']),
  when([isValue(complex(0, 0)), _], [complex(0, 0), 'zero absorption']),
  when([isValue(real(1)), _], (_l, r) => [r, 'multiplicative identity']),
  when([isValue(complex(1, 0)), _], (_l, r) => [r, 'multiplicative identity']),
  when([isValue(real(Infinity)), _], [real(Infinity), 'infinite absorption']),
  when([isValue(real(-Infinity)), _], [real(-Infinity), 'infinite absorption']),
  when<TreeNode, Multiplication>(
    (l, r) => isPrimitive(l) && isMultiplication(r) && isPrimitive(r.value.left),
    (l, r) => [
      multiply(multiply(l, r.value.left), r.value.right),
      'multiplicative associativity'
    ]
  ),
  when(deepEquals, (l, _r) => [square(l), 'equivalence: replaced with square']),
  when<Multiplication, Multiplication>(
    (l, r) => isMultiplication(l) && isMultiplication(r)
      && deepEquals(l.value.left, r.value.left),
    (l, r) => [
      multiply(
        multiply(l.value.left, r.value.left),
        multiply(l.value.right, r.value.right)
      ),
      'collecting equivalent left multiplicands'
    ]
  ),
  when<Multiplication, Multiplication>(
    (l, r) => isMultiplication(l) && isMultiplication(r)
      && deepEquals(l.value.left, r.value.right),
    (l, r) => [
      multiply(
        multiply(l.value.left, r.value.right),
        multiply(l.value.right, r.value.left)
      ),
      'collecting equivalent left/right multiplicands'
    ]
  ),
  when<Multiplication, Multiplication>(
    (l, r) => isMultiplication(l) && isMultiplication(r)
      && deepEquals(l.value.right, r.value.left),
    (l, r) => [
      multiply(
        multiply(l.value.right, r.value.left),
        multiply(l.value.left, r.value.right)
      ),
      'collecting equivalent right/left multiplicands'
    ]
  ),
  when<Multiplication, Multiplication>(
    (l, r) => isMultiplication(l) && isMultiplication(r)
      && deepEquals(l.value.right, r.value.right),
    (l, r) => [
      multiply(
        multiply(l.value.left, r.value.left),
        multiply(l.value.right, r.value.right)
      ),
      'collecting equivalent right multiplicands'
    ]
  ),
  when<Multiplication, Multiplication>(
    (l, r) => isMultiplication(l) && isMultiplication(r)
      && deepEquals(l, r.value.left),
    (l, r) => [
      multiply(square(l), r.value.right), 
      'equivalent: left operand and left child of right operand'
    ]
  ),
  when<Multiplication, Multiplication>(
    (l, r) => isMultiplication(l) && isMultiplication(r)
      && deepEquals(l, r.value.right),
    (l, r) => [
      multiply(square(l), r.value.left), 
      'equivalent: left operand and right child of right operand'
    ]
  ),
  when<Multiplication, Multiplication>(
    (l, r) => isMultiplication(l) && isMultiplication(r)
      && deepEquals(l.value.left, r),
    (l, r) => [ 
      multiply(square(r), l.value.right),
      'equivalent: left child of left operand and right operand'
    ]
  ),
  when<Multiplication, Multiplication>(
    (l, r) => isMultiplication(l) && isMultiplication(r)
      && deepEquals(l.value.right, r),
    (l, r) => [
      multiply(square(r), l.value.left),
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
        multiply(l.value.left, r.value.left),
        multiply(l.value.right, r.value.right)
      ),
      'equivalent: left child of left multiplication and left child of right multiplication'
    ]
  ),
  // NOTE/TODO: these edge cases need to be split up to make better logging.
  // E.g., there are cases where the equivalency that prompts the commutativity
  // is the right child of left and left child of right, instead of what the
  // log action suggests.
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
        multiply(l.value.left, r.value.right),
        multiply(l.value.right, r.value.left),
      ),
      'equivalent: left child of left multiplication and right child of right multiplication'
    ]
  ),
  when<Exponentiation, Exponentiation>(
    (l, r) => isExponentiation(l) && isExponentiation(r) 
      && deepEquals(l.value.left, r.value.left),
    (l, r) => [
      raise(l.value.left, add(l.value.right, r.value.right)), 
      'combined like terms'
    ]
  ),
  when<Exponentiation, Multiplication>(
    (l, r) => isExponentiation(l) && isMultiplication(r)
      && deepEquals(l.value.left, r.value.left),
    (l, r) => [
      multiply(
        r.value.right, raise(l.value.left, add(l.value.right, real(1)))
      ),
      'equivalent: base of left exponentiation and left child of right'
    ]
  ),
  when<Exponentiation, Multiplication>(
    (l, r) => isExponentiation(l) && isMultiplication(r)
      && deepEquals(l.value.left, r.value.right),
    (l, r) => [
      multiply(
        r.value.left, raise(l.value.left, add(l.value.right, real(1)))
      ),
      'equivalent: base of left exponentiation and right child of right'
    ]
  ),
  when<Exponentiation, MultiplicationOfLeftExponential>(
    (l, r) => isExponentiation(l) && isMultiplication(r) 
      && isExponentiation(r.value.left) && deepEquals(l.value.left, r.value.left.value.left),
    (l, r) => [
      multiply(
        r.value.right,
        raise(l.value.left, add(l.value.right, r.value.left.value.right))
      ),
      'equivalent: base of left exponentiation and base of left child exponentiation of right multiplication'
    ]
  ),
  when<Exponentiation, MultiplicationOfRightExponential>(
    (l, r) => isExponentiation(l) && isMultiplication(r)
      && isExponentiation(r.value.right) && deepEquals(l.value.left, r.value.right.value.left),
    (l, r) => [
      multiply(
        r.value.left,
        raise(l.value.left, add(l.value.right, r.value.right.value.right))
      ),
      'equivalent: base of left exponentiation and base of right child exponentiation of right multiplication'
    ]
  ),
  when<Multiplication, Exponentiation>(
    (l, r) => isMultiplication(l) && isExponentiation(r)
      && deepEquals(l.value.left, r.value.left),
    (l, r) => [
      multiply(
        l.value.right, raise(r.value.left, add(r.value.right, real(1)))
      ),
      'equivalent: left child of left and base of right exponentiation'
    ]
  ),
  when<Multiplication, Exponentiation>(
    (l, r) => isMultiplication(l) && isExponentiation(r)
      && deepEquals(l.value.right, r.value.left),
    (l, r) => [
      multiply(
        l.value.left, raise(r.value.left, add(r.value.right, real(1)))
      ),
      'equivalent: right child of left and base of right exponentiation'
    ]
  ),
  when<MultiplicationOfLeftExponential, Exponentiation>(
    (l, r) => isMultiplication(l) && isExponentiation(l.value.left)
      && isExponentiation(r) && deepEquals(l.value.left.value.left, r.value.left),
    (l, r) => [
      multiply(
        l.value.right,
        raise(r.value.left, add(l.value.left.value.right, r.value.right))
      ),
      'equivalent: base of left child exponentiation of left multiplication and base of right exponentiation'
    ]
  ),
  when<MultiplicationOfRightExponential, Exponentiation>(
    (l, r) => isMultiplication(l) && isExponentiation(l.value.right)
      && isExponentiation(r) && deepEquals(l.value.right.value.left, r.value.left),
    (l, r) => [
      multiply(
        l.value.left,
        raise(r.value.left, add(l.value.right.value.right, r.value.right))
      ),
      'equivalent: base of right child exponentiation of left multiplication and base of right exponentiation'
    ]
  ),
  when<TreeNode, Multiplication>(
    (l, r) => isMultiplication(r) && deepEquals(l, r.value.left),
    (l, r) => [
      multiply(
        r.value.right, multiply(l, r.value.left)
      ),
      'equivalent: left operand and left child of right operand'
    ]
  ),
  when<TreeNode, Multiplication>(
    (l, r) => isMultiplication(r) && deepEquals(l, r.value.right),
    (l, r) => [
      multiply(
        r.value.left, multiply(l, r.value.right)
      ),
      'equivalent: left operand and right child of right operand'
    ]
  ),
  when<TreeNode, MultiplicationOfLeftExponential>(
    (l, r) => isMultiplication(r) && isExponentiation(r.value.left)
      && deepEquals(l, r.value.left.value.left),
    (l, r) => [
      multiply(
        r.value.right, raise(l, add(real(1), r.value.left.value.right))
      ),
      'equivalent: left operand and base of left child exponentiation of right multiplication'
    ]
  ),
  when<TreeNode, MultiplicationOfRightExponential>(
    (l, r) => isMultiplication(r) && isExponentiation(r.value.right)
      && deepEquals(l, r.value.right.value.left),
    (l, r) => [
      multiply(
        r.value.left, raise(l, add(real(1), r.value.right.value.right))
      ),
      'equivalent: left operand and base of right child exponentiation of right multiplication'
    ]
  ),
  when<Multiplication, TreeNode>(
    (l, r) => isMultiplication(l) && deepEquals(l.value.left, r),
    (l, r) => [
      multiply(
        l.value.right, multiply(r, l.value.left)
      ),
      'equivalent: left child of left operand and right operand'
    ]
  ),
  when<Multiplication, TreeNode>(
    (l, r) => isMultiplication(l) && deepEquals(l.value.right, r),
    (l, r) => [
      multiply(
        l.value.left, multiply(r, l.value.right)
      ),
      'equivalent: right child of left operand and right operand'
    ]
  ),
  when<MultiplicationOfLeftExponential, TreeNode>(
    (l, r) => isMultiplication(l) && isExponentiation(l.value.left)
      && deepEquals(l.value.left.value.left, r),
    (l, r) => [
      multiply(
        l.value.right, raise(r, add(real(1), l.value.left.value.right))
      ),
      'equivalent: base of left child exponentiation of left multiplication and right operand'
    ]
  ),
  when<MultiplicationOfRightExponential, TreeNode>(
    (l, r) => isMultiplication(l) && isExponentiation(l.value.right)
      && deepEquals(l.value.right.value.left, r),
    (l, r) => [
      multiply(
        l.value.left, raise(r, add(real(1), l.value.right.value.right))
      ),
      'equivalent: base of right child exponentiation of left multiplication and right operand'
    ]
  ),
  when<TreeNode, Exponentiation>(
    (l, r) => isExponentiation(r) && deepEquals(l, r.value.left),
    (l, r) => [
      raise(l, add(real(1), r.value.right)), 
      'combined like terms'
    ]
  ),
  when<Exponentiation, TreeNode>(
    (l, r) => isExponentiation(l) && deepEquals(l.value.left, r),
    (l, r) => [
      raise(r, add(real(1), l.value.right)), 
      'combined like terms'
    ]
  )
)

const fromMultiply = partialLeft(multiply)
export const negate = fromMultiply(real(-1))
export const double = fromMultiply(real(2))

export const divide = binaryFrom(multiply)(undefined, r => reciprocal(r))
