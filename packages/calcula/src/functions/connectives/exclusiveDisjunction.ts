import { _ } from '@arrows/multimethod'
import { Genera, Species, Notation } from "../../utility/tree"
import { Boolean, boolean } from "../../primitives"
import { binary, when } from "../../closures/binary"
import { deepEquals, isValue } from "../../utility/deepEquals"
import { Connective } from './connective'
import { not } from './complement'
import { and } from './conjunction'
import { or } from './disjunction'
import { Unicode } from '../../Unicode'

export type ExclusiveDisjunction = Connective<Species.xor>

export const [xor, isExclusiveDisjunction, $xor] = binary<ExclusiveDisjunction, Boolean>(
  Unicode.xor, Notation.infix, Species.xor, Genera.connective
)(
  (l, r) => and(or(l, r), not(and(l, r))), 
  (l, r) => and(or(l, r), not(and(l, r))), 
  (l, r) => and(or(l, r), not(and(l, r))), 
)(
  when(
    [isValue(boolean(false)), _], 
    (_l, r) => [r, 'exclusive disjunctive identity']
  ),
  when(
    [_, isValue(boolean(false))],
    (l, _r) => [l, 'exclusive disjunctive identity']
  ),
  when(
    [isValue(boolean(true)), _],
    (_l, r) => [not(r), 'exclusive disjunctive complementation']
  ),
  when(
    [_, isValue(boolean(true))],
    (l, _r) => [not(l), 'exclusive disjunctive complementation']
  ),
  when(
    deepEquals, 
    [boolean(false), 'exclusive disjunctive annihilator']
  )
)
