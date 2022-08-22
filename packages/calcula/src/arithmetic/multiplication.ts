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

// const fromMultiply = unaryFrom(multiply, bindLeft)
// export const negate = fromMultiply(real(-1))
// export const double = fromMultiply(real(2))

// export const divide = binaryFrom(multiply, (l, r) => [l, reciprocal(r)])
import { Genera, Species } from '../utility/tree'
import { real, complex, boolean } from '../primitives'
import { Binary, binary, partialLeft } from '../closures/binary'

export type Multiplication = Binary<Species.multiply, Genera.arithmetic>

export const [multiply, isMultiplication] = binary<Multiplication>(
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
)()

export const negate = partialLeft(multiply)(real(-1))
export const double = partialLeft(multiply)(real(2))
