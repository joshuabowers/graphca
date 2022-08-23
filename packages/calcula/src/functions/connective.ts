
import { Writer, unit } from "../monads/writer"
import { Clades, Genera, Species } from "../utility/tree"
import { Real, Complex, Boolean, boolean } from "../primitives"
import { Unary, unary } from "../closures/unary"
import { BinaryNode, binary, when } from "../closures/binary"

export type ConnectiveNode = BinaryNode & {
  readonly genus: Genera.connective
}

type Connective<S extends Species> = ConnectiveNode & {
  readonly species: S
}

export type LogicalComplement = Unary<Species.not, Genera.connective>
export type Conjunction = Connective<Species.and>
export type Disjunction = Connective<Species.or>
export type ExclusiveDisjunction = Connective<Species.xor>
export type Implication = Connective<Species.implies>
export type AlternativeDenial = Connective<Species.nand>
export type JointDenial = Connective<Species.nor>
export type Biconditional = Connective<Species.xnor>
export type ConverseImplication = Connective<Species.converse>

export const [not, isLogicalCompliment] = unary<LogicalComplement, Boolean>(
  Species.nor, Genera.connective
)(
  r => [boolean(r.value === 0), 'real complement'],
  c => [boolean(c.a === 0 && c.b === 0), 'complex complement'],
  b => [boolean(!b.value), 'boolean complement']
)(
  // method(is(LogicalComplement), (e: LogicalComplement) => e.expression),
  // method(is(Conjunction), (e: Conjunction) => nand(e.left, e.right)),
  // method(is(Disjunction), (e: Disjunction) => nor(e.left, e.right)),
  // method(is(AlternativeDenial), (e: AlternativeDenial) => and(e.left, e.right)),
  // method(is(JointDenial), (e: JointDenial) => or(e.left, e.right)),
  // method(is(ExclusiveDisjunction), (e: ExclusiveDisjunction) => xnor(e.left, e.right)),
  // method(is(Implication), (e: Implication) => and(e.left, not(e.right))),
  // method(is(Biconditional), (e: Biconditional) => xor(e.left, e.right)),
  // method(is(ConverseImplication), (e: ConverseImplication) => and(not(e.left), e.right))
)

export const [and, isConjunction] = binary<Conjunction, Boolean>(
  Species.and, Genera.connective
)(
  (l, r) => [boolean(l.value !== 0 && r.value !== 0), 'real conjunction'],
  (l, r) => [
    boolean((l.a !== 0 || l.b !== 0) && (r.a !== 0 || r.b !== 0)), 
    'complex conjunction'
  ],
  (l, r) => [boolean(l.value && r.value), 'boolean conjunction']
)(
  // method([_, bool(true)], (l: Base, _r: Boolean) => l),
  // method([bool(true), _], (_l: Boolean, r: Base) => r),
  // method([_, bool(false)], bool(false)),
  // method([bool(false), _], bool(false)),
  // method(equals, (l: Base, _r: Base) => l),
  // visit(Base, Disjunction)(identity, leftChild)((l, _r) => l),
  // visit(Base, Disjunction)(identity, rightChild)((l, _r) => l),
  // visit(Disjunction, Base)(leftChild, identity)((_l, r) => r),
  // visit(Disjunction, Base)(rightChild, identity)((_l, r) => r),
  // visit(Base, LogicalComplement)(identity, child)((_l, _r) => bool(false)),
  // visit(LogicalComplement, Base)(child, identity)((_l, _r) => bool(false))
)

export const [or, isDisjunction] = binary<Disjunction, Boolean>(
  Species.or, Genera.connective
)(
  (l, r) => [boolean(l.value !== 0 || r.value !== 0), 'real disjunction'],
  (l, r) => [
    boolean(l.a !== 0 || l.b !== 0 || r.a !== 0 || r.b !== 0),
    'complex disjunction'
  ],
  (l, r) => [boolean(l.value || r.value), 'boolean disjunction']
)(
  // method([_, bool(false)], (l: Base, _r: Boolean) => l),
  // method([bool(false), _], (_r: Boolean, l: Base) => l),
  // method([_, bool(true)], bool(true)),
  // method([bool(true), _], bool(true)),
  // method(equals, (l: Base, _r: Base) => l),
  // visit(Base, Conjunction)(identity, leftChild)((l, _r) => l),
  // visit(Base, Conjunction)(identity, rightChild)((l, _r) => l),
  // visit(Conjunction, Base)(leftChild, identity)((_l, r) => r),
  // visit(Conjunction, Base)(rightChild, identity)((_l, r) => r),
  // visit(Base, LogicalComplement)(identity, child)((_l, _r) => bool(true)),
  // visit(LogicalComplement, Base)(child, identity)((_l, _r) => bool(true)),
  // method([is(LogicalComplement), _], (l: LogicalComplement, r: Base) => implies(l.expression, r)),
  // method([_, is(LogicalComplement)], (l: Base, r: LogicalComplement) => converse(l, r.expression))
)

