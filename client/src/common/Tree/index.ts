import { Unicode } from '../MathSymbols'
import { Base } from './Expression'
import { Unary } from './unary'
import { Binary } from './binary'
import { Real, real } from './real'
import { Complex, complex } from './complex'
import { Boolean, bool } from './boolean'
import { Nil, nil } from './nil'
import { Variable, variable, assign } from './variable'
import { Addition, add, subtract } from './addition'
import { Multiplication, multiply, double, negate, divide } from './multiplication'
import { Exponentiation, raise, square, sqrt, reciprocal } from './exponentiation'
import { AbsoluteValue, abs } from './absolute'
import {
  Trigonometric,
  Cosine, Sine, Tangent, Secant, Cosecant, Cotangent,
  cos, sin, tan, sec, csc, cot
} from './trigonometric'
import {
  Arcus,
  ArcusCosine, ArcusSine, ArcusTangent,
  ArcusSecant, ArcusCosecant, ArcusCotangent,
  acos, asin, atan, asec, acsc, acot
} from './arcus'
import {
  Hyperbolic,
  HyperbolicCosine, HyperbolicSine, HyperbolicTangent,
  HyperbolicSecant, HyperbolicCosecant, HyperbolicCotangent,
  cosh, sinh, tanh, sech, csch, coth
} from './hyperbolic'
import { 
  AreaHyperbolic,
  AreaHyperbolicCosine, AreaHyperbolicSine, AreaHyperbolicTangent,
  AreaHyperbolicSecant, AreaHyperbolicCosecant, AreaHyperbolicCotangent,
  acosh, asinh, atanh, asech, acsch, acoth
} from './areaHyperbolic'
import { Logarithm, log, lb, ln, lg } from './logarithmic'
import { Factorial, factorial } from './factorial'
import { Gamma, gamma } from './gamma'
import { Polygamma, polygamma, digamma } from './polygamma'
import { Permutation, Combination, permute, combine } from './combinatorics'
import { Derivative, differentiate } from './differentiation'
import { invoke } from './invocation'
import { stringify } from './stringify'
import { LogicalComplement, not } from './logicalComplement'
import {
  Equals, NotEquals, LessThan, GreaterThan, LessThanEquals, GreaterThanEquals,
  equals, notEquals, lessThan, greaterThan, lessThanEquals, greaterThanEquals
} from './inequality'

export { 
  Base, Unary, Binary, Real, Complex, Boolean, Nil, Variable,
  Addition, Multiplication, Exponentiation, AbsoluteValue,
  Trigonometric, Arcus, Hyperbolic, AreaHyperbolic,
  Cosine, Sine, Tangent, Secant, Cosecant, Cotangent,
  ArcusCosine, ArcusSine, ArcusTangent,
  ArcusSecant, ArcusCosecant, ArcusCotangent,
  HyperbolicCosine, HyperbolicSine, HyperbolicTangent,
  HyperbolicSecant, HyperbolicCosecant, HyperbolicCotangent,
  AreaHyperbolicCosine, AreaHyperbolicSine, AreaHyperbolicTangent,
  AreaHyperbolicSecant, AreaHyperbolicCosecant, AreaHyperbolicCotangent,
  Logarithm, Factorial, Gamma, Polygamma, Permutation, Combination,
  Derivative, LogicalComplement,
  Equals, NotEquals, LessThan, GreaterThan, LessThanEquals, GreaterThanEquals
}
export {
  real, complex, bool, nil, variable, assign,
  add, subtract, multiply, divide, raise, abs,
  double, negate, square, sqrt, reciprocal,
  cos, sin, tan, sec, csc, cot,
  acos, asin, atan, asec, acsc, acot,
  cosh, sinh, tanh, sech, csch, coth,
  acosh, asinh, atanh, asech, acsch, acoth,
  log, lb, ln, lg, factorial, gamma, polygamma, digamma,
  permute, combine, differentiate, invoke, stringify,
  not, equals, notEquals, lessThan, greaterThan, lessThanEquals, greaterThanEquals
}

type Inequality = 
| typeof equals | typeof notEquals
| typeof lessThan | typeof greaterThan 
| typeof lessThanEquals | typeof greaterThanEquals
type Additive = typeof add | typeof subtract
type Multiplicative = typeof multiply | typeof divide
type Operator = Inequality | Additive | Multiplicative

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

const coalesce = <T>(...ops: [string, T][][]) => ops.flat()

export const inequality = new Map<string, Inequality>(
  [
    ['==', equals],
    ['!=', notEquals],
    ['<=', lessThanEquals],
    ['>=', greaterThanEquals],
    ['<', lessThan],
    ['>', greaterThan]
  ]
)

export const additive = new Map<string, Additive>(
  coalesce(
    ['+'].map(op => [op, add]),
    [Unicode.minus, '-'].map(op => [op, subtract])
  )
)

export const multiplicative = new Map<string, Multiplicative>(
  coalesce(
    [Unicode.multiplication, '*'].map(op => [op, multiply]),
    [Unicode.division, '/'].map(op => [op, divide])
  )
)

export const operators = new Map<string, Operator>()
for(const [op, func] of inequality){
  operators.set(op, func)
}
for(const [op, func] of additive){
  operators.set(op, func)
}
for(const [op, func] of multiplicative){
  operators.set(op, func)
}

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
