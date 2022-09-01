// import { method, multi, Multi } from '@arrows/multimethod';
// import { is } from './is';
// import { Base } from "./Expression";
// import { Real, real } from "./real";
// import { Complex, complex } from './complex';
// import { Binary, binary, unaryFrom, binaryFrom, bindLeft } from './binary';
// import { equals } from './equality';
// import { any, not, notAny, Which, leftChild, rightChild, identity } from './predicates';
// import { add } from './addition';
// import { Exponentiation, raise, reciprocal, square } from "./exponentiation";

// export class Multiplication extends Binary {
//   readonly $kind = 'Multiplication'
// }

// const isCasR = (v: Base) => v instanceof Complex && v.b === 0
// const isPureI = (v: Base) => v instanceof Complex && v.a === 0
  
// // N => Real | Complex, Nn => N[n]
// const isN1_N2A = (l: Base, r: Base) =>
//   any<Base>(Real, Complex)(l) && r instanceof Multiplication && any<Base>(Real, Complex)(r.left)

// export const equivalent = (a: Which<Multiplication>, b: Which<Multiplication>) =>
//   (left: Multiplication, right: Multiplication) => canFormExponential(a(left), b(right))

// type Transform = (left: Multiplication, right: Multiplication) => Base
// const flip: Transform = (l, r) => collectFromProducts(r, l)

// const ifEquivalent = (a: Which<Multiplication>, b: Which<Multiplication>) =>
//   (fn: Transform) =>
//     method(equivalent(a, b), fn)

// type CollectFromProductsFn = Multi & Transform

// export const collectFromProducts: CollectFromProductsFn = multi(
//   ifEquivalent(leftChild, leftChild)((l, r) => 
//     multiply(
//       multiply(l.left, r.left),
//       multiply(l.right, r.right)
//     )
//   ),
//   ifEquivalent(leftChild, rightChild)((l, r) => 
//     multiply(
//       multiply(l.left, r.right),
//       multiply(l.right, r.left)
//     )
//   ),
//   ifEquivalent(rightChild, leftChild)((l, r) =>
//     multiply(
//       multiply(l.right, r.left),
//       multiply(l.left, r.right)
//     )
//   ),
//   ifEquivalent(rightChild, rightChild)((l, r) => 
//     multiply(
//       multiply(l.left, r.left),
//       multiply(l.right, r.right)
//     )
//   ),
//   ifEquivalent(identity, leftChild)((l, r) => 
//     multiply(square(l), r.right)
//   ),
//   ifEquivalent(identity, rightChild)((l, r) =>
//     multiply(square(l), r.left)
//   ),
//   ifEquivalent(leftChild, identity)(flip),
//   ifEquivalent(rightChild, identity)(flip),
//   ifEquivalent(identity, identity)((l, _r) => square(l))
// )

// export type CanFormExponentialFn = Multi
//   & ((left: Multiplication, right: Multiplication) => boolean)
//   & ((left: Base, right: Multiplication) => boolean)
//   & ((left: Multiplication, right: Base) => boolean)
//   & ((left: Base, right: Exponentiation) => boolean)
//   & ((left: Exponentiation, right: Base) => boolean)
//   & ((left: Exponentiation, right: Multiplication) => boolean)
//   & ((left: Multiplication, right: Exponentiation) => boolean)
//   & ((left: Exponentiation, right: Exponentiation) => boolean)
//   & ((left: Base, right: Base) => boolean)

