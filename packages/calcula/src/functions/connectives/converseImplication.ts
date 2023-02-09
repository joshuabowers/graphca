import { _ } from '@arrows/multimethod'
import { Genera, Species, Notation } from "../../utility/tree"
import { Boolean, boolean } from "../../primitives"
import { binary, when } from "../../closures/binary"
import { isValue } from "../../utility/deepEquals"
import { Connective } from './connective'
import { not } from './complement'
import { or } from './disjunction'
import { Unicode } from '../../Unicode'

export type ConverseImplication = Connective<Species.converse>

export const [converse, isConverseImplication, $converse] = binary<ConverseImplication, Boolean>(
  Unicode.converse, Notation.infix, Species.converse, Genera.connective
)(
  (l, r) => or(l, not(r)),
  (l, r) => or(l, not(r)),
  (l, r) => or(l, not(r))
)(
  when(
    [isValue(boolean(true)), _], 
    [boolean(true), 'converse implication annihilator']
  ),
  when(
    [_, isValue(boolean(true))], 
    (l, _r) => [l, 'converse implication identity']
  ),
  when(
    [isValue(boolean(false)), _], 
    (_l, r) => [not(r), 'converse implication complementation']
  ),
  when(
    [_, isValue(boolean(false))], 
    [boolean(true), 'converse implication annihilator']
  )
)
