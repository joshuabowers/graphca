import { method, multi, Multi } from '@arrows/multimethod'
import { Writer } from '../monads/writer'
import { Operation } from '../utility/operation'
import { TreeNode, TreeNodeGuardFn } from '../utility/tree'
import { isReal, isComplex, isBoolean } from '../primitives'
import { isVariable } from '../variable'
import { isUnary } from '../closures/unary'
import { isAddition } from './addition'
import { isMultiplication } from './multiplication'
import { isExponentiation } from './exponentiation'
import { isLogarithm } from '../functions'

export type DegreeFn = Multi 
  & ((node: Writer<TreeNode, Operation>) => number)

const when = <T extends TreeNode>(
  guardFn: TreeNodeGuardFn<T>,
  fn: number | ((node: Writer<T, Operation>) => number)
) =>
  method(guardFn, (t: Writer<T, Operation>) => {
    return typeof fn === 'function' ? fn(t) : fn
  })

export const subDegree: DegreeFn = multi(
  when(isReal, r => r.value.raw),
  when(isComplex, c => Math.hypot(c.value.raw.a, c.value.raw.b)),
  when(isVariable, Infinity),
  method(0)
)

export const degree: DegreeFn = multi(
  method(
    (v: Writer<TreeNode, Operation>) => 
      (isReal(v) && v.value.raw === 0)
      || (isComplex(v) && v.value.raw.a === 0 && v.value.raw.b === 0)
      || (isBoolean(v) && v.value.raw === false), 
    -Infinity
  ),
  when(isReal, 0),
  when(isComplex, 0),
  when(isBoolean, 0),
  when(isVariable, 1),
  when(
    isAddition, 
    // e => Math.max(degree(e.value.left), degree(e.value.right))
    e => e.value.operands.reduce((p, c) => Math.max(p, degree(c)), -Infinity)
  ),
  when(
    isMultiplication,
    // e => degree(e.value.left) + degree(e.value.right)
    e => e.value.operands.reduce((p, c) => p + degree(c), 0)
  ),
  when(
    isExponentiation,
    e => subDegree(e.value.right)
  ),
  when(isLogarithm, 0),
  when(isUnary, 1),
  method(0)
)