export const [xor, isExclusiveDisjunction] = binary<ExclusiveDisjunction, Boolean>(
  Species.xor, Genera.connective
)(
  (l, r) => [and(or(unit(l), unit(r)), not(and(unit(l), unit(r)))), 'real exclusive disjunction'],
  (l, r) => [and(or(unit(l), unit(r)), not(and(unit(l), unit(r)))), 'complex exclusive disjunction'],
  (l, r) => [and(or(unit(l), unit(r)), not(and(unit(l), unit(r)))), 'boolean exclusive disjunction']
)(
  // method([bool(false), _], (_l: Boolean, r: Base) => r),
  // method([_, bool(false)], (l: Base, _r: Boolean) => l),
  // method([bool(true), _], (_l: Boolean, r: Base) => not(r)),
  // method([_, bool(true)], (l: Base, _r: Boolean) => not(l)),
  // method(equals, (_l: Base, _r: Base) => bool(false))
)

export const [implies, isImplication] = binary<Implication, Boolean>(
  Species.implies, Genera.connective
)(
  (l, r) => [or(not(unit(l)), unit(r)), 'real implication'],
  (l, r) => [or(not(unit(l)), unit(r)), 'complex implication'],
  (l, r) => [or(not(unit(l)), unit(r)), 'boolean implication']
)(
  // method([bool(true), _], (_l: Boolean, r: Base) => r),
  // method([_, bool(true)], (_l: Base, _r: Boolean) => bool(true)),
  // method([bool(false), _], (_l: Boolean, _r: Base) => bool(true)),
  // method([_, bool(false)], (l: Base, _r: Boolean) => not(l))
)

export const [nand, isAlternativeDenial] = binary<AlternativeDenial, Boolean>(
  Species.nand, Genera.connective
)(
  (l, r) => [not(and(unit(l), unit(r))), 'real alternative denial'],
  (l, r) => [not(and(unit(l), unit(r))), 'complex alternative denial'],
  (l, r) => [not(and(unit(l), unit(r))), 'boolean alternative denial']
)(
  // method([_, bool(true)], (l: Base, _r: Boolean) => not(l)),
  // method([bool(true), _], (_l: Boolean, r: Base) => not(r)),
  // method([_, bool(false)], bool(true)),
  // method([bool(false), _], bool(true)),
  // method(equals, (l: Base, _r: Base) => not(l)),
  // visit(Base, AlternativeDenial)(identity, leftChild)((l, r) => implies(l, r.right)),
  // visit(Base, AlternativeDenial)(identity, rightChild)((l, r) => implies(l, r.left)),
  // method(
  //   [is(LogicalComplement), is(LogicalComplement)], 
  //   (l: LogicalComplement, r: LogicalComplement) => or(l.expression, r.expression)
  // ),
  // visit(Base, LogicalComplement)(identity, child)((_l, _r) => bool(true)),
  // visit(LogicalComplement, Base)(child, identity)((_l, _r) => bool(true)) 
)

export const [nor, isJointDenial] = binary<JointDenial, Boolean>(
  Species.nor, Genera.connective
)(
  (l, r) => [not(or(unit(l), unit(r))), 'real joint denial'],
  (l, r) => [not(or(unit(l), unit(r))), 'complex joint denial'],
  (l, r) => [not(or(unit(l), unit(r))), 'boolean joint denial']
)(
  // method([_, bool(true)], bool(false)),
  // method([bool(true), _], bool(false)),
  // method([_, bool(false)], (l: Base, _r: Boolean) => not(l)),
  // method([bool(false), _], (_l: Boolean, r: Base) => not(r)),
  // method(equals, (l: Base, _r: Base) => not(l)),
  // method(
  //   [is(LogicalComplement), is(LogicalComplement)],
  //   (l: LogicalComplement, r: LogicalComplement) => and(l.expression, r.expression)
  // ),
  // visit(Base, LogicalComplement)(identity, child)((_l, _r) => bool(false)),
  // visit(LogicalComplement, Base)(child, identity)((_l, _r) => bool(false))
)

export const [xnor, isBiconditional] = binary<Biconditional, Boolean>(
  Species.xnor, Genera.connective
)(
  (l, r) => [and(implies(unit(l), unit(r)), implies(unit(r), unit(l))), 'real biconditional'],
  (l, r) => [and(implies(unit(l), unit(r)), implies(unit(r), unit(l))), 'complex biconditional'],
  (l, r) => [and(implies(unit(l), unit(r)), implies(unit(r), unit(l))), 'boolean biconditional']
)(
  // method([bool(true), _], (_l: Boolean, r: Base) => r),
  // method([_, bool(true)], (l: Base, _r: Boolean) => l),
  // method([bool(false), _], (_l: Boolean, r: Base) => not(r)),
  // method([_, bool(false)], (l: Base, _r: Boolean) => not(l)),
  // method(equals, (_l: Base, _r: Base) => bool(true))
)

export const [converse, isConverseImplication] = binary<ConverseImplication, Boolean>(
  Species.converse, Genera.connective
)(
  (l, r) => [or(unit(l), not(unit(r))), 'real converse implication'],
  (l, r) => [or(unit(l), not(unit(r))), 'complex converse implication'],
  (l, r) => [or(unit(l), not(unit(r))), 'boolean converse implication']
)(
  // method([bool(true), _], bool(true)),
  // method([_, bool(true)], (l: Base, _r: Boolean) => l),
  // method([bool(false), _], (_l: Boolean, r: Base) => not(r)),
  // method([_, bool(false)], bool(true))
)
