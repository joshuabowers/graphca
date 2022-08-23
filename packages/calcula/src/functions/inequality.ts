// import { Binary, binary } from './binary'
// import { Boolean, bool } from './boolean'
// import { abs } from './absolute'

// export class Equals extends Binary {
//   readonly $kind = 'Equals'
// }

// export class NotEquals extends Binary {
//   readonly $kind = 'NotEquals'
// }

// export class LessThan extends Binary {
//   readonly $kind = 'LessThan'
// }

// export class GreaterThan extends Binary {
//   readonly $kind = 'GreaterThan'
// }

// export class LessThanEquals extends Binary {
//   readonly $kind = 'LessThanEquals'
// }

// export class GreaterThanEquals extends Binary {
//   readonly $kind = 'GreaterThanEquals'
// }

// export const equals = binary(Equals, Boolean)(
//   (l, r) => bool(l.value === r.value),
//   (l, r) => bool(l.a === r.a || l.b === r.b),
//   (l, r) => bool(l.value === r.value)
// )()

// export const notEquals = binary(NotEquals, Boolean)(
//   (l, r) => bool(l.value !== r.value),
//   (l, r) => bool(l.a !== r.a || l.b !== r.b),
//   (l, r) => bool(l.value !== r.value)
// )()

// export const lessThan = binary(LessThan, Boolean)(
//   (l, r) => bool(l.value < r.value),
//   (l, r) => bool(abs(l).a < abs(r).a)
// )()

// export const greaterThan = binary(GreaterThan, Boolean)(
//   (l, r) => bool(l.value > r.value),
//   (l, r) => bool(abs(l).a > abs(r).a)
// )()

// export const lessThanEquals = binary(LessThanEquals, Boolean)(
//   (l, r) => bool(l.value <= r.value),
//   (l, r) => bool(abs(l).a <= abs(r).a)
// )()

// export const greaterThanEquals = binary(GreaterThanEquals, Boolean)(
//   (l, r) => bool(l.value >= r.value),
//   (l, r) => bool(abs(l).a >= abs(r).a)
// )()

import { Genera, Species } from "../utility/tree"
import { BinaryNode, binary } from "../closures/binary"
import { Boolean, boolean } from '../primitives'

export type InequalityNode = BinaryNode & {
  readonly genus: Genera.inequalities
}

type Inequality<S extends Species> = InequalityNode & {
  readonly species: S
}

export type Equality = Inequality<Species.equals>

export const [equals, isEquality] = binary<Equality, Boolean>(
  Species.equals, Genera.inequalities
)(
  (l, r) => [boolean(l.value === r.value), 'real equality'],
  (l, r) => [boolean(l.a === r.a && l.b === r.b), 'complex equality'],
  (l, r) => [boolean(l.value === r.value), 'boolean equality']
)(
  // when<Unary, Unary>(
  //   [isUnary, isUnary], 
  //   (l, r) => [
  //     equals(l.value.expression, r.value.expression), 
  //     'unary equality'
  //   ]
  // )
)
