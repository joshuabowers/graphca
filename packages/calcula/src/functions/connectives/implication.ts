import { _ } from '@arrows/multimethod'
import { Writer, unit } from "../../monads/writer"
import { Clades, Genera, Species, isSpecies, isGenus } from "../../utility/tree"
import { Real, Complex, Boolean, boolean } from "../../primitives"
import { BinaryNode, binary, when } from "../../closures/binary"
import { deepEquals, isValue } from "../../utility/deepEquals"
import { Connective } from './connective'
import { not } from './complement'
import { or } from './disjunction'

export type Implication = Connective<Species.implies>

export const [implies, isImplication, $implies] = binary<Implication, Boolean>(
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
