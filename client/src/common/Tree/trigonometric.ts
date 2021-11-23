import { 
  Cosine, Sine, Tangent, Secant, Cosecant, Cotangent 
} from './Expression'
import { real } from './real'
import { complex } from './complex'
import { reciprocal } from './exponentiation'
import { unary } from './unary'

export const cos = unary(
  r => real(Math.cos(r.value)),
  c => complex(
    Math.cos(c.a) * Math.cosh(c.b),
    -Math.sin(c.a) * Math.sinh(c.b)
  ),
  e => new Cosine(e)
)
export type Cos = typeof cos

export const sin = unary(
  r => real(Math.sin(r.value)),
  c => complex(
    Math.sin(c.a) * Math.cosh(c.b),
    Math.cos(c.a) * Math.sinh(c.b)
  ),
  e => new Sine(e)
)
export type Sin = typeof sin

export const tan = unary(
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

export const sec = unary(
  r => reciprocal(cos(r)),
  c => reciprocal(cos(c)),
  e => new Secant(e)
)
export type Sec = typeof sec

export const csc = unary(
  r => reciprocal(sin(r)),
  c => reciprocal(sin(c)),
  e => new Cosecant(e)
)
export type Csc = typeof csc

export const cot = unary(
  r => reciprocal(tan(r)),
  c => reciprocal(tan(c)),
  e => new Cotangent(e)
)
export type Cot = typeof cot
