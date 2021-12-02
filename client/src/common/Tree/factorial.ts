import { method, fromMulti } from '@arrows/multimethod'
import { Base } from './Expression'
import { Real, real } from './real'
import { Complex, complex } from './complex'
import { subtract } from './addition'
import { multiply } from './multiplication'
import { Unary, unary } from './unary'

const isNotInteger = (r: Real) => !Number.isInteger(r.value)
const isNonPositive = (r: Real) => r.value < 0
const isInvalidReal = (r: Base) => r instanceof Real 
  && (isNonPositive(r) || isNotInteger(r))
const isInvalidComplex = (c: Base) => c instanceof Complex 
  && (c.b !== 0 || isInvalidReal(real(c.a)))

export class Factorial extends Unary {
  readonly $kind = 'Factorial'
}  

export const baseFactorial = unary(
  r => multiply(r, factorial(subtract(r, real(1)))),
  c => multiply(c, factorial(subtract(c, real(1)))),
  e => new Factorial(e)
)
export type FactorialFn = typeof baseFactorial
export const factorial: FactorialFn = fromMulti(
  method(isInvalidReal, real(NaN)),
  method(isInvalidComplex, complex(NaN, NaN)),
  method(real(0), real(1)),
  method(complex(0, 0), complex(1, 0))
)(baseFactorial)
