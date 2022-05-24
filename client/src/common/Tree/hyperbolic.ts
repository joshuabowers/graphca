import { real } from './real';
import { complex } from './complex';
import { reciprocal } from './exponentiation';
import { Unary, unary } from "./unary";

export abstract class Hyperbolic extends Unary {}

export class HyperbolicCosine extends Hyperbolic {
  readonly $kind = 'HyperbolicCosine'
}

export class HyperbolicSine extends Hyperbolic {
  readonly $kind = 'HyperbolicSine'
}

export class HyperbolicTangent extends Hyperbolic {
  readonly $kind = 'HyperbolicTangent'
}

export class HyperbolicSecant extends Hyperbolic {
  readonly $kind = 'HyperbolicSecant'
}

export class HyperbolicCosecant extends Hyperbolic {
  readonly $kind = 'HyperbolicCosecant'
}

export class HyperbolicCotangent extends Hyperbolic {
  readonly $kind = 'HyperbolicCotangent'
}

export const cosh = unary(HyperbolicCosine)(
  r => real(Math.cosh(r.value)),
  c => complex(
    Math.cosh(c.a) * Math.cos(c.b),
    Math.sinh(c.a) * Math.sin(c.b)
  )
)
export type CoshFn = typeof cosh

export const sinh = unary(HyperbolicSine)(
  r => real(Math.sinh(r.value)),
  c => complex(
    Math.sinh(c.a) * Math.cos(c.b),
    Math.cosh(c.a) * Math.sin(c.b)
  )
)
export type SinhFn = typeof sinh

export const tanh = unary(HyperbolicTangent)(
  r => real(Math.tanh(r.value)),
  c => {
    const divisor = Math.cosh(2 * c.a) + Math.cos(2 * c.b)
    return complex(
      Math.sinh(2 * c.a) / divisor,
      Math.sin(2 * c.b) / divisor
    )
  }
)
export type TanhFn = typeof sinh

export const sech = unary(HyperbolicSecant)(
  r => reciprocal(cosh(r)),
  c => reciprocal(cosh(c))
)
export type SechFn = typeof sinh

export const csch = unary(HyperbolicCosecant)(
  r => reciprocal(sinh(r)),
  c => reciprocal(sinh(c))
)
export type CschFn = typeof sinh

export const coth = unary(HyperbolicCotangent)(
  r => reciprocal(tanh(r)),
  c => reciprocal(tanh(c))
)
export type CothFn = typeof sinh
