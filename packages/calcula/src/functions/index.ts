import { Unicode } from "../Unicode"
import { 
  equals, notEquals, lessThan, greaterThan,
  lessThanEquals, greaterThanEquals
} from "./inequality"
import { 
  not, and, or, xor, implies, nand, nor, xnor, converse 
} from "./connectives"
import { lb, ln, lg } from './logarithmic'
import { cos, sin, tan, sec, csc, cot } from './trigonometric'
import { acos, asin, atan, asec, acsc, acot } from './arcus'
import { cosh, sinh, tanh, sech, csch, coth } from './hyperbolic'
import { acosh, asinh, atanh, asech, acsch, acoth } from './areaHyperbolic'
import { gamma } from './gamma'
import { abs } from './absolute'
import { sqrt } from '../arithmetic/exponentiation'

export type InequalityFn = 
| typeof equals | typeof notEquals
| typeof lessThan | typeof greaterThan 
| typeof lessThanEquals | typeof greaterThanEquals

export type ConnectiveFn =
| typeof and | typeof or | typeof xor | typeof implies
| typeof nand | typeof nor | typeof xnor | typeof converse

type Functions = 
| typeof lb | typeof ln | typeof lg
| typeof cos | typeof sin | typeof tan
| typeof sec | typeof csc | typeof cot
| typeof acos | typeof asin | typeof atan
| typeof asec | typeof acsc | typeof acot
| typeof cosh | typeof sinh | typeof tanh
| typeof sech | typeof csch | typeof coth
| typeof acosh | typeof asinh | typeof atanh
| typeof asech | typeof acsch | typeof acoth
| typeof gamma | typeof abs | typeof sqrt

export const inequality = new Map<string, InequalityFn>(
  [
    ['==', equals],
    ['!=', notEquals],
    ['<=', lessThanEquals],
    ['>=', greaterThanEquals],
    ['<', lessThan],
    ['>', greaterThan]
  ]
)

export const connectives = new Map<string, ConnectiveFn>(
  [
    [Unicode.xnor, xnor],
    [Unicode.and, and],
    [Unicode.or, or],
    [Unicode.xor, xor],
    [Unicode.implies, implies],
    [Unicode.nand, nand],
    [Unicode.nor, nor],
    [Unicode.converse, converse],
  ]
)

export const functions = new Map<string, Functions>([
  ['lb', lb],
  ['ln', ln],
  ['lg', lg],
  ['acosh', acosh],
  ['asinh', asinh],
  ['atanh', atanh],
  ['asech', asech],
  ['acsch', acsch],
  ['acoth', acoth],
  ['acos', acos],
  ['asin', asin],
  ['atan', atan],
  ['asec', asec],
  ['acsc', acsc],
  ['acot', acot],
  ['cosh', cosh],
  ['sinh', sinh],
  ['tanh', tanh],
  ['sech', sech],
  ['csch', csch],
  ['coth', coth],
  ['cos', cos],
  ['sin', sin],
  ['tan', tan],
  ['sec', sec],
  ['csc', csc],
  ['cot', cot],
  ['abs', abs],
  [Unicode.gamma, gamma],
  [Unicode.squareRoot, sqrt]
])

export {
  equals, notEquals, lessThan, greaterThan,
  lessThanEquals, greaterThanEquals,
  not, and, or, xor, implies, nand, nor, xnor, converse,
  lb, ln, lg, cos, sin, tan, sec, csc, cot,
  acos, asin, atan, asec, acsc, acot,
  cosh, sinh, tanh, sech, csch, coth,
  acosh, asinh, atanh, asech, acsch, acoth,
  gamma, abs
}

export { factorial } from './factorial'
export { polygamma, digamma } from './polygamma'
export { permute, combine } from './combinatorics'
