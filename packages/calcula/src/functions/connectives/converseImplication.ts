import { _ } from '@arrows/multimethod'
import { unit } from "../../monads/writer"
import { Genera, Species, Notation } from "../../utility/tree"
import { Boolean, boolean } from "../../primitives"
import { binary, when, binaryInfixRule } from "../../closures/binary"
import { isValue } from "../../utility/deepEquals"
import { Connective } from './connective'
import { not, notRule } from './complement'
import { or } from './disjunction'
import { Unicode } from '../../Unicode'
import { rule } from '../../utility/rule'

export type ConverseImplication = Connective<Species.converse>

export const converseRule = binaryInfixRule(Unicode.converse)

export const [converse, isConverseImplication, $converse] = binary<ConverseImplication, Boolean>(
  Unicode.converse, Notation.infix, Species.converse, Genera.connective
)(
  (l, r) => or(unit(l), not(unit(r))),
  (l, r) => or(unit(l), not(unit(r))),
  (l, r) => or(unit(l), not(unit(r)))
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
