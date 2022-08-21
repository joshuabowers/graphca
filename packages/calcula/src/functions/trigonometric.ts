import { real } from './real'
import { complex } from './complex'
import { reciprocal } from './exponentiation'
import { Unary, unary } from './unary'

export abstract class Trigonometric extends Unary {}

export class Cosine extends Trigonometric {
  readonly $kind = 'Cosine'
}

export class Sine extends Trigonometric {
  readonly $kind = 'Sine'
}

export class Tangent extends Trigonometric {
  readonly $kind = 'Tangent'
}

export class Secant extends Trigonometric {
  readonly $kind = 'Secant'
}

export class Cosecant extends Trigonometric {
  readonly $kind = 'Cosecant'
}

export class Cotangent extends Trigonometric {
  readonly $kind = 'Cotangent'
}

export const cos = unary(Cosine)(
  r => real(Math.cos(r.value)),
  c => complex(
    Math.cos(c.a) * Math.cosh(c.b),
    -Math.sin(c.a) * Math.sinh(c.b)
  )
)()
export type Cos = typeof cos

export const sin = unary(Sine)(
  r => real(Math.sin(r.value)),
  c => complex(
    Math.sin(c.a) * Math.cosh(c.b),
    Math.cos(c.a) * Math.sinh(c.b)
  )
)()
export type Sin = typeof sin

export const tan = unary(Tangent)(
  r => real(Math.tan(r.value)),
  c => {
    const divisor = Math.cos(2 * c.a) + Math.cosh(2 * c.b)
    return complex(
      Math.sin(2 * c.a) / divisor,
      Math.sinh(2 * c.b) / divisor    
    )
  }
)()
export type Tan = typeof tan

export const sec = unary(Secant)(
  r => reciprocal(cos(r)),
  c => reciprocal(cos(c))
)()
export type Sec = typeof sec

export const csc = unary(Cosecant)(
  r => reciprocal(sin(r)),
  c => reciprocal(sin(c))
)()
export type Csc = typeof csc

export const cot = unary(Cotangent)(
  r => reciprocal(tan(r)),
  c => reciprocal(tan(c))
)()
export type Cot = typeof cot
