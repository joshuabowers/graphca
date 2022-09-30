import { _ } from '@arrows/multimethod'
import { Writer, unit } from "../../monads/writer"
import { Clades, Genera, Species, isSpecies, isGenus } from "../../utility/tree"
import { Real, Complex, Boolean, boolean } from "../../primitives"
import { BinaryNode, binary } from "../../closures/binary"
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
)( when => [
  when(
    [isValue(boolean(true)), _],
    (_l, r) => [unit(r), 'biconditional identity']
  ),
  when(
    [_, isValue(boolean(true))],
    (l, _r) => [unit(l), 'biconditional identity']
  ),
  when(
    [isValue(boolean(false)), _],
    (_l, r) => [not(unit(r)), 'biconditional complementation']
  ),
  when(
    [_, isValue(boolean(false))],
    (l, _r) => [not(unit(l)), 'biconditional complementation']
  ),
  when(deepEquals, [boolean(true), 'biconditional annihilator'])
])
