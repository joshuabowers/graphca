import { multi, method, Multi } from "@arrows/multimethod"
import { Writer, unit } from "../monads/writer"
import { Operation } from "../utility/operation"
import { Species, TreeNode } from "../utility/tree"
import { Complex, primitive } from "../closures/primitive"
import { areNumericOrString } from "../utility/valuePredicates"
import { numeric } from "../utility/numeric"
import { Unicode } from "../Unicode"
export { Complex }

export const isComplexInfinity = (v: Writer<TreeNode, Operation>): boolean =>
  isComplex(v) && !Number.isFinite(v.value.raw.a) && Number.isNaN(v.value.raw.b)

export const isNegativeImaginary = (v: Writer<TreeNode, Operation>): boolean =>
  isComplex(v) && v.value.raw.b < 0

export type ToStringFn = Multi
  & ((c: Writer<Complex, Operation>) => string)

export const toString: ToStringFn = multi(
  method(isComplexInfinity, Unicode.complexInfinity),
  method((c: Writer<Complex, Operation>) => `${
    numeric(c.value.raw.a)
  }${c.value.raw.b >= 0 ? '+' : ''}${
    numeric(c.value.raw.b)
  }${Unicode.i}`)
)

export const [complex, isComplex, $complex] = 
  primitive<[number|string, number|string], {a: number, b: number}, Complex>(
  areNumericOrString,
  (a, b) => ({a: Number(a), b: Number(b)}),
  Species.complex,
  c => toString(unit(c))
)(
  r => [r.raw, 0],
  c => [c.raw.a, c.raw.b],
  b => [b.raw ? 1 : 0, 0]
)()

export const ComplexInfinity = complex(Infinity, NaN)
