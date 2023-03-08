
// const MpM = visit(Multiplication, Multiplication)
// const MpB = visit(Multiplication, Base)
// const BpM = visit(Base, Multiplication)

// export const add = binary(Addition)(
// )(
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

import { Writer, unit } from '../monads/writer'
import { Operation } from '../utility/operation'
import { _ } from '@arrows/multimethod'
import { 
  TreeNode, Genera, Species, Notation, any, notAny 
} from "../utility/tree"
import { 
  Real, real, complex, boolean, isPrimitive, PrimitiveNode 
} from "../primitives"
import { 
  Binary, binary, binaryFrom, when
} from "../closures/binary"
import { deepEquals, isValue } from "../utility/deepEquals"
import { multiply, double, negate, Multiplication, isMultiplication } from './multiplication'

export type Addition = Binary<Species.add, Genera.arithmetic>
type AdditionWithPrimitive = Addition & {
  readonly right: Writer<PrimitiveNode, Operation>
}

export const [add, isAddition, $add] = binary<Addition>(
  '+', Notation.infix, Species.add, Genera.arithmetic
)(
  (l, r) => real(l.value.raw + r.value.raw),
  (l, r) => complex(l.value.raw.a + r.value.raw.a, l.value.raw.b + r.value.raw.b), 
  (l, r) => boolean((l.value.raw || r.value.raw) && !(l.value.raw && r.value.raw)), 
)(
  when(
    [
      any(Species.real, Species.complex, Species.boolean), 
      notAny(Species.real, Species.complex, Species.boolean)
    ], 
    (l, r) => [add(r, l), 'reorder operands']
  ),
  when<TreeNode, Real>([_, isValue(real(0))], (l, _r) => [l, 'additive identity']),
  when<AdditionWithPrimitive, PrimitiveNode>(
    (l, r) => isAddition(l) 
      && isPrimitive(l.value.right) 
      && isPrimitive(r), 
    (l, r) => [
      add(l.value.left, add(l.value.right, r)), 
      'additive associativity'
    ]),
  when(deepEquals, (l, _r) => [
    double(l), 'equivalence: replaced with double'
  ]),
  when<Addition, TreeNode>(
    (l, r) => isAddition(l) && deepEquals(l.value.left, r),
    (l, _r) => [add(double(l.value.left), l.value.right), 'combined like terms']
  ),
  when<Addition, TreeNode>(
    (l, r) => isAddition(l) && deepEquals(l.value.right, r),
    (l, _r) => [add(double(l.value.right), l.value.left), 'combined like terms']
  ),
  when<TreeNode, Addition>(
    (l, r) => isAddition(r) && deepEquals(l, r.value.left),
    (_l, r) => [add(double(r.value.left), r.value.right), 'combined like terms']
  ),
  when<TreeNode, Addition>(
    (l, r) => isAddition(r) && deepEquals(l, r.value.right),
    (_l, r) => [add(double(r.value.right), r.value.left), 'combined like terms']
  ),
  when<Multiplication, Multiplication>(
    (l, r) => isMultiplication(l) && isMultiplication(r)
      && isPrimitive(l.value.left) && isPrimitive(r.value.left)
      && deepEquals(l.value.right, r.value.right),
    (l, r) => [
      multiply(add(l.value.left, r.value.left), l.value.right), 
      'combined like terms'
    ]
  ),
  when<TreeNode, Multiplication>(
    (l, r) => isMultiplication(r) && isPrimitive(r.value.left) 
      && deepEquals(l, r.value.right),
    (l, r) => [multiply(add(real(1), r.value.left), l), 'combined like terms']
  ),
  when<Multiplication, TreeNode>(
    (l, r) => isMultiplication(l) && isPrimitive(l.value.left) 
      && deepEquals(l.value.right, r),
    (l, r) => [multiply(add(real(1), l.value.left), r), 'combined like terms']
  )
)

export const subtract = binaryFrom(add)(undefined, r => negate(r))
