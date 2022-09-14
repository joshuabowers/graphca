import { unit } from "../monads/writer"
import { Genera, Species } from "../utility/tree"
import { BinaryNode, binary } from "../closures/binary"
import { Boolean, boolean } from '../primitives'
import { abs } from "./absolute"

export type InequalityNode = BinaryNode & {
  readonly genus: Genera.inequalities
}

type Inequality<S extends Species> = InequalityNode & {
  readonly species: S
}

export type Equality = Inequality<Species.equals>
export type StrictInequality = Inequality<Species.notEquals>
export type LessThan = Inequality<Species.lessThan>
export type GreaterThan = Inequality<Species.greaterThan>
export type LessThanEquals = Inequality<Species.lessThanEquals>
export type GreaterThanEquals = Inequality<Species.greaterThanEquals>

export const [equals, isEquality, $equals] = binary<Equality, Boolean>(
  Species.equals, Genera.inequalities
)(
  (l, r) => [boolean(l.value === r.value), 'real equality'],
  (l, r) => [boolean(l.a === r.a && l.b === r.b), 'complex equality'],
  (l, r) => [boolean(l.value === r.value), 'boolean equality']
)()

export const [notEquals, isStrictInequality, $notEquals] = binary<StrictInequality, Boolean>(
  Species.notEquals, Genera.inequalities
)(
  (l, r) => [boolean(l.value !== r.value), 'real strict inequality'],
  (l, r) => [boolean(l.a !== r.a || l.b !== r.b), 'complex strict inequality'],
  (l, r) => [boolean(l.value !== r.value), 'boolean strict inequality']
)()

export const [lessThan, isLessThan, $lessThan] = binary<LessThan, Boolean>(
  Species.lessThan, Genera.inequalities
)(
  (l, r) => [boolean(l.value < r.value), 'real less than'],
  (l, r) => [boolean(abs(unit(l)).value.a < abs(unit(r)).value.a), 'complex less than'],
  (l, r) => [boolean(l.value < r.value), 'boolean less than']
)()

export const [greaterThan, isGreaterThan, $greaterThan] = binary<GreaterThan, Boolean>(
  Species.greaterThan, Genera.inequalities
)(
  (l, r) => [boolean(l.value > r.value), 'real greater than'],
  (l, r) => [boolean(abs(unit(l)).value.a > abs(unit(r)).value.a), 'complex greater than'],
  (l, r) => [boolean(l.value > r.value), 'boolean greater than']
)()

export const [lessThanEquals, isLessThanEquals, $lessThanEquals] = binary<LessThanEquals, Boolean>(
  Species.lessThanEquals, Genera.inequalities
)(
  (l, r) => [boolean(l.value <= r.value), 'real less than or equals'],
  (l, r) => [boolean(abs(unit(l)).value.a <= abs(unit(r)).value.a), 'complex less than or equals'],
  (l, r) => [boolean(l.value <= r.value), 'boolean less than or equals']
)()

export const [greaterThanEquals, isGreaterThanEquals, $greaterThanEquals] = binary<GreaterThanEquals, Boolean>(
  Species.greaterThanEquals, Genera.inequalities
)(
  (l, r) => [boolean(l.value >= r.value), 'real greater than or equals'],
  (l, r) => [boolean(abs(unit(l)).value.a >= abs(unit(r)).value.a), 'complex greater than or equals'],
  (l, r) => [boolean(l.value >= r.value), 'boolean greater than or equals']
)()
