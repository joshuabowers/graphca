import { 
  Addition, Subtraction, Multiplication, Division, 
  add, subtract, multiply, divide
} from './Binary'
import {
  AbsoluteValue,
  Cosine, Sine, Tangent,
  ArcusCosine, ArcusSine, ArcusTangent,
  HyperbolicCosine, HyperbolicSine, HyperbolicTangent,
  AreaHyperbolicCosine, AreaHyperbolicSine, AreaHyperbolicTangent,
  BinaryLogarithm, NaturalLogarithm, CommonLogarithm,
  Gamma, Polygamma,
  abs,
  lb, ln, lg,
  cos, sin, tan,
  acos, asin, atan,
  cosh, sinh, tanh,
  acosh, asinh, atanh,
  gamma, polygamma
} from './Unary'

export type { Node } from './Node'
export { Kind } from './Kind'
export type { Expression } from './Expression'
export {
  Binary, Addition, Subtraction, Multiplication, Division, Exponentiation,
  binary, add, subtract, multiply, divide, raise
} from './Binary'
export {
  Unary, 
  Negation, AbsoluteValue,
  BinaryLogarithm, NaturalLogarithm, CommonLogarithm,
  Cosine, Sine, Tangent,
  ArcusCosine, ArcusSine, ArcusTangent,
  HyperbolicCosine, HyperbolicSine, HyperbolicTangent,
  AreaHyperbolicCosine, AreaHyperbolicSine, AreaHyperbolicTangent,
  Factorial, Gamma, Polygamma,
  unary, 
  negate, abs,
  lb, ln, lg,
  cos, sin, tan,
  acos, asin, atan,
  cosh, sinh, tanh,
  acosh, asinh, atanh,
  factorial, gamma, polygamma
} from './Unary'
export type { Logarithm } from './Unary'
export {
  Field, Complex, Real,
  field, complex, real
} from './Constant'
export { 
  Variable, variable
} from './Variable'
export type { Tree } from './Tree'

type Additive = typeof add | typeof subtract
type Multiplicative = typeof multiply | typeof divide
type Operator = Additive | Multiplicative

type Logarithmic = typeof lb | typeof ln | typeof lg
type Trigonometric = typeof cos | typeof sin | typeof tan
type Arcus = typeof acos | typeof asin | typeof atan
type Hyperbolic = typeof cosh | typeof sinh | typeof tanh
type AreaHyperbolic = typeof acosh | typeof asinh | typeof atanh
type FactorialLike = typeof gamma | typeof polygamma
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
  [ArcusCosine.function, acos],
  [ArcusSine.function, asin],
  [ArcusTangent.function, atan],
  [HyperbolicCosine.function, cosh],
  [HyperbolicSine.function, sinh],
  [HyperbolicTangent.function, tanh],
  [Cosine.function, cos],
  [Sine.function, sin],
  [Tangent.function, tan],
  [AbsoluteValue.function, abs],
  [Gamma.function, gamma],
  [Polygamma.function, polygamma]
])
