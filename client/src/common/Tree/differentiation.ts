import { method, multi, Multi } from '@arrows/multimethod'
import { 
  Base, Real, Complex, Variable, Addition, Multiplication, Exponentiation
} from './Expression'
import { real } from './real'
import { complex } from './complex'
import { add } from './addition'
import { multiply, divide } from './multiplication'
import { ln } from './logarithmic'

const chain = (derivative: Base, argument: Base) =>
  multiply(derivative, differentiate(argument))

const whenReal = (expression: Real) => real(0)
const whenComplex = (expression: Complex) => complex(0, 0)
const whenVariable = (expression: Variable) => real(1)
const whenAddition = (expression: Addition) =>
  add(differentiate(expression.left), differentiate(expression.right))
const whenMultiplication = (expression: Multiplication) =>
  add(
    multiply(differentiate(expression.left), expression.right),
    multiply(expression.left, differentiate(expression.right))
  )
const whenExponentiation = (expression: Exponentiation) =>
  multiply(
    expression,
    add(
      multiply(
        differentiate(expression.left),
        divide(expression.right, expression.left)
      ),
      multiply(
        differentiate(expression.right),
        ln(expression.left)
      )
    )
  )
const whenBase = (expression: Base) => expression

export type DifferentiateFn = Multi
  & typeof whenReal & typeof whenComplex & typeof whenVariable
  & typeof whenAddition & typeof whenMultiplication 
  & typeof whenExponentiation
  & typeof whenBase

export const differentiate: DifferentiateFn = multi(
  method(Real, whenReal),
  method(Complex, whenComplex),
  method(Variable, whenVariable),
  method(Addition, whenAddition),
  method(Multiplication, whenMultiplication),
  method(Exponentiation, whenExponentiation)
  // method(Base, whenBase)
)
