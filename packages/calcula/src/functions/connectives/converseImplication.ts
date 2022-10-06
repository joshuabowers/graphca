import { _ } from '@arrows/multimethod'
import { Writer, unit } from "../../monads/writer"
import { Clades, Genera, Species, isSpecies, isGenus } from "../../utility/tree"
import { Real, Complex, Boolean, boolean } from "../../primitives"
import { BinaryNode, binary, when, binaryInfixRule } from "../../closures/binary"
import { deepEquals, isValue } from "../../utility/deepEquals"
import { Connective } from './connective'
import { not, notRule } from './complement'
import { or } from './disjunction'
import { Unicode } from '../../Unicode'
import { rule } from '../../utility/rule'

export type ConverseImplication = Connective<Species.converse>

export const converseRule = binaryInfixRule(Unicode.converse)

export const [converse, isConverseImplication, $converse] = binary<ConverseImplication, Boolean>(
  Species.converse, Genera.connective
)(
  (l, r) => [or(unit(l), not(unit(r))), converseRule(l, r), 'real converse implication'],
  (l, r) => [or(unit(l), not(unit(r))), converseRule(l, r), 'complex converse implication'],
  (l, r) => [or(unit(l), not(unit(r))), converseRule(l, r), 'boolean converse implication']
)(
  when(
    [isValue(boolean(true)), _], 
    [boolean(true), rule`${boolean(true)}`, 'converse implication annihilator']
  ),
  when(
    [_, isValue(boolean(true))], 
    (l, _r) => [unit(l), rule`${l}`, 'converse implication identity']
  ),
  when(
    [isValue(boolean(false)), _], 
    (_l, r) => [not(unit(r)), notRule(r), 'converse implication complementation']
  ),
  when(
    [_, isValue(boolean(false))], 
    [boolean(true), rule`${boolean(true)}`, 'converse implication annihilator']
  )
)
