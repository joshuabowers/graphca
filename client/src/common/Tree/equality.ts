import { method, multi, Multi } from '@arrows/multimethod'
import { is } from './is'
import { Base } from './Expression'
import { Real } from './real'
import { Complex } from './complex'
import { Variable } from './variable'
import { Unary } from './unary'
import { Binary } from './binary'

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
  method([is(Real), is(Real)], equalsReal),
  method([is(Complex), is(Complex)], equalsComplex),
  method([is(Variable), is(Variable)], equalsVariable),
  method([is(Binary), is(Binary)], equalsBinary),
  method([is(Unary), is(Unary)], equalsUnary),
  method([is(Base), is(Base)], false)
)
