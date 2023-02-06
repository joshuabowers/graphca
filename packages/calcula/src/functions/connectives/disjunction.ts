import { _ } from '@arrows/multimethod'
import { unit } from "../../monads/writer"
import { TreeNode, Genera, Species, Notation } from "../../utility/tree"
import { Boolean, boolean } from "../../primitives"
import { binary, when, binaryInfixRule } from "../../closures/binary"
import { deepEquals, isValue } from "../../utility/deepEquals"
import { Connective } from './connective'
import { Complement, isComplement } from './complement'
import { isConjunction } from './conjunction'
import { implies, impliesRule } from './implication'
import { converse, converseRule } from './converseImplication'
import { Unicode } from '../../Unicode'
import { rule } from '../../utility/rule'

export type Disjunction = Connective<Species.or>

export const orRule = binaryInfixRule(Unicode.or)

export const [or, isDisjunction, $or] = binary<Disjunction, Boolean>(
  Unicode.or, Notation.infix, Species.or, Genera.connective
)(
  (l, r) => boolean(l.value !== 0 || r.value !== 0),
  (l, r) => boolean(l.a !== 0 || l.b !== 0 || r.a !== 0 || r.b !== 0),
  (l, r) => boolean(l.value || r.value)
)(
  when(
    [_, isValue(boolean(false))],
    (l, _r) => [unit(l), rule`${l}`, 'disjunctive identity']
  ),
  when(
    [isValue(boolean(false)), _],
    (_l, r) => [unit(r), rule`${r}`, 'disjunctive identity']
  ),
  when(
    [_, isValue(boolean(true))],
    [boolean(true), rule`${boolean(true)}`, 'disjunctive annihilator']
  ),
  when(
    [isValue(boolean(true)), _],
    [boolean(true), rule`${boolean(true)}`, 'disjunctive annihilator']
  ),
  when(
    deepEquals, 
    (l, _r) => [unit(l), rule`${l}`, 'disjunctive idempotency']
  ),
  when(
    (l, r) => isConjunction(r) && deepEquals(l, r.result.left),
    (l, _r) => [unit(l), rule`${l}`, 'disjunctive absorption']
  ),
  when(
    (l, r) => isConjunction(r) && deepEquals(l, r.result.right),
    (l, _r) => [unit(l), rule`${l}`, 'disjunctive absorption']
  ),
  when(
    (l, r) => isConjunction(l) && deepEquals(l.result.left, r),
    (_l, r) => [unit(r), rule`${r}`, 'disjunctive absorption']
  ),
  when(
    (l, r) => isConjunction(l) && deepEquals(l.result.right, r),
    (_l, r) => [unit(r), rule`${r}`, 'disjunctive absorption']
  ),
  when(
    (l, r) => isComplement(r) && deepEquals(l, r.result.expression),
    [boolean(true), rule`${boolean(true)}`, 'disjunctive complementation']
  ),
  when(
    (l, r) => isComplement(l) && deepEquals(l.result.expression, r),
    [boolean(true), rule`${boolean(true)}`, 'disjunctive complementation']
  ),
  when<Complement, TreeNode>(
    (l, _r) => isComplement(l),
    (l, r) => [
      implies(l.expression, unit(r)), 
      impliesRule(l.expression, r), 
      'disjunctive implication'
    ]
  ),
  when<TreeNode, Complement>(
    (_l, r) => isComplement(r),
    (l, r) => [
      converse(unit(l), r.expression), 
      converseRule(l, r.expression), 
      'disjunctive converse implication'
    ]
  )
)