// export const canFormExponential: CanFormExponentialFn = multi(
//   method(
//     [is(Multiplication), is(Multiplication)], (l: Multiplication, r: Multiplication) =>
//       equals(l, r)
//       || canFormExponential(l.left, r.left)
//       || canFormExponential(l.left, r.right)
//       || canFormExponential(l.right, r.left)
//       || canFormExponential(l.right, r.right)
//       || canFormExponential(l.left, r)
//       || canFormExponential(l.right, r)
//       || canFormExponential(l, r.left)
//       || canFormExponential(l, r.right)
//   ),
//   method(
//     [is(Exponentiation), is(Multiplication)], (l: Exponentiation, r: Multiplication) =>
//       canFormExponential(l, r.left) 
//       || canFormExponential(l, r.right)
//       || canFormExponential(l.left, r.left) 
//       || canFormExponential(l.left, r.right)
//   ),
//   method(
//     [is(Base), is(Multiplication)], (l: Base, r: Multiplication) => 
//       canFormExponential(l, r.left) || canFormExponential(l, r.right)
//   ),
//   method([is(Multiplication), is(Base)], (l: Base, r: Base) => canFormExponential(r, l)),
//   method([is(Exponentiation), is(Exponentiation)], (l: Exponentiation, r: Exponentiation) => equals(l.left, r.left)),
//   method(
//     [is(Base), is(Exponentiation)], (l: Base, r: Exponentiation) => 
//       canFormExponential(l, r.left)
//   ),
//   method([is(Exponentiation), is(Base)], (l: Base, r: Base) => canFormExponential(r, l)),
//   method([is(Multiplication), is(Exponentiation)], (l: Base, r: Base) => canFormExponential(r, l)),
//   method(equals)
// )

// export type ExponentialCollectFn = Multi
//   & ((left: Multiplication, right: Multiplication) => Base)
//   & ((left: Base, right: Multiplication) => Base)
//   & ((left: Multiplication, right: Base) => Base)
//   & ((left: Base, right: Exponentiation) => Base)
//   & ((left: Exponentiation, right: Base) => Base)
//   & ((left: Exponentiation, right: Exponentiation) => Base)
//   & ((left: Base, right: Base) => Base)

// export const exponentialCollect: ExponentialCollectFn = multi(
//   method([is(Multiplication), is(Multiplication)], collectFromProducts),
//   method(
//     [is(Exponentiation), is(Exponentiation)], (l: Exponentiation, r: Exponentiation) => 
//       raise(l.left, add(l.right, r.right))
//   ),
//   method(
//     [is(Base), is(Multiplication)], 
//     (l: Base, r: Multiplication, isLeft = canFormExponential(l, r.left)) =>
//       multiply(
//         isLeft ? r.right : r.left, 
//         exponentialCollect(l, isLeft ? r.left : r.right)
//       )
//   ),
//   method([is(Multiplication), is(Base)], (l: Base, r: Base) => exponentialCollect(r, l)),
//   method([is(Base), is(Exponentiation)], (l: Base, r: Exponentiation) => raise(l, add(r.right, real(1)))),
//   method([is(Exponentiation), is(Base)], (l: Base, r: Base) => exponentialCollect(r, l)),
//   method([is(Base), is(Base)], (l: Base, _r: Base) => square(l))
// )

// export const multiply = binary(Multiplication)(
//   (l, r) => real(l.value * r.value),
//   (l, r) => complex(
//     (l.a * r.a) - (l.b * r.b),
//     (l.a * r.b) + (l.b * r.a)
//   )
// )(
//   method([not(Real), is(Real)], (l: Base, r: Real) => multiply(r, l)),
//   method([notAny<Base>(Real, Complex), is(Complex)], (l: Base, r: Complex) => multiply(r, l)),
//   method([isCasR, isCasR], (l: Complex, r: Complex) => complex(l.a * r.a, 0)),
//   method([isCasR, isPureI], (l: Complex, r: Complex) => complex(0, l.a * r.b)),
//   method([isPureI, isCasR], (l: Complex, r: Complex) => complex(0, l.b * r.a)),
//   method([is(Complex), isCasR], (l: Complex, r: Complex) => complex(l.a * r.a, 0)),
//   method([real(0), real(Infinity)], real(NaN)),
//   method([real(Infinity), real(0)], real(NaN)),
//   method([real(0), is(Base)], real(0)),
//   method([real(1), is(Base)], (_l: Base, r: Base) => r),
//   method([real(Infinity), is(Base)], real(Infinity)),
//   method([real(-Infinity), is(Base)], real(-Infinity)),
//   method(isN1_N2A, (l: Base, r: Multiplication) => multiply(multiply(l, r.left), r.right)),
//   method(canFormExponential, exponentialCollect)
// )

