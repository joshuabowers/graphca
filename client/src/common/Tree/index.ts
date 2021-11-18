export type { Node } from './Node'
export { Kind } from './Kind'
export type { Expression } from './Expression'
export {
  Binary, 
  Addition, Subtraction, Multiplication, Division, Exponentiation, Assignment,
  binary, 
  add, subtract, multiply, divide, raise, square, sqrt, assign
} from './Binary'
export {
  Unary, 
  Negation, AbsoluteValue,
  BinaryLogarithm, NaturalLogarithm, CommonLogarithm,
  Cosine, Sine, Tangent,
  Secant, Cosecant, Cotangent,
  ArcusCosine, ArcusSine, ArcusTangent,
  ArcusSecant, ArcusCosecant, ArcusCotangent,
  HyperbolicCosine, HyperbolicSine, HyperbolicTangent,
  HyperbolicSecant, HyperbolicCosecant, HyperbolicCotangent,
  AreaHyperbolicCosine, AreaHyperbolicSine, AreaHyperbolicTangent,
  AreaHyperbolicSecant, AreaHyperbolicCosecant, AreaHyperbolicCotangent,
  Factorial, Gamma,
  unary, 
  negate, abs,
  lb, ln, lg,
  cos, sin, tan, sec, csc, cot,
  acos, asin, atan, asec, acsc, acot,
  cosh, sinh, tanh, sech, csch, coth,
  acosh, asinh, atanh, asech, acsch, acoth,
  factorial, gamma
} from './Unary'
export type { Logarithm } from './Unary'
export {
  Field, Complex, Real,
  field, complex, real
} from './Constant'
export { 
  Variable, variable
} from './Variable'
export { Derivative, differentiate } from './Derivative'
export { Invocation, invoke } from './Invocation'
export { Polygamma, polygamma, digamma } from './Polygamma'
export type { Tree } from './Tree'

import { 
  Addition, Subtraction, Multiplication, Division, 
  add, subtract, multiply, divide
} from './Binary'
import {
  AbsoluteValue,
  Cosine, Sine, Tangent,
  Secant, Cosecant, Cotangent,
  ArcusCosine, ArcusSine, ArcusTangent,
  ArcusSecant, ArcusCosecant, ArcusCotangent,
  HyperbolicCosine, HyperbolicSine, HyperbolicTangent,
  HyperbolicSecant, HyperbolicCosecant, HyperbolicCotangent,
  AreaHyperbolicCosine, AreaHyperbolicSine, AreaHyperbolicTangent,
  AreaHyperbolicSecant, AreaHyperbolicCosecant, AreaHyperbolicCotangent,
  BinaryLogarithm, NaturalLogarithm, CommonLogarithm,
  Gamma,
  abs,
  lb, ln, lg,
  cos, sin, tan, sec, csc, cot,
  acos, asin, atan, asec, acsc, acot,
  cosh, sinh, tanh, sech, csch, coth,
  acosh, asinh, atanh, asech, acsch, acoth,
  gamma
} from './Unary'

type Additive = typeof add | typeof subtract
type Multiplicative = typeof multiply | typeof divide
type Operator = Additive | Multiplicative

type Logarithmic = typeof lb | typeof ln | typeof lg
type Trigonometric = 
  | typeof cos | typeof sin | typeof tan
  | typeof sec | typeof csc | typeof cot
type Arcus = 
  | typeof acos | typeof asin | typeof atan
  | typeof asec | typeof acsc | typeof acot
type Hyperbolic = 
  | typeof cosh | typeof sinh | typeof tanh
  | typeof sech | typeof csch | typeof coth
type AreaHyperbolic = 
  | typeof acosh | typeof asinh | typeof atanh
  | typeof asech | typeof acsch | typeof acoth
type FactorialLike = typeof gamma
type Functions = 
| Logarithmic 
| Trigonometric 
| Arcus
| Hyperbolic
| AreaHyperbolic
| FactorialLike
| typeof abs

export const additive = new Map<string, Additive>()
Addition.operators.map((op) => additive.set(op, add))
Subtraction.operators.map((op) => additive.set(op, subtract))

export const multiplicative = new Map<string, Multiplicative>()
Multiplication.operators.map((op) => multiplicative.set(op, multiply))
Division.operators.map((op) => multiplicative.set(op, divide))

export const operators = new Map<string, Operator>()
for(const [op, func] of additive){
  operators.set(op, func)
}
for(const [op, func] of multiplicative){
  operators.set(op, func)
}

export const functions = new Map<string, Functions>([
  [BinaryLogarithm.function, lb],
  [NaturalLogarithm.function, ln],
  [CommonLogarithm.function, lg],
  [AreaHyperbolicCosine.function, acosh],
  [AreaHyperbolicSine.function, asinh],
  [AreaHyperbolicTangent.function, atanh],
  [AreaHyperbolicSecant.function, asech],
  [AreaHyperbolicCosecant.function, acsch],
  [AreaHyperbolicCotangent.function, acoth],
  [ArcusCosine.function, acos],
  [ArcusSine.function, asin],
  [ArcusTangent.function, atan],
  [ArcusSecant.function, asec],
  [ArcusCosecant.function, acsc],
  [ArcusCotangent.function, acot],
  [HyperbolicCosine.function, cosh],
  [HyperbolicSine.function, sinh],
  [HyperbolicTangent.function, tanh],
  [HyperbolicSecant.function, sech],
  [HyperbolicCosecant.function, csch],
  [HyperbolicCotangent.function, coth],
  [Cosine.function, cos],
  [Sine.function, sin],
  [Tangent.function, tan],
  [Secant.function, sec],
  [Cosecant.function, csc],
  [Cotangent.function, cot],
  [AbsoluteValue.function, abs],
  [Gamma.function, gamma],
])
