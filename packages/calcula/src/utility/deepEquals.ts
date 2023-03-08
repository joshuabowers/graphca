import { method, multi, Multi } from '@arrows/multimethod'
import { Writer } from '../monads/writer'
import { Operation } from './operation'
import { TreeNode, Species, isSpecies, TreeNodeGuardFn } from './tree'
import { Real, Complex, Boolean, Nil, NaN } from '../primitives'
import { UnaryNode, isUnary } from '../closures/unary'
import { BinaryNode, isBinary } from '../closures/binary'
import { Variable } from '../variable'

export const areSpeciesEqual = <T extends TreeNode, U extends TreeNode>(
  t: Writer<T, Operation>, u: Writer<U, Operation>
) => t.value.species === u.value.species

type CaseOfPredicate<T extends TreeNode> = (left: T, right: T) => boolean
const caseOf = <T extends TreeNode>(species: Species | TreeNodeGuardFn<T>) => {
  const is = typeof species === 'string' ? isSpecies<T>(species) : undefined
  return (fn: CaseOfPredicate<T> | boolean) =>
    method(
      is ? [is, is] : [species, species], 
      (l: Writer<T, Operation>, r: Writer<T, Operation>) => 
        areSpeciesEqual(l, r) && (typeof fn === 'boolean' ? fn : fn(l.value, r.value)
      )
    )
}

export type EqualsFn<T extends TreeNode> = (left: Writer<T, Operation>, right: Writer<T, Operation>) => boolean
export type DeepEqualsFn = Multi
  & EqualsFn<Real>
  & EqualsFn<Complex>
  & EqualsFn<Boolean>
  & EqualsFn<Nil>
  & EqualsFn<NaN>
  & EqualsFn<Variable>
  & EqualsFn<UnaryNode>
  & EqualsFn<BinaryNode>
  & EqualsFn<TreeNode>

export const deepEquals: DeepEqualsFn = multi(
  caseOf<Real>(Species.real)((l, r) => l.raw === r.raw),
  caseOf<Complex>(Species.complex)(
    (l, r) => l.raw.a === r.raw.a && l.raw.b === r.raw.b
  ),
  caseOf<Boolean>(Species.boolean)((l, r) => l.raw === r.raw),
  caseOf<Nil>(Species.nil)(true),
  caseOf<NaN>(Species.nan)(false),
  caseOf<Variable>(Species.variable)((l, r) => l.name === r.name && deepEquals(l.binding, r.binding)),
  caseOf<UnaryNode>(isUnary)((l, r) => deepEquals(l.expression, r.expression)),
  caseOf<BinaryNode>(isBinary)(
    (l, r) => deepEquals(l.left, r.left) && deepEquals(l.right, r.right)
  ),
  method(false)
)

export const isValue = <T extends TreeNode>(expected: Writer<T, Operation>) =>
  <U extends TreeNode>(actual: Writer<U, Operation>) =>
    deepEquals(expected, actual)

export type WalkFn<T extends TreeNode, R extends TreeNode = T> = 
  (t: Writer<T, Operation>) => Writer<R, Operation>

export const deepEqualsAt = <L extends TreeNode, R extends TreeNode>(
  leftWalk: WalkFn<L, TreeNode>,
  rightWalk: WalkFn<R, TreeNode>
) => (l: Writer<L, Operation>, r: Writer<R, Operation>) => deepEquals(leftWalk(l), rightWalk(r))
