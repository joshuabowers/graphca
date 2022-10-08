import { Genera, Species, Notation, TreeNode } from "../utility/tree";
import { real, complex, boolean, Complex } from "../primitives";
import { Binary, binary, when, partialLeft, binaryFnRule } from "../closures/binary";
import { divide } from '../arithmetic'
import { Exponentiation, isExponentiation } from "../arithmetic/exponentiation";
import { deepEquals } from "../utility/deepEquals";
import { rule } from "../utility/rule";

export type Logarithm = Binary<Species.log, Genera.logarithmic>

const lnComplex = (c: Complex) => complex([
  Math.log(Math.hypot(c.a, c.b)),
  Math.atan2(c.b, c.a)
])

export const logRule = binaryFnRule('log')

export const [log, isLogarithm, $log] = binary<Logarithm>(
  'log', Notation.prefix, Species.log, Genera.logarithmic
)(
  (l, r) => [
    real(Math.log(r.value) / Math.log(l.value)), 
    logRule(l, r),
    'computed real logarithm'
  ],
  (l, r) => {
    const n = lnComplex(r)
    const logRule = rule`log(${l}, ${r})`
    const action = 'computed complex logarithm'
    if(l.a === Math.E && l.b === 0){ return [n, logRule, action] }
    return [divide(lnComplex(r), lnComplex(l)), logRule, action]
  },
  (l, r) => [boolean(l.value || !r.value), logRule(l, r), 'computed boolean logarithm']
)(
  when<TreeNode, Exponentiation>(
    (l, r) => isExponentiation(r) && deepEquals(l, r.value.left),
    (_l, r) => [r.right, rule`${r.right}`, 'inverse operation cancellation']
  )
)

const fromLog = partialLeft(log)
export const lb = fromLog(real(2))
export const ln = fromLog(real(Math.E))
export const lg = fromLog(real(10))
