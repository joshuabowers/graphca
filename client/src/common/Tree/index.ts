import { 
  Addition, Subtraction, Multiplication, Division, Exponentiation,
  add, subtract, multiply, divide, raise
} from './Binary'
import { 
  Unary,
  Negation, Cosine, Sine, Tangent,
  BinaryLogarithm, NaturalLogarithm, CommonLogarithm,
  lb, ln, lg,
  cos, sin, tan
} from './Unary'
import { Complex, Real } from './Constant'
import { Variable } from './Variable'

export type { Node } from './Node'
export { Kind } from './Kind'
export type { Expression } from './Expression'
export {
  Binary, Addition, Subtraction, Multiplication, Division, Exponentiation,
  binary, add, subtract, multiply, divide, raise
} from './Binary'
export {
  Unary, Negation, BinaryLogarithm, NaturalLogarithm, CommonLogarithm,
  Cosine, Sine, Tangent,
  unary, negate, lb, ln, lg,
  cos, sin, tan
} from './Unary'
export type { Logarithm } from './Unary'
export {
  Field, Complex, Real,
  field, complex, real
} from './Constant'
export { 
  Variable, variable
} from './Variable'

export type Tree =
| Real
| Complex
| Variable
| Addition
| Subtraction
| Multiplication
| Division
| Exponentiation
| Negation
| BinaryLogarithm
| NaturalLogarithm
| CommonLogarithm
| Cosine
| Sine
| Tangent

type Additive = typeof add | typeof subtract
type Multiplicative = typeof multiply | typeof divide
type Operator = Additive | Multiplicative

type Logarithmic = typeof lb | typeof ln | typeof lg
type Trigonometric = typeof cos | typeof sin | typeof tan
type Functions = Logarithmic | Trigonometric

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
  [Cosine.function, cos],
  [Sine.function, sin],
  [Tangent.function, tan]
])
