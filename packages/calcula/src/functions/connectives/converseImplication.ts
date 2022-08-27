import { _ } from '@arrows/multimethod'
import { Writer, unit } from "../../monads/writer"
import { Clades, Genera, Species, isSpecies, isGenus } from "../../utility/tree"
import { Real, Complex, Boolean, boolean } from "../../primitives"
import { BinaryNode, binary, when } from "../../closures/binary"
import { deepEquals, isValue } from "../../utility/deepEquals"
import { Connective } from './connective'
import { not } from './complement'
import { or } from './disjunction'

export type ConverseImplication = Connective<Species.converse>

export const [converse, isConverseImplication, $converse] = binary<ConverseImplication, Boolean>(
  Species.converse, Genera.connective
)(
  (l, r) => [or(unit(l), not(unit(r))), 'real converse implication'],
  (l, r) => [or(unit(l), not(unit(r))), 'complex converse implication'],
  (l, r) => [or(unit(l), not(unit(r))), 'boolean converse implication']
)(
  when(
    [isValue(boolean(true)), _], 
    [boolean(true), 'converse implication annihilator']
  ),
  when(
    [_, isValue(boolean(true))], 
    (l, _r) => [unit(l), 'converse implication identity']
  ),
  when(
    [isValue(boolean(false)), _], 
    (_l, r) => [not(unit(r)), 'converse implication complementation']
  ),
  when(
    [_, isValue(boolean(false))], 
    [boolean(true), 'converse implication annihilator']
  )
)
