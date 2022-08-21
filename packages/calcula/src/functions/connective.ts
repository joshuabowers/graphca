import { Base } from './Expression'
import { Boolean, bool } from './boolean'
import { is } from './is'
import { equals } from './equality'
import { visit, identity, leftChild, rightChild, child } from './predicates'
import { method, _ } from '@arrows/multimethod'
import { Unary, unary } from './unary'
import { Binary, binary } from './binary'

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

export class LogicalComplement extends Unary {
  readonly $kind = 'LogicalComplement'
}

export const not = unary(LogicalComplement, Boolean)(
  r => bool(r.value === 0),
  c => bool(c.a === 0 && c.b === 0),
  b => bool(!b.value)
)(
  method(is(LogicalComplement), (e: LogicalComplement) => e.expression),
  method(is(Conjunction), (e: Conjunction) => nand(e.left, e.right)),
  method(is(Disjunction), (e: Disjunction) => nor(e.left, e.right)),
  method(is(AlternativeDenial), (e: AlternativeDenial) => and(e.left, e.right)),
  method(is(JointDenial), (e: JointDenial) => or(e.left, e.right)),
  method(is(ExclusiveDisjunction), (e: ExclusiveDisjunction) => xnor(e.left, e.right)),
  method(is(Implication), (e: Implication) => and(e.left, not(e.right))),
  method(is(Biconditional), (e: Biconditional) => xor(e.left, e.right)),
  method(is(ConverseImplication), (e: ConverseImplication) => and(not(e.left), e.right))
)

export const and = binary(Conjunction, Boolean)(
  (l, r) => bool(l.value !== 0 && r.value !== 0),
  (l, r) => bool((l.a !== 0 || l.b !== 0) && (r.a !== 0 || r.b !== 0)),
  (l, r) => bool(l.value && r.value)  
)(
  method([_, bool(true)], (l: Base, _r: Boolean) => l),
  method([bool(true), _], (_l: Boolean, r: Base) => r),
  method([_, bool(false)], bool(false)),
  method([bool(false), _], bool(false)),
  method(equals, (l: Base, _r: Base) => l),
  visit(Base, Disjunction)(identity, leftChild)((l, _r) => l),
  visit(Base, Disjunction)(identity, rightChild)((l, _r) => l),
  visit(Disjunction, Base)(leftChild, identity)((_l, r) => r),
  visit(Disjunction, Base)(rightChild, identity)((_l, r) => r),
  visit(Base, LogicalComplement)(identity, child)((_l, _r) => bool(false)),
  visit(LogicalComplement, Base)(child, identity)((_l, _r) => bool(false))
)

export const or = binary(Disjunction, Boolean)(
  (l, r) => bool(l.value !== 0 || r.value !== 0),
  (l, r) => bool(l.a !== 0 || l.b !== 0 || r.a !== 0 || r.b !== 0),
  (l, r) => bool(l.value || r.value)
)(
  method([_, bool(false)], (l: Base, _r: Boolean) => l),
  method([bool(false), _], (_r: Boolean, l: Base) => l),
  method([_, bool(true)], bool(true)),
  method([bool(true), _], bool(true)),
  method(equals, (l: Base, _r: Base) => l),
  visit(Base, Conjunction)(identity, leftChild)((l, _r) => l),
  visit(Base, Conjunction)(identity, rightChild)((l, _r) => l),
  visit(Conjunction, Base)(leftChild, identity)((_l, r) => r),
  visit(Conjunction, Base)(rightChild, identity)((_l, r) => r),
  visit(Base, LogicalComplement)(identity, child)((_l, _r) => bool(true)),
  visit(LogicalComplement, Base)(child, identity)((_l, _r) => bool(true)),
  method([is(LogicalComplement), _], (l: LogicalComplement, r: Base) => implies(l.expression, r)),
  method([_, is(LogicalComplement)], (l: Base, r: LogicalComplement) => converse(l, r.expression))
)

