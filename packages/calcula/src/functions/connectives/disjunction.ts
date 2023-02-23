import { _ } from '@arrows/multimethod'
import { TreeNode, Genera, Species, Notation } from "../../utility/tree"
import { Boolean, boolean } from "../../primitives"
import { binary, when } from "../../closures/binary"
import { deepEquals, isValue } from "../../utility/deepEquals"
import { Connective } from './connective'
import { Complement, isComplement } from './complement'
import { isConjunction } from './conjunction'
import { implies } from './implication'
import { converse } from './converseImplication'
import { Unicode } from '../../Unicode'

export type Disjunction = Connective<Species.or>

export const [or, isDisjunction, $or] = binary<Disjunction, Boolean>(
  Unicode.or, Notation.infix, Species.or, Genera.connective
)(
  (l, r) => boolean(l.value.value !== 0 || r.value.value !== 0),
  (l, r) => boolean(
    l.value.a !== 0 || l.value.b !== 0 || r.value.a !== 0 || r.value.b !== 0
  ),
  (l, r) => boolean(l.value.value || r.value.value)
)(
  when(
    [_, isValue(boolean(false))],
    (l, _r) => [l, 'disjunctive identity']
  ),
  when(
    [isValue(boolean(false)), _],
    (_l, r) => [r, 'disjunctive identity']
  ),
  when(
    [_, isValue(boolean(true))],
    [boolean(true), 'disjunctive annihilator']
  ),
  when(
    [isValue(boolean(true)), _],
    [boolean(true), 'disjunctive annihilator']
  ),
  when(
    deepEquals, 
    (l, _r) => [l, 'disjunctive idempotency']
  ),
  when(
    (l, r) => isConjunction(r) && deepEquals(l, r.value.left),
    (l, _r) => [l, 'disjunctive absorption']
  ),
  when(
    (l, r) => isConjunction(r) && deepEquals(l, r.value.right),
    (l, _r) => [l, 'disjunctive absorption']
  ),
  when(
    (l, r) => isConjunction(l) && deepEquals(l.value.left, r),
    (_l, r) => [r, 'disjunctive absorption']
  ),
  when(
    (l, r) => isConjunction(l) && deepEquals(l.value.right, r),
    (_l, r) => [r, 'disjunctive absorption']
  ),
  when(
    (l, r) => isComplement(r) && deepEquals(l, r.value.expression),
    [boolean(true), 'disjunctive tautology']
  ),
  when(
    (l, r) => isComplement(l) && deepEquals(l.value.expression, r),
    [boolean(true), 'disjunctive tautology']
  ),
  when<Complement, TreeNode>(
    (l, _r) => isComplement(l),
    (l, r) => [
      implies(l.value.expression, r), 
      'disjunctive implication'
    ]
  ),
  when<TreeNode, Complement>(
    (_l, r) => isComplement(r),
    (l, r) => [
      converse(l, r.value.expression), 
      'disjunctive converse implication'
    ]
  )
)
