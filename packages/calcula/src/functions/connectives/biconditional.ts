import { _ } from '@arrows/multimethod'
import { Writer, unit } from "../../monads/writer"
import { Clades, Genera, Species, isSpecies, isGenus } from "../../utility/tree"
import { Real, Complex, Boolean, boolean } from "../../primitives"
import { BinaryNode, binary, when } from "../../closures/binary"
import { deepEquals, isValue } from "../../utility/deepEquals"
import { Connective } from './connective'
import { not } from './complement'
import { and } from './conjunction'
import { implies } from './implication'

export type Biconditional = Connective<Species.xnor>

export const [xnor, isBiconditional, $xnor] = binary<Biconditional, Boolean>(
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
