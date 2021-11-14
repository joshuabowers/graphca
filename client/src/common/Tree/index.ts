import { 
  Addition, Subtraction, Multiplication, Division, Exponential, 
  add, subtract, multiply, divide, raise 
} from './Binary'
import { Complex, Real } from './Constant'

export type { Node } from './Node'
export type { Expression } from './Expression'
export {
  Binary, Addition, Subtraction, Multiplication, Division, Exponential,
  binary, add, subtract, multiply, divide, raise
} from './Binary'
export {
  Field, Complex, Real,
  field, complex, real
} from './Constant'

export type Tree =
| Addition
| Subtraction
| Multiplication
| Division
| Exponential
| Complex
| Real

type Additive = typeof add | typeof subtract
type Multiplicative = typeof multiply | typeof divide
type Operator = Additive | Multiplicative

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
