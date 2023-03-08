import { Genera, Species, Notation, TreeNode } from "../utility/tree";
import { real, complex, boolean, Complex } from "../primitives";
import { Binary, binary, when, partialLeft } from "../closures/binary";
import { divide } from '../arithmetic'
import { Exponentiation, isExponentiation } from "../arithmetic/exponentiation";
import { deepEquals } from "../utility/deepEquals";

export type Logarithm = Binary<Species.log, Genera.logarithmic>

const lnComplex = (c: Complex) => complex(
  Math.log(Math.hypot(c.raw.a, c.raw.b)),
  Math.atan2(c.raw.b, c.raw.a)
)

export const [log, isLogarithm, $log] = binary<Logarithm>(
  'log', Notation.prefix, Species.log, Genera.logarithmic
)(
  (l, r) => real(Math.log(r.value.raw) / Math.log(l.value.raw)), 
  (l, r) => {
    const n = lnComplex(r.value)
    if(l.value.raw.a === Math.E && l.value.raw.b === 0){ return n }
    return divide(lnComplex(r.value), lnComplex(l.value))
  },
  (l, r) => boolean(l.value.raw || !r.value.raw)
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
