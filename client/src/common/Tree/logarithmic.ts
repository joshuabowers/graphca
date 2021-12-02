import { method, multi, Multi, _ } from '@arrows/multimethod'
import { Base } from './Expression'
import { Real, real } from './real'
import { Complex, complex } from './complex'
import { Binary } from './binary'
import { divide } from './multiplication'

export class Logarithm extends Binary {
  readonly $kind = 'Logarithm'
}

const lnComplex = (c: Complex) => complex(
  Math.log(Math.hypot(c.a, c.b)),
  Math.atan2(c.b, c.a)
)

const logReal = (base: Real, expression: Real) => real(Math.log(expression.value) / Math.log(base.value))
const logComplex = (base: Complex, expression: Complex) => {
  const n = lnComplex(expression)
  if(base.a === Math.E && base.b === 0){ return n }
  return divide(lnComplex(expression), lnComplex(base))
}
const logRC = (base: Real, expression: Complex) => log(complex(base.value, 0), expression)
const logCR = (base: Complex, expression: Real) => log(base, complex(expression.value, 0))
const logBase = (base: Base, expression: Base) => new Logarithm(base, expression)

export type Log = Multi
  & typeof logReal
  & typeof logComplex
  & typeof logRC
  & typeof logCR
  & typeof logBase

export const log: Log = multi(
  method([Real, Real], logReal),
  method([Complex, Complex], logComplex),
  method([Real, Complex], logRC),
  method([Complex, Real], logCR),
  method([Base, Base], logBase)
)

function unary(base: Real) {
  type Unary = Multi
    & ((expression: Real) => Real)
    & ((expression: Complex) => Complex)
    & ((expression: Base) => Logarithm)
  return multi(
    method(Base, (expression: Base) => log(base, expression))
  ) as Unary
}

export const lb = unary(real(2))
export const ln = unary(real(Math.E))
export const lg = unary(real(10))
