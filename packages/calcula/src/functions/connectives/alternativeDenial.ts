import { _ } from '@arrows/multimethod'
import { Writer, unit } from "../../monads/writer"
import { Clades, Genera, Species, isSpecies, isGenus } from "../../utility/tree"
import { Real, Complex, Boolean, boolean } from "../../primitives"
import { BinaryNode, binary, when } from "../../closures/binary"
import { deepEquals, isValue } from "../../utility/deepEquals"
import { Connective } from './connective'
import { not } from './complement'
import { and } from './conjunction'

export type AlternativeDenial = Connective<Species.nand>

export const [nand, isAlternativeDenial, $nand] = binary<AlternativeDenial, Boolean>(
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
