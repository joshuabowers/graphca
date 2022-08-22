// import { method } from '@arrows/multimethod'
// import { is } from './is'
// import { notAny, visit, leftChild, rightChild, identity, negated } from './predicates'
// import { Base } from './Expression'
// import { Real, real } from './real'
// import { Complex, complex } from './complex'
// import { Binary, binary, binaryFrom } from './binary'
// import { Multiplication, multiply, negate, double } from './multiplication'
// import { equals } from './equality'

// export class Addition extends Binary {
//   readonly $kind = 'Addition'
// }

// const isXpR_R = (l: Base, r: Base) =>
//   l instanceof Addition 
//   && (l.right instanceof Real || l.right instanceof Complex)
//   && (r instanceof Real || r instanceof Complex)

// const ApB = visit(Addition, Base)
// const BpA = visit(Base, Addition)
// const MpM = visit(Multiplication, Multiplication)
// const MpB = visit(Multiplication, Base)
// const BpM = visit(Base, Multiplication)

// export const add = binary(Addition)(
//   (l, r) => real(l.value + r.value),
//   (l, r) => complex(l.a + r.a, l.b + r.b)
// )(
//   method([real(0), is(Base)], (_l: Real, r: Base) => r),
//   method([is(Base), real(0)], (l: Base, _r: Real) => l),
//   method([is(Complex), notAny<Base>(Complex, Real)], (l: Complex, r: Base) => add(r, l)),
//   method([is(Real), notAny<Base>(Complex, Real)], (l: Real, r: Base) => add(r, l)),
//   method(equals, (l: Base, _r: Base) => double(l)),
//   method(isXpR_R, (l: Addition, r: Real) => add(l.left, add(l.right, r))),
//   ApB(leftChild, identity)((l, r) => add(double(r), l.right)),
//   ApB(rightChild, identity)((l, r) => add(double(r), l.left)),
//   BpA(identity, leftChild)((l, r) => add(double(l), r.right)),
//   BpA(identity, rightChild)((l, r) => add(double(l), r.left)),
//   MpM(rightChild, rightChild)((l, r) => multiply(add(l.left, r.left), l.right)),
//   MpM(leftChild, rightChild)((l, r) => multiply(add(l.right, r.left), l.left)),
//   MpM(rightChild, leftChild)((l, r) => multiply(add(l.left, r.right), l.right)),
//   MpM(leftChild, leftChild)((l, r) => multiply(add(l.right, r.right), l.left)),
//   MpM(rightChild, negated(rightChild))((l, r) => (is(Binary)(r.right) && multiply(subtract(l.left, r.right.left), l.right)) || real(NaN)),
//   MpM(rightChild, negated(leftChild))((l, r) => (is(Binary)(r.right) && multiply(subtract(l.left, r.right.right), l.right)) || real(NaN)),
//   MpM(leftChild, negated(rightChild))((l, r) => (is(Binary)(r.right) && multiply(subtract(l.right, r.right.left), l.left)) || real(NaN)),
//   MpM(leftChild, negated(leftChild))((l, r) => (is(Binary)(r.right) && multiply(subtract(l.right, r.right.right), l.left)) || real(NaN)),
//   MpM(negated(rightChild), leftChild)((l, r) => (is(Binary)(l.right) && multiply(subtract(r.right, l.right.left), r.left)) || real(NaN)),
//   MpM(negated(rightChild), rightChild)((l, r) => (is(Binary)(l.right) && multiply(subtract(r.left, l.right.left), r.right)) || real(NaN)),
//   MpM(negated(leftChild), leftChild)((l, r) => (is(Binary)(l.right) && multiply(subtract(r.right, l.right.right), r.left)) || real(NaN)),
//   MpM(negated(leftChild), rightChild)((l, r) => (is(Binary)(l.right) && multiply(subtract(r.left, l.right.right), r.right)) || real(NaN)),
//   MpB(leftChild, identity)((l, r) => multiply(add(real(1), l.right), r)),
//   MpB(rightChild, identity)((l, r) => multiply(add(real(1), l.left), r)),
//   BpM(identity, leftChild)((l, r) => multiply(add(real(1), r.right), l)),
//   BpM(identity, rightChild)((l, r) => multiply(add(real(1), r.left), l))
// )

// export const subtract = binaryFrom(add, (l, r) => [l, negate(r)])

import { Writer } from '../monads/writer'
import { _ } from '@arrows/multimethod'
import { 
  TreeNode, Genera, Species, isSpecies, any, notAny 
} from "../utility/tree"
import { 
  Real, real, complex, boolean, isPrimitive, PrimitiveNode 
} from "../primitives"
import { Binary, binary, when, binaryFrom } from "../closures/binary"
import { deepEquals, deepEqualsAt } from "../utility/deepEquals"

export type Addition = Binary<Species.add, Genera.arithmetic>
type AdditionWithPrimitive = Addition & {
  readonly right: Writer<PrimitiveNode>
}

export const isAddition = isSpecies<Addition>(Species.add)

export const add = binary<Addition>(Species.add, Genera.arithmetic)(
  (l, r) => [real(l.value + r.value), 'real addition'],
  (l, r) => [complex([l.a + r.a, l.b + r.b]), 'complex addition'],
  (l, r) => [
    boolean((l.value || r.value) && !(l.value && r.value)), 
    'boolean addition'
  ]
)(
  when([
    any(Species.real, Species.complex, Species.boolean), 
    notAny(Species.real, Species.complex, Species.boolean)
  ], (l, r) => [add(r, l), 're-order operands']),
  when<TreeNode, Real>([_, isValue(real(0))], (l, _r) => [l, 'additive identity']),
  when<AdditionWithPrimitive, PrimitiveNode>(
    (l, r) => isAddition(l) 
      && isPrimitive(l.value.right) 
      && isPrimitive(r), 
    (l, r) => [
      add(l.value.left, add(l.value.right, r)), 
      'combine primitives across nesting levels'
    ]),
  when(deepEquals, (l, _r) => [
    multiply(real(2), l), 'equivalence: replaced with double'
  ]),
  when<Addition, TreeNode>(deepEqualsAt(leftChild, identity), (l, _r) => [
    add(multiply(real(2), l.value.left), l.value.right),
    'combined like terms'
  ])
)

export const subtract = binaryFrom(add)(undefined, r => multiply(real(-1), r))
