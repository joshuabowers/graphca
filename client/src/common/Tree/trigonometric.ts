import { Base, Real, Complex, Cosine, Sine, Tangent, Secant, Cosecant, Cotangent } from './Expression'
import { real } from './real'
import { complex } from './complex'
import { divide } from './multiplication'
import { method, multi, Multi } from '@arrows/multimethod'

function trigonometric(
  whenReal: (expression: Real) => Real, 
  whenComplex: (expression: Complex) => Complex, 
  otherwise: (expression: Base) => Base
) {
  type TrigFn = Multi & typeof whenReal & typeof whenComplex & typeof otherwise
  const result: TrigFn = multi(
    method(Real, whenReal),
    method(Complex, whenComplex),
    method(Base, otherwise)
  )
  return result
}

export const cos = trigonometric(
  r => real(Math.cos(r.value)),
  c => complex(
    Math.cos(c.a) * Math.cosh(c.b),
    -Math.sin(c.a) * Math.sinh(c.b)
  ),
  e => new Cosine(e)
)
export type Cos = typeof cos

export const sin = trigonometric(
  r => real(Math.sin(r.value)),
  c => complex(
    Math.sin(c.a) * Math.cosh(c.b),
    Math.cos(c.a) * Math.sinh(c.b)
  ),
  e => new Sine(e)
)
export type Sin = typeof sin

export const tan = trigonometric(
  r => real(Math.tan(r.value)),
  c => {
    const divisor = Math.cos(2 * c.a) + Math.cosh(2 * c.b)
    return complex(
      Math.sin(2 * c.a) / divisor,
      Math.sinh(2 * c.b) / divisor    
    )
  },
  e => new Tangent(e)
)
export type Tan = typeof tan

export const sec = trigonometric(
  r => real(1 / Math.cos(r.value)),
  c => divide(real(1), cos(c)),
  e => new Secant(e)
)
export type Sec = typeof sec

export const csc = trigonometric(
  r => real(1 / Math.sin(r.value)),
  c => divide(real(1), sin(c)),
  e => new Cosecant(e)
)
export type Csc = typeof csc

export const cot = trigonometric(
  r => real(1 / Math.tan(r.value)),
  c => divide(real(1), tan(c)),
  e => new Cotangent(e)
)
export type Cot = typeof cot
