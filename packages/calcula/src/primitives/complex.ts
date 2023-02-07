import { multi, method, Multi } from "@arrows/multimethod"
import { Writer, unit } from "../monads/writer"
import { Operation } from "../utility/operation"
import { Species, TreeNode } from "../utility/tree"
import { Complex, primitive } from "../closures/primitive"
import { isNumberTuple } from "../utility/valuePredicates"
import { numeric } from "../utility/numeric"
import { Unicode } from "../Unicode"
export { Complex }

export const isComplexInfinity = (v: Writer<TreeNode, Operation>): boolean =>
  isComplex(v) && !Number.isFinite(v.value.a) && Number.isNaN(v.value.b)

export const isNegativeImaginary = (v: Writer<TreeNode, Operation>): boolean =>
  isComplex(v) && v.value.b < 0

export type ToStringFn = Multi
  & ((c: Writer<Complex, Operation>) => string)

export const toString: ToStringFn = multi(
  method(isComplexInfinity, Unicode.complexInfinity),
  method((c: Writer<Complex, Operation>) => `${
    numeric(c.value.a)
  }${c.value.b >= 0 ? '+' : ''}${
    numeric(c.value.b)
  }${Unicode.i}`)
)

export const [complex, isComplex, $complex] = 
  primitive<[number, number], {a: number, b: number}, Complex>(
  isNumberTuple,
  ([a, b]) => ({a, b}),
  Species.complex,
  c => toString(unit(c))// `${numeric(c.a)}+${numeric(c.b)}${Unicode.i}` // TODO: Make more robust
)(
  r => [r.value, 0],
  c => [c.a, c.b],
  b => [b.value ? 1 : 0, 0]
)()

export const ComplexInfinity = complex([Infinity, NaN])
