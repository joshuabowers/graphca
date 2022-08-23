import { Genera, Species, TreeNode } from "../utility/tree";
import { real, complex, boolean, Complex } from "../primitives";
import { Binary, binary, when, partialLeft } from "../closures/binary";
import { divide } from '../arithmetic'
import { Exponentiation, isExponentiation } from "../arithmetic/exponentiation";
import { deepEquals } from "../utility/deepEquals";

export type Logarithm = Binary<Species.log, Genera.logarithmic>

const lnComplex = (c: Complex) => complex([
  Math.log(Math.hypot(c.a, c.b)),
  Math.atan2(c.b, c.a)
])

export const [log, isLogarithm] = binary<Logarithm>(Species.log, Genera.logarithmic)(
  (l, r) => [real(Math.log(r.value) / Math.log(l.value)), 'computed real logarithm'],
  (l, r) => {
    const n = lnComplex(r)
    const action = 'computed complex logarithm'
    if(l.a === Math.E && l.b === 0){ return [n, action] }
    return [divide(lnComplex(r), lnComplex(l)), action]
  },
  (l, r) => [boolean(l.value || !r.value), 'computed boolean logarithm']
)(
  when<TreeNode, Exponentiation>(
    (l, r) => isExponentiation(r) && deepEquals(l, r.value.left),
    (_l, r) => [r.value.right, 'inverse operation cancellation']
  )
)

const fromLog = partialLeft(log)
export const lb = fromLog(real(2))
export const ln = fromLog(real(Math.E))
export const lg = fromLog(real(10))