import { _ } from '@arrows/multimethod'
import { Writer, unit } from '../monads/writer'
import { TreeNode, Clades, Genera, Species } from '../utility/tree'
import { Complex, real, complex, boolean, nan, isReal, isPrimitive, isComplex } from '../primitives'
import { Binary, binary, partialLeft, binaryFrom, when } from '../closures/binary'
import { add } from './addition'
import { 
  Exponentiation, isExponentiation, raise, reciprocal, square 
} from './exponentiation'
import { deepEquals, isValue } from '../utility/deepEquals'

export type Multiplication = Binary<Species.multiply, Genera.arithmetic>

const isComplexWrapped = (v: Writer<TreeNode>): v is Writer<Complex> => 
  isComplex(v) && v.value.b === 0
const isImaginary = (v: Writer<TreeNode>): v is Writer<Complex> => 
  isComplex(v) && v.value.a === 0

export const [multiply, isMultiplication, $multiply] = binary<Multiplication>(
  Species.multiply, Genera.arithmetic
)(
  (l, r) => [real(l.value * r.value), 'real multiplication'],
  (l, r) => [
    complex([
      (l.a * r.a) - (l.b * r.b),
      (l.a * r.b) + (l.b * r.a)
    ]), 
    'complex multiplication'
  ],
  (l, r) => [boolean(l.value && r.value), 'boolean multiplication']
)(
  when(
    [l => l.value.clade !== Clades.primitive, isPrimitive],
    (l, r) => [multiply(unit(r), unit(l)), 'reorder operands']
  ),
  when<Complex, Complex>(
    [isComplexWrapped, isComplexWrapped], 
    (l, r) => [complex([l.a * r.a, 0]), 'complex multiplication']
  ),
  when<Complex, Complex>(
    [isComplexWrapped, isImaginary],
    (l, r) => [complex([0, l.a * r.b]), 'complex multiplication']
  ),
  when<Complex, Complex>(
    [isImaginary, isComplexWrapped],
    (l, r) => [complex([0, l.b * r.a]), 'complex multiplication']
  ),
  when<Complex, Complex>(
    [isComplex, isComplexWrapped],
    (l, r) => [complex([l.a * r.a, 0]), 'complex multiplication']
  ),
  when([isValue(real(0)), isValue(real(Infinity))], [nan, 'incalculable']),
  when([isValue(real(Infinity)), isValue(real(0))], [nan, 'incalculable']),
  when([isValue(real(0)), _], [real(0), 'zero absorption']),
  when([isValue(complex([0, 0])), _], [complex([0, 0]), 'zero absorption']),
  when([isValue(real(1)), _], (_l, r) => [r, 'multiplicative identity']),
  when([isValue(complex([1, 0])), _], (_l, r) => [r, 'multiplicative identity']),
  when([isValue(real(Infinity)), _], [real(Infinity), 'infinite absorption']),
  when([isValue(real(-Infinity)), _], [real(-Infinity), 'infinite absorption']),
  when<TreeNode, Multiplication>(
    (l, r) => isPrimitive(l) && isMultiplication(r) && isPrimitive(r.value.left),
    (l, r) => [multiply(multiply(unit(l), r.left), r.right),'primitive coalescence']
  ),
  when(deepEquals, (l, _r) => [square(unit(l)), 'equivalence: replaced with square']),
  when<Multiplication, Multiplication>(
    (l, r) => isMultiplication(l) && isMultiplication(r)
      && deepEquals(l.value.left, r.value.left),
    (l, r) => [
      multiply(
        multiply(l.left, r.left),
        multiply(l.right, r.right)
      ),
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
      'collecting equivalent right multiplicands'
    ]
  ),
  when<Multiplication, Multiplication>(
    (l, r) => isMultiplication(l) && isMultiplication(r)
      && deepEquals(l, r.value.left),
    (l, r) => [
      multiply(square(unit(l)), r.right), 
      'equivalent: left operand and left child of right operand'
    ]
  ),
  when<Multiplication, Multiplication>(
    (l, r) => isMultiplication(l) && isMultiplication(r)
      && deepEquals(l, r.value.right),
    (l, r) => [
      multiply(square(unit(l)), r.left), 
      'equivalent: left operand and right child of right operand'
    ]
  ),
  when<Multiplication, Multiplication>(
    (l, r) => isMultiplication(l) && isMultiplication(r)
      && deepEquals(l.value.left, r),
    (l, r) => [
      multiply(square(unit(r)), l.right),
      'equivalent: left child of left operand and right operand'
    ]
  ),
  when<Multiplication, Multiplication>(
    (l, r) => isMultiplication(l) && isMultiplication(r)
      && deepEquals(l.value.right, r),
    (l, r) => [
      multiply(square(unit(r)), l.left),
      'equivalent: right child of left operand and right operand'
    ]
  ),
  when<Exponentiation, Exponentiation>(
    (l, r) => isExponentiation(l) && isExponentiation(r) 
      && deepEquals(l.value.left, r.value.left),
    (l, r) => [raise(l.left, add(l.right, r.right)), 'combined like terms']
  ),
  when<Exponentiation, Multiplication>(
    (l, r) => isExponentiation(l) && isMultiplication(r)
      && deepEquals(l.value.left, r.value.left),
    (l, r) => [
      multiply(
        raise(l.left, add(l.right, real(1))), r.right
      ),
      'equivalent: base of left exponentiation and left child of right'
    ]
  ),
  when<Exponentiation, Multiplication>(
    (l, r) => isExponentiation(l) && isMultiplication(r)
      && deepEquals(l.value.left, r.value.right),
    (l, r) => [
      multiply(
        raise(l.left, add(l.right, real(1))), r.left
      ),
      'equivalent: base of left exponentiation and right child of right'
    ]
  ),
  when<Multiplication, Exponentiation>(
    (l, r) => isMultiplication(l) && isExponentiation(r)
      && deepEquals(l.value.left, r.value.left),
    (l, r) => [
      multiply(
        raise(r.left, add(r.right, real(1))), l.right
      ),
      'equivalent: left child of left and base of right exponentiation'
    ]
  ),
  when<Multiplication, Exponentiation>(
    (l, r) => isMultiplication(l) && isExponentiation(r)
      && deepEquals(l.value.right, r.value.left),
    (l, r) => [
      multiply(
        raise(r.left, add(r.right, real(1))), l.left
      ),
      'equivalent: right child of left and base of right exponentiation'
    ]
  ),
  when<TreeNode, Multiplication>(
    (l, r) => isMultiplication(r) && deepEquals(l, r.value.left),
    (l, r) => [
      multiply(
        r.right, multiply(unit(l), r.left)
      ),
      'equivalent: left operand and left child of right operand'
    ]
  ),
  when<TreeNode, Multiplication>(
    (l, r) => isMultiplication(r) && deepEquals(l, r.value.right),
    (l, r) => [
      multiply(
        r.left, multiply(unit(l), r.right)
      ),
      'equivalent: left operand and right child of right operand'
    ]
  ),
  when<Multiplication, TreeNode>(
    (l, r) => isMultiplication(l) && deepEquals(l.value.left, r),
    (l, r) => [
      multiply(
        l.right, multiply(unit(r), l.left)
      ),
      'equivalent: left child of left operand and right operand'
    ]
  ),
  when<Multiplication, TreeNode>(
    (l, r) => isMultiplication(l) && deepEquals(l.value.right, r),
    (l, r) => [
      multiply(
        l.left, multiply(unit(r), l.right)
      ),
      'equivalent: right child of left operand and right operand'
    ]
  ),
  when<TreeNode, Exponentiation>(
    (l, r) => isExponentiation(r) && deepEquals(l, r.value.left),
    (l, r) => [raise(unit(l), add(real(1), r.right)), 'combined like terms']
  ),
  when<Exponentiation, TreeNode>(
    (l, r) => isExponentiation(l) && deepEquals(l.value.left, r),
    (l, r) => [raise(unit(r), add(real(1), l.right)), 'combined like terms']
  )
)

const fromMultiply = partialLeft(multiply)
export const negate = fromMultiply(real(-1))
export const double = fromMultiply(real(2))

export const divide = binaryFrom(multiply)(undefined, r => reciprocal(r))
