import { _ } from '@arrows/multimethod'
import { Writer, unit } from "../../monads/writer"
import { Clades, Genera, Species, isSpecies, isGenus } from "../../utility/tree"
import { Real, Complex, Boolean, boolean } from "../../primitives"
import { BinaryNode, binary, when } from "../../closures/binary"
import { deepEquals, isValue } from "../../utility/deepEquals"
import { Connective } from './connective'
import { not } from './complement'
import { and } from './conjunction'
import { or } from './disjunction'

export type ExclusiveDisjunction = Connective<Species.xor>

export const [xor, isExclusiveDisjunction, $xor] = binary<ExclusiveDisjunction, Boolean>(
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
