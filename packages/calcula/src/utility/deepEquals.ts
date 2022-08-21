import { Writer } from '../monads/writer'
import { method, multi, Multi } from '@arrows/multimethod'
import { areKindEqual } from './ASTNode'
import { Real, Complex, Boolean, Nil, NaN } from '../primitives'
import { Node, Kinds, is } from './nodes'

type KindPredicate<T extends Node> = (v: unknown) => v is Writer<T>
type CaseOfPredicate<T extends Node> = (left: T, right: T) => boolean
const caseOf = <T extends Node>(kind: Kinds | KindPredicate<T>) => 
  (fn: CaseOfPredicate<T> | boolean) =>
    method(
      typeof kind === 'string' ? [is(kind), is(kind)] : [kind, kind], 
      (l: Writer<T>, r: Writer<T>) => 
        areKindEqual(l, r) && (typeof fn === 'boolean' ? fn : fn(l.value, r.value)
      )
    )

export type EqualsFn<T extends Node> = (left: Writer<T>, right: Writer<T>) => boolean
export type DeepEqualsFn = Multi
  & EqualsFn<Real>
  & EqualsFn<Complex>
  & EqualsFn<Boolean>
  & EqualsFn<Nil>
  & EqualsFn<NaN>
  & EqualsFn<Variable>
  & EqualsFn<Unary>
  & EqualsFn<Binary>
  & EqualsFn<Node>

export const deepEquals: DeepEqualsFn = multi(
  caseOf<Real>('Real')((l, r) => l.value === r.value),
  caseOf<Complex>('Complex')((l, r) => l.a === r.a && l.b === r.b),
  caseOf<Boolean>('Boolean')((l, r) => l.value === r.value),
  caseOf<Nil>('Nil')(true),
  caseOf<NaN>('NaN')(false),
  caseOf<Variable>('Variable')((l, r) => l.name === r.name && deepEquals(l.value, r.value)),
  caseOf<Unary>(isUnary)((l, r) => deepEquals(l.expression, r.expression)),
  caseOf<Binary>(isBinary)(
    (l, r) => deepEquals(l.left, r.left) && deepEquals(l.right, r.right)
  ),
  method(false)
)

export const isValue = <T extends Node>(expected: Writer<T>) =>
  <U extends Node>(actual: Writer<U>) =>
    deepEquals(expected, actual)

export type WalkFn<T extends Node, R extends Node = T> = (t: Writer<T>) => Writer<R>
export const deepEqualsAt = <L extends Node, R extends Node>(
  leftWalk: WalkFn<L, Node>,
  rightWalk: WalkFn<R, Node>
) => (l: Writer<L>, r: Writer<R>) => deepEquals(leftWalk(l), rightWalk(r))
