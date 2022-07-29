import { Base } from './Expression'
import { Boolean, bool } from './boolean'
import { equals } from './equality'
import { visit, identity, leftChild, rightChild } from './predicates'
import { fromMulti, method, _ } from '@arrows/multimethod'
import { Binary, binary } from './binary'
import { not } from './logicalComplement'

export abstract class Connective extends Binary {}

export class Conjunction extends Connective {
  readonly $kind = 'Conjunction'
}

export class Disjunction extends Connective {
  readonly $kind = 'Disjunction'
}

export class ExclusiveDisjunction extends Connective {
  readonly $kind = 'ExclusiveDisjunction'
}

export class Implication extends Connective {
  readonly $kind = 'Implication'
}

export class AlternativeDenial extends Connective {
  readonly $kind = 'AlternativeDenial'
}

export class JointDenial extends Connective {
  readonly $kind = 'JointDenial'
}

export class Biconditional extends Connective {
  readonly $kind = 'Biconditional'
}

export class ConverseImplication extends Connective {
  readonly $kind = 'ConverseImplication'
}

const rawAnd = binary(Conjunction, Boolean)(
  (l, r) => bool(l.value !== 0 && r.value !== 0),
  (l, r) => bool((l.a !== 0 || l.b !== 0) && (r.a !== 0 || r.b !== 0)),
  (l, r) => bool(l.value && r.value)
)

export type AndFn = typeof rawAnd

export const and: AndFn = fromMulti(
  method([_, bool(true)], (l: Base, _r: Boolean) => l),
  method([bool(true), _], (_l: Boolean, r: Base) => r),
  method([_, bool(false)], bool(false)),
  method([bool(false), _], bool(false)),
  method(equals, (l: Base, _r: Base) => l),
  visit(Base, Disjunction)(identity, leftChild)((l, _r) => l),
  visit(Base, Disjunction)(identity, rightChild)((l, _r) => l),
  visit(Disjunction, Base)(leftChild, identity)((_l, r) => r),
  visit(Disjunction, Base)(rightChild, identity)((_l, r) => r)
)(rawAnd)

const rawOr = binary(Disjunction, Boolean)(
  (l, r) => bool(l.value !== 0 || r.value !== 0),
  (l, r) => bool(l.a !== 0 || l.b !== 0 || r.a !== 0 || r.b !== 0),
  (l, r) => bool(l.value || r.value)
)

export type OrFn = typeof rawOr

export const or: OrFn = fromMulti(
  method([_, bool(false)], (l: Base, _r: Boolean) => l),
  method([bool(false), _], (_r: Boolean, l: Base) => l),
  method([_, bool(true)], bool(true)),
  method([bool(true), _], bool(true)),
  method(equals, (l: Base, _r: Base) => l),
  visit(Base, Conjunction)(identity, leftChild)((l, _r) => l),
  visit(Base, Conjunction)(identity, rightChild)((l, _r) => l),
  visit(Conjunction, Base)(leftChild, identity)((_l, r) => r),
  visit(Conjunction, Base)(rightChild, identity)((_l, r) => r)
)(rawOr)

export const xor = binary(ExclusiveDisjunction, Boolean)(
  (l, r) => and(or(l, r), not(and(l, r))),
  (l, r) => and(or(l, r), not(and(l, r))),
  (l, r) => and(or(l, r), not(and(l, r)))
)

export const implies = binary(Implication, Boolean)(
  (l, r) => or(not(l), r),
  (l, r) => or(not(l), r),
  (l, r) => or(not(l), r)
)

export const nand = binary(AlternativeDenial, Boolean)(
  (l, r) => not(and(l, r)),
  (l, r) => not(and(l, r)),
  (l, r) => not(and(l, r))
)

export const nor = binary(JointDenial, Boolean)(
  (l, r) => not(or(l, r)),
  (l, r) => not(or(l, r)),
  (l, r) => not(or(l, r))
)

export const xnor = binary(Biconditional, Boolean)(
  (l, r) => and(implies(l, r), implies(r, l)),
  (l, r) => and(implies(l, r), implies(r, l)),
  (l, r) => and(implies(l, r), implies(r, l))
)

export const converse = binary(ConverseImplication, Boolean)(
  (l, r) => or(l, not(r)),
  (l, r) => or(l, not(r)),
  (l, r) => or(l, not(r))
)
