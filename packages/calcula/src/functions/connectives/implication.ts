import { _ } from '@arrows/multimethod'
import { Writer, unit } from "../../monads/writer"
import { TreeNode, Genera, Species } from "../../utility/tree"
import { Real, Complex, Boolean, boolean } from "../../primitives"
import { BinaryNode, binary, when, binaryInfixRule } from "../../closures/binary"
import { deepEquals, isValue } from "../../utility/deepEquals"
import { Connective } from './connective'
import { not } from './complement'
import { or } from './disjunction'
import { rule } from '../../utility/rule'
import { Unicode } from '../../Unicode'

export type Implication = Connective<Species.implies>

export const impliesRule = binaryInfixRule(Unicode.implies)

export const [implies, isImplication, $implies] = binary<Implication, Boolean>(
  Species.implies, Genera.connective
)(
  (l, r) => [or(not(unit(l)), unit(r)), impliesRule(l, r), 'real implication'],
  (l, r) => [or(not(unit(l)), unit(r)), impliesRule(l, r), 'complex implication'],
  (l, r) => [or(not(unit(l)), unit(r)), impliesRule(l, r), 'boolean implication']
)(
  when(
    [isValue(boolean(true)), _], 
    (_l, r) => [unit(r), rule`${r}`, 'implicative identity']
  ),
  when(
    [_, isValue(boolean(true))], 
    [boolean(true), rule`${boolean(true)}`, 'implicative annihilator']
  ),
  when(
    [isValue(boolean(false)), _], 
    [boolean(true), rule`${boolean(true)}`, 'implicative annihilator']
  ),
  when(
    [_, isValue(boolean(false))], 
    (l, _r) => [
      not(unit(l)), rule`${Unicode.not}(${l})`, 'implicative complementation'
    ]
  )
)
