import { Genera, Species, Notation } from "../utility/tree"
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
  '==', Notation.infix, Species.equals, Genera.inequalities
)(
  (l, r) => boolean(l.value.raw === r.value.raw),
  (l, r) => boolean(l.value.raw.a === r.value.raw.a && l.value.raw.b === r.value.raw.b),
  (l, r) => boolean(l.value.raw === r.value.raw)
)()

export const [notEquals, isStrictInequality, $notEquals] = binary<StrictInequality, Boolean>(
  '!=', Notation.infix, Species.notEquals, Genera.inequalities
)(
  (l, r) => boolean(l.value.raw !== r.value.raw),
  (l, r) => boolean(l.value.raw.a !== r.value.raw.a || l.value.raw.b !== r.value.raw.b), 
  (l, r) => boolean(l.value.raw !== r.value.raw)
)()

export const [lessThan, isLessThan, $lessThan] = binary<LessThan, Boolean>(
  '<', Notation.infix, Species.lessThan, Genera.inequalities
)(
  (l, r) => boolean(l.value.raw < r.value.raw),
  (l, r) => boolean(abs(l).value.raw.a < abs(r).value.raw.a),
  (l, r) => boolean(l.value.raw < r.value.raw)
)()

export const [greaterThan, isGreaterThan, $greaterThan] = binary<GreaterThan, Boolean>(
  '>', Notation.infix, Species.greaterThan, Genera.inequalities
)(
  (l, r) => boolean(l.value.raw > r.value.raw),
  (l, r) => boolean(abs(l).value.raw.a > abs(r).value.raw.a),
  (l, r) => boolean(l.value.raw > r.value.raw)
)()

export const [lessThanEquals, isLessThanEquals, $lessThanEquals] = binary<LessThanEquals, Boolean>(
  '<=', Notation.infix, Species.lessThanEquals, Genera.inequalities
)(
  (l, r) => boolean(l.value.raw <= r.value.raw),
  (l, r) => boolean(abs(l).value.raw.a <= abs(r).value.raw.a),
  (l, r) => boolean(l.value.raw <= r.value.raw)
)()

export const [greaterThanEquals, isGreaterThanEquals, $greaterThanEquals] = binary<GreaterThanEquals, Boolean>(
  '>=', Notation.infix, Species.greaterThanEquals, Genera.inequalities
)(
  (l, r) => boolean(l.value.raw >= r.value.raw),
  (l, r) => boolean(abs(l).value.raw.a >= abs(r).value.raw.a),
  (l, r) => boolean(l.value.raw >= r.value.raw)
)()
