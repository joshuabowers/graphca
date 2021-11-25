import { method, multi, Multi } from '@arrows/multimethod'
import { Base, Real, Complex, Variable, Unary, Binary } from './Expression'

const equalsReal = (left: Real, right: Real) => left.value === right.value
const equalsComplex = (left: Complex, right: Complex) => 
  left.a === right.a && left.b === right.b
const equalsVariable = (left: Variable, right: Variable) => 
  left.name === right.name
const equalsBinary = (left: Binary, right: Binary): boolean => 
  left.$kind === right.$kind &&
  equals(left.left, right.left) && equals(left.right, right.right)
const equalsUnary = (left: Unary, right: Unary): boolean =>
  left.$kind === right.$kind && equals(left.expression, right.expression)
const equalsBase = (left: Base, right: Base) => false

export type Equality = Multi
  & typeof equalsReal
  & typeof equalsComplex
  & typeof equalsVariable
  & typeof equalsBinary
  & typeof equalsUnary
  & typeof equalsBase

export const equals: Equality = multi(
  method([Real, Real], equalsReal),
  method([Complex, Complex], equalsComplex),
  method([Variable, Variable], equalsVariable),
  method([Binary, Binary], equalsBinary),
  method([Unary, Unary], equalsUnary),
  method([Base, Base], false)
)
