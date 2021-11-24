import {
  AreaHyperbolicCosine, AreaHyperbolicSine, AreaHyperbolicTangent,
  AreaHyperbolicSecant, AreaHyperbolicCosecant, AreaHyperbolicCotangent
} from './Expression'
import { real } from './real'
import { complex } from './complex'
import { add, subtract } from './addition'
import { multiply, divide } from './multiplication'
import { reciprocal, square, sqrt } from './exponentiation'
import { ln } from './logarithmic'
import { unary } from './unary'

export const acosh = unary(
  r => real(Math.acosh(r.value)),
  c => ln(add(
    c, 
    multiply(
      sqrt(add(c, real(1))),
      sqrt(subtract(c, real(1)))
    )
  )),
  e => new AreaHyperbolicCosine(e)
)
export type AcoshFn = typeof acosh

export const asinh = unary(
  r => real(Math.asinh(r.value)),
  c => ln(add(
    sqrt(add(square(c), real(1))),
    c
  )),
  e => new AreaHyperbolicSine(e)
)
export type AsinhFn = typeof asinh

export const atanh = unary(
  r => real(Math.atanh(r.value)),
  c => multiply(
    real(0.5),
    ln(divide(
      add(real(1), c),
      subtract(real(1), c)
    ))
  ),
  e => new AreaHyperbolicTangent(e)
)
export type AtanhFn = typeof atanh

export const asech = unary(
  r => acosh(reciprocal(r)),
  c => acosh(reciprocal(c)),
  e => new AreaHyperbolicSecant(e)
)
export type AsechFn = typeof asech

export const acsch = unary(
  r => asinh(reciprocal(r)),
  c => asinh(reciprocal(c)),
  e => new AreaHyperbolicCosecant(e)
)
export type AcschFn = typeof acsch

export const acoth = unary(
  r => atanh(reciprocal(r)),
  c => atanh(reciprocal(c)),
  e => new AreaHyperbolicCotangent(e)
)
export type AcothFn = typeof acoth
