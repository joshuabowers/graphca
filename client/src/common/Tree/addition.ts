import { method, fromMulti, multi, Multi, _ } from '@arrows/multimethod'
import { notAny, rewriteIf, leftChild, rightChild, identity } from './predicates'
import { Base } from './Expression'
import { Real, real } from './real'
import { Complex, complex } from './complex'
import { Binary, binary, binaryFrom } from './binary'
import { Multiplication, multiply, negate, double } from './multiplication'
import { equals } from './equality'

export class Addition extends Binary {
  readonly $kind = 'Addition'
}

const isXpR_R = (l: Base, r: Base) =>
  l instanceof Addition 
  && (l.right instanceof Real || l.right instanceof Complex)
  && (r instanceof Real || r instanceof Complex)

const rawAdd = binary(
  (l, r) => real(l.value + r.value),
  (l, r) => complex(l.a + r.a, l.b + r.b),
  (l, r) => new Addition(l, r)
)
export type AddFn = typeof rawAdd

const ApB = rewriteIf(Addition, Base)
const BpA = rewriteIf(Base, Addition)
const MpM = rewriteIf(Multiplication, Multiplication)
const MpB = rewriteIf(Multiplication, Base)
const BpM = rewriteIf(Base, Multiplication)

export const add: AddFn = fromMulti(
  method([real(0), _], (_l: Real, r: Base) => r),
  method([_, real(0)], (l: Base, _r: Real) => l),
  method([Complex, notAny<Base>(Complex, Real)], (l: Complex, r: Base) => add(r, l)),
  method([Real, notAny<Base>(Complex, Real)], (l: Real, r: Base) => add(r, l)),
  method(equals, (l: Base, _r: Base) => double(l)),
  method(isXpR_R, (l: Addition, r: Real) => add(l.left, add(l.right, r))),
  ApB(leftChild, identity)((l, r) => add(double(r), l.right)),
  ApB(rightChild, identity)((l, r) => add(double(r), l.left)),
  BpA(identity, leftChild)((l, r) => add(double(l), r.right)),
  BpA(identity, rightChild)((l, r) => add(double(l), r.left)),
  MpM(rightChild, rightChild)((l, r) => multiply(add(l.left, r.left), l.right)),
  MpM(leftChild, rightChild)((l, r) => multiply(add(l.right, r.left), l.left)),
  MpM(rightChild, leftChild)((l, r) => multiply(add(l.left, r.right), l.right)),
  MpM(leftChild, leftChild)((l, r) => multiply(add(l.right, r.right), l.left)),
  MpB(leftChild, identity)((l, r) => multiply(add(real(1), l.right), r)),
  MpB(rightChild, identity)((l, r) => multiply(add(real(1), l.left), r)),
  BpM(identity, leftChild)((l, r) => multiply(add(real(1), r.right), l)),
  BpM(identity, rightChild)((l, r) => multiply(add(real(1), r.left), l))
)(rawAdd)

export const subtract = binaryFrom(add, (l, r) => [l, negate(r)])
