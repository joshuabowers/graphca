import { _ } from '@arrows/multimethod'
import { Writer, unit } from "../../monads/writer"
import { TreeNode, Clades, Genera, Species, isSpecies, isGenus } from "../../utility/tree"
import { Real, Complex, Boolean, boolean } from "../../primitives"
import { BinaryNode, binary } from "../../closures/binary"
import { deepEquals, isValue } from "../../utility/deepEquals"
import { Connective } from './connective'
import { Complement, isComplement } from './complement'
import { isConjunction } from './conjunction'
import { implies } from './implication'
import { converse } from './converseImplication'

export type Disjunction = Connective<Species.or>

export const [or, isDisjunction, $or] = binary<Disjunction, Boolean>(
  Species.or, Genera.connective
)(
  (l, r) => [boolean(l.value !== 0 || r.value !== 0), 'real disjunction'],
  (l, r) => [
    boolean(l.a !== 0 || l.b !== 0 || r.a !== 0 || r.b !== 0),
    'complex disjunction'
  ],
  (l, r) => [boolean(l.value || r.value), 'boolean disjunction']
)( when => [
  when(
    [_, isValue(boolean(false))],
    (l, _r) => [unit(l), 'disjunctive identity']
  ),
  when(
    [isValue(boolean(false)), _],
    (_l, r) => [unit(r), 'disjunctive identity']
  ),
  when(
    [_, isValue(boolean(true))],
    [boolean(true), 'disjunctive annihilator']
  ),
  when(
    [isValue(boolean(true)), _],
    [boolean(true), 'disjunctive annihilator']
  ),
  when(deepEquals, (l, _r) => [unit(l), 'disjunctive idempotency']),
  when(
    (l, r) => isConjunction(r) && deepEquals(l, r.value.left),
    (l, _r) => [unit(l), 'disjunctive absorption']
  ),
  when(
    (l, r) => isConjunction(r) && deepEquals(l, r.value.right),
    (l, _r) => [unit(l), 'disjunctive absorption']
  ),
  when(
    (l, r) => isConjunction(l) && deepEquals(l.value.left, r),
    (_l, r) => [unit(r), 'disjunctive absorption']
  ),
  when(
    (l, r) => isConjunction(l) && deepEquals(l.value.right, r),
    (_l, r) => [unit(r), 'disjunctive absorption']
  ),
  when(
    (l, r) => isComplement(r) && deepEquals(l, r.value.expression),
    [boolean(true), 'disjunctive complementation']
  ),
  when(
    (l, r) => isComplement(l) && deepEquals(l.value.expression, r),
    [boolean(true), 'disjunctive complementation']
  ),
  when<Complement, TreeNode>(
    (l, _r) => isComplement(l),
    (l, r) => [implies(l.expression, unit(r)), 'disjunctive implication']
  ),
  when<TreeNode, Complement>(
    (_l, r) => isComplement(r),
    (l, r) => [converse(unit(l), r.expression), 'disjunctive converse implication']
  )
])
