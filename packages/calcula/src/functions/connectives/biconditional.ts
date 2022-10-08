import { _ } from '@arrows/multimethod'
import { unit } from "../../monads/writer"
import { Genera, Species, Notation } from "../../utility/tree"
import { Boolean, boolean } from "../../primitives"
import { binary, when, binaryInfixRule } from "../../closures/binary"
import { deepEquals, isValue } from "../../utility/deepEquals"
import { Connective } from './connective'
import { not } from './complement'
import { and } from './conjunction'
import { implies } from './implication'
import { Unicode } from '../../Unicode'
import { rule } from '../../utility/rule'

export type Biconditional = Connective<Species.xnor>

export const xnorRule = binaryInfixRule(Unicode.xnor)

export const [xnor, isBiconditional, $xnor] = binary<Biconditional, Boolean>(
  Unicode.xnor, Notation.infix, Species.xnor, Genera.connective
)(
  (l, r) => [
    and(implies(unit(l), unit(r)), implies(unit(r), unit(l))), 
    xnorRule(l, r),
    'real biconditional'
  ],
  (l, r) => [
    and(implies(unit(l), unit(r)), implies(unit(r), unit(l))), 
    xnorRule(l, r),
    'complex biconditional'
  ],
  (l, r) => [
    and(implies(unit(l), unit(r)), implies(unit(r), unit(l))), 
    xnorRule(l, r),
    'boolean biconditional'
  ]
)(
  when(
    [isValue(boolean(true)), _],
    (_l, r) => [unit(r), rule`${r}`, 'biconditional identity']
  ),
  when(
    [_, isValue(boolean(true))],
    (l, _r) => [unit(l), rule`${l}`, 'biconditional identity']
  ),
  when(
    [isValue(boolean(false)), _],
    (_l, r) => [not(unit(r)), rule`${Unicode.not}(${r})`, 'biconditional complementation']
  ),
  when(
    [_, isValue(boolean(false))],
    (l, _r) => [not(unit(l)), rule`${Unicode.not}(${l})`, 'biconditional complementation']
  ),
  when(deepEquals, [boolean(true), rule`${boolean(true)}`, 'biconditional annihilator'])
)
