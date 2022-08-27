import { _ } from '@arrows/multimethod'
import { Writer, unit } from "../../monads/writer"
import { Clades, Genera, Species, isSpecies, isGenus } from "../../utility/tree"
import { Real, Complex, Boolean, boolean } from "../../primitives"
import { BinaryNode, binary, when } from "../../closures/binary"
import { deepEquals, isValue } from "../../utility/deepEquals"
import { Connective } from './connective'
import { isComplement } from './complement'

export type Disjunction = Connective<Species.or>

export const [or, isDisjunction, $or] = binary<Disjunction, Boolean>(
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
