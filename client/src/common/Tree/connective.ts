import { Boolean, bool } from './boolean'
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

export const and = binary(Conjunction, Boolean)(
  (l, r) => bool(l.value !== 0 && r.value !== 0),
  (l, r) => bool((l.a !== 0 || l.b !== 0) && (r.a !== 0 || r.b !== 0)),
  (l, r) => bool(l.value && r.value)
)

export const or = binary(Disjunction, Boolean)(
  (l, r) => bool(l.value !== 0 || r.value !== 0),
  (l, r) => bool(l.a !== 0 || l.b !== 0 || r.a !== 0 || r.b !== 0),
  (l, r) => bool(l.value || r.value)
)

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

// NOTE: nand/nor implemented directly rather than as connective 
// relationships due to 'not' having Boolean|Real return types.

export const nand = binary(AlternativeDenial, Boolean)(
  (l, r) => bool(!(l.value !== 0 && r.value !== 0)),
  (l, r) => bool(!((l.a !== 0 || l.b !== 0) && (r.a !== 0 || r.b !== 0))),
  (l, r) => bool(!(l.value && r.value))
)

export const nor = binary(JointDenial, Boolean)(
  (l, r) => bool(!(l.value !== 0 || r.value !== 0)),
  (l, r) => bool(!(l.a !== 0 || l.b !== 0 || r.a !== 0 || r.b !== 0)),
  (l, r) => bool(!(l.value || r.value))
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
