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

export const cosh = unary(
  r => real(Math.cosh(r.value)),
  c => complex(
    Math.cosh(c.a) * Math.cos(c.b),
    Math.sinh(c.a) * Math.sin(c.b)
  ),
  e => new HyperbolicCosine(e)
)
export type CoshFn = typeof cosh

export const sinh = unary(
  r => real(Math.sinh(r.value)),
  c => complex(
    Math.sinh(c.a) * Math.cos(c.b),
    Math.cosh(c.a) * Math.sin(c.b)
  ),
  e => new HyperbolicSine(e)
)
export type SinhFn = typeof sinh

export const tanh = unary(
  r => real(Math.tanh(r.value)),
  c => {
    const divisor = Math.cosh(2 * c.a) + Math.cos(2 * c.b)
    return complex(
      Math.sinh(2 * c.a) / divisor,
      Math.sin(2 * c.b) / divisor
    )
  },
  e => new HyperbolicTangent(e)
)
export type TanhFn = typeof sinh

export const sech = unary(
  r => reciprocal(cosh(r)),
  c => reciprocal(cosh(c)),
  e => new HyperbolicSecant(e)
)
export type SechFn = typeof sinh

export const csch = unary(
  r => reciprocal(sinh(r)),
  c => reciprocal(sinh(c)),
  e => new HyperbolicCosecant(e)
)
export type CschFn = typeof sinh

export const coth = unary(
  r => reciprocal(tanh(r)),
  c => reciprocal(tanh(c)),
  e => new HyperbolicCotangent(e)
)
export type CothFn = typeof sinh
