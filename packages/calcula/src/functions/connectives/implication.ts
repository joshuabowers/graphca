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
  when([isValue(boolean(true)), _], (_l, r) => [unit(r), 'implicative identity']),
  when([_, isValue(boolean(true))], [boolean(true), 'implicative annihilator']),
  when([isValue(boolean(false)), _], [boolean(true), 'implicative annihilator']),
  when(
    [_, isValue(boolean(false))], 
    (l, _r) => [not(unit(l)), 'implicative complementation']
  )
)
