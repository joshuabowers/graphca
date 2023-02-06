import { Writer } from "../monads/writer"
import { Operation } from "../utility/operation"
import { Species, TreeNode } from "../utility/tree"
import { Complex, primitive } from "../closures/primitive"
import { isNumberTuple } from "../utility/valuePredicates"
import { numeric } from "../utility/numeric"
import { Unicode } from "../Unicode"
export { Complex }

export const [complex, isComplex, $complex] = 
  primitive<[number, number], {a: number, b: number}, Complex>(
  isNumberTuple,
  ([a, b]) => ({a, b}),
  Species.complex,
  c => `${numeric(c.a)}+${numeric(c.b)}${Unicode.i}` // TODO: Make more robust
)(
  r => [r.value, 0],
  c => [c.a, c.b],
  b => [b.value ? 1 : 0, 0]
)()

export const ComplexInfinity = complex([Infinity, NaN])

export const isComplexInfinity = (v: Writer<TreeNode, Operation>): boolean =>
  isComplex(v) && !Number.isFinite(v.value.a) && Number.isNaN(v.value.b)
