import { real } from './real'
import { add, subtract } from './addition'
import { multiply, divide } from './multiplication'
import { reciprocal, square, sqrt } from './exponentiation'
import { ln } from './logarithmic'
import { Unary, unary } from './unary'

export abstract class AreaHyperbolic extends Unary {}

export class AreaHyperbolicCosine extends AreaHyperbolic {
  readonly $kind = 'AreaHyperbolicCosine'
}

export class AreaHyperbolicSine extends AreaHyperbolic {
  readonly $kind = 'AreaHyperbolicSine'
}

export class AreaHyperbolicTangent extends AreaHyperbolic {
  readonly $kind = 'AreaHyperbolicTangent'
}

export class AreaHyperbolicSecant extends AreaHyperbolic {
  readonly $kind = 'AreaHyperbolicSecant'
}

export class AreaHyperbolicCosecant extends AreaHyperbolic {
  readonly $kind = 'AreaHyperbolicCosecant'
}

export class AreaHyperbolicCotangent extends AreaHyperbolic {
  readonly $kind = 'AreaHyperbolicCotangent'
}

export const acosh = unary(AreaHyperbolicCosine)(
  r => real(Math.acosh(r.value)),
  c => ln(add(
    c, 
    multiply(
      sqrt(add(c, real(1))),
      sqrt(subtract(c, real(1)))
    )
  ))
)()
export type AcoshFn = typeof acosh

export const asinh = unary(AreaHyperbolicSine)(
  r => real(Math.asinh(r.value)),
  c => ln(add(
    sqrt(add(square(c), real(1))),
    c
  ))
)()
export type AsinhFn = typeof asinh

export const atanh = unary(AreaHyperbolicTangent)(
  r => real(Math.atanh(r.value)),
  c => multiply(
    real(0.5),
    ln(divide(
      add(real(1), c),
      subtract(real(1), c)
    ))
  )
)()
export type AtanhFn = typeof atanh

export const asech = unary(AreaHyperbolicSecant)(
  r => acosh(reciprocal(r)),
  c => acosh(reciprocal(c))
)()
export type AsechFn = typeof asech

export const acsch = unary(AreaHyperbolicCosecant)(
  r => asinh(reciprocal(r)),
  c => asinh(reciprocal(c))
)()
export type AcschFn = typeof acsch

export const acoth = unary(AreaHyperbolicCotangent)(
  r => atanh(reciprocal(r)),
  c => atanh(reciprocal(c))
)()
export type AcothFn = typeof acoth