export const xor = binary(ExclusiveDisjunction, Boolean)(
  (l, r) => and(or(l, r), not(and(l, r))),
  (l, r) => and(or(l, r), not(and(l, r))),
  (l, r) => and(or(l, r), not(and(l, r)))
)(
  method([bool(false), _], (_l: Boolean, r: Base) => r),
  method([_, bool(false)], (l: Base, _r: Boolean) => l),
  method([bool(true), _], (_l: Boolean, r: Base) => not(r)),
  method([_, bool(true)], (l: Base, _r: Boolean) => not(l)),
  method(equals, (_l: Base, _r: Base) => bool(false))
)

export const implies = binary(Implication, Boolean)(
  (l, r) => or(not(l), r),
  (l, r) => or(not(l), r),
  (l, r) => or(not(l), r)
)(
  method([bool(true), _], (_l: Boolean, r: Base) => r),
  method([_, bool(true)], (_l: Base, _r: Boolean) => bool(true)),
  method([bool(false), _], (_l: Boolean, _r: Base) => bool(true)),
  method([_, bool(false)], (l: Base, _r: Boolean) => not(l))
)

export const nand = binary(AlternativeDenial, Boolean)(
  (l, r) => not(and(l, r)),
  (l, r) => not(and(l, r)),
  (l, r) => not(and(l, r))
)(
  method([_, bool(true)], (l: Base, _r: Boolean) => not(l)),
  method([bool(true), _], (_l: Boolean, r: Base) => not(r)),
  method([_, bool(false)], bool(true)),
  method([bool(false), _], bool(true)),
  method(equals, (l: Base, _r: Base) => not(l)),
  visit(Base, AlternativeDenial)(identity, leftChild)((l, r) => implies(l, r.right)),
  visit(Base, AlternativeDenial)(identity, rightChild)((l, r) => implies(l, r.left)),
  method(
    [is(LogicalComplement), is(LogicalComplement)], 
    (l: LogicalComplement, r: LogicalComplement) => or(l.expression, r.expression)
  ),
  visit(Base, LogicalComplement)(identity, child)((_l, _r) => bool(true)),
  visit(LogicalComplement, Base)(child, identity)((_l, _r) => bool(true)) 
)

export const nor = binary(JointDenial, Boolean)(
  (l, r) => not(or(l, r)),
  (l, r) => not(or(l, r)),
  (l, r) => not(or(l, r))
)(
  method([_, bool(true)], bool(false)),
  method([bool(true), _], bool(false)),
  method([_, bool(false)], (l: Base, _r: Boolean) => not(l)),
  method([bool(false), _], (_l: Boolean, r: Base) => not(r)),
  method(equals, (l: Base, _r: Base) => not(l)),
  method(
    [is(LogicalComplement), is(LogicalComplement)],
    (l: LogicalComplement, r: LogicalComplement) => and(l.expression, r.expression)
  ),
  visit(Base, LogicalComplement)(identity, child)((_l, _r) => bool(false)),
  visit(LogicalComplement, Base)(child, identity)((_l, _r) => bool(false))
)

export const xnor = binary(Biconditional, Boolean)(
  (l, r) => and(implies(l, r), implies(r, l)),
  (l, r) => and(implies(l, r), implies(r, l)),
  (l, r) => and(implies(l, r), implies(r, l))
)(
  method([bool(true), _], (_l: Boolean, r: Base) => r),
  method([_, bool(true)], (l: Base, _r: Boolean) => l),
  method([bool(false), _], (_l: Boolean, r: Base) => not(r)),
  method([_, bool(false)], (l: Base, _r: Boolean) => not(l)),
  method(equals, (_l: Base, _r: Base) => bool(true))
)

export const converse = binary(ConverseImplication, Boolean)(
  (l, r) => or(l, not(r)),
  (l, r) => or(l, not(r)),
  (l, r) => or(l, not(r))
)(
  method([bool(true), _], bool(true)),
  method([_, bool(true)], (l: Base, _r: Boolean) => l),
  method([bool(false), _], (_l: Boolean, r: Base) => not(r)),
  method([_, bool(false)], bool(true))
)
