import { method, multi, Multi } from '@arrows/multimethod'
import { Writer } from '../monads/writer'
import { Operation } from '../utility/operation'
import { TreeNode, TreeNodeGuardFn, isSpecies, Species } from '../utility/tree'
import { isReal, isComplex, isBoolean } from '../primitives'
import { isVariable } from '../variable'
import { isUnary, UnaryNode } from '../closures/unary'
import { BinaryNode } from '../closures/binary'
import { MultiaryNode } from '../closures/multiary'

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

/**
 * Calculates the degree qua order of the expression passed to it: that
 * is, a value indicating the overall relative contribution of the node
 * to the value of the broader expression it might exist within.
 * @returns A number ranging between -Infinity and Infinity
 */
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
  // NB: raw isSpecies calls used instead of generated closures due to
  // multiary making use of degree for operand sorting; the following
  // four constructs all rely upon multiary, either directly or indirectly,
  // to define themselves.
  when(
    isSpecies<MultiaryNode>(Species.add),
    e => e.value.operands.reduce((p, c) => Math.max(p, degree(c)), -Infinity)
  ),
  when(
    isSpecies<MultiaryNode>(Species.multiply),
    e => e.value.operands.reduce((p, c) => p + degree(c), 0)
  ),
  when(
    isSpecies<BinaryNode>(Species.raise),
    e => subDegree(e.value.right)
  ),
  when(isSpecies<UnaryNode>(Species.log), 0),
  when(isUnary, 1),
  method(0)
)
