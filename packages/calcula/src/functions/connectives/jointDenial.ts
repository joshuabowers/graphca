import { _ } from '@arrows/multimethod'
import { Writer, unit } from "../../monads/writer"
import { Clades, Genera, Species, isSpecies, isGenus } from "../../utility/tree"
import { Real, Complex, Boolean, boolean } from "../../primitives"
import { BinaryNode, binary, when } from "../../closures/binary"
import { deepEquals, isValue } from "../../utility/deepEquals"
import { Connective } from './connective'
import { not } from './complement'
import { or } from './disjunction'

export type JointDenial = Connective<Species.nor>

export const [nor, isJointDenial, $nor] = binary<JointDenial, Boolean>(
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
