import { real } from './real'
import { complex } from './complex'
import { add, subtract } from './addition'
import { multiply, divide } from './multiplication'
import { reciprocal, square, sqrt } from './exponentiation'
import { ln } from './logarithmic'
import { Unary, unary } from './unary'

export abstract class Arcus extends Unary {}

export class ArcusCosine extends Arcus {
  readonly $kind = 'ArcusCosine'
}

export class ArcusSine extends Arcus {
  readonly $kind = 'ArcusSine'
}

export class ArcusTangent extends Arcus {
  readonly $kind = 'ArcusTangent'
}

export class ArcusSecant extends Arcus {
  readonly $kind = 'ArcusSecant'
}

export class ArcusCosecant extends Arcus {
  readonly $kind = 'ArcusCosecant'
}

export class ArcusCotangent extends Arcus {
  readonly $kind = 'ArcusCotangent'
}

const i = complex(0, 1)
const halfPi = real(Math.PI/2)

export const acos = unary(
  r => real(Math.acos(r.value)),
  c => subtract(halfPi, asin(c)),
  e => new ArcusCosine(e)
)
export const AcosFn = typeof acos

export const asin = unary(
  r => real(Math.asin(r.value)),
  c => {
    const iz = multiply(i, c)
    const distance = sqrt(subtract(real(1), square(c)))
    return multiply(i, ln(subtract(distance, iz)))
  },
  e => new ArcusSine(e)
)
export const AsinFn = typeof asin

export const atan = unary(
  r => real(Math.atan(r.value)),
  c => {
    const nHalfI = complex(0, -0.5)
    const inz = subtract(i, c)
    const ipz = add(i, c)
    const ratio = divide(inz, ipz)
    return multiply(nHalfI, ln(ratio))
  },
  e => new ArcusTangent(e)
)
export const AtanFn = typeof atan

export const asec = unary(
  r => acos(reciprocal(r)),
  c => acos(reciprocal(c)),
  e => new ArcusSecant(e)
)
export const AsecFn = typeof asec

export const acsc = unary(
  r => asin(reciprocal(r)),
  c => asin(reciprocal(c)),
  e => new ArcusCosecant(e)
)
export const AcscFn = typeof acsc

export const acot = unary(
  r => subtract(halfPi, atan(r)),
  c => atan(reciprocal(c)),
  e => new ArcusCotangent(e)
)
export const AcotFn = typeof acot
