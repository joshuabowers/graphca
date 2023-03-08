import { Genera, Species, Notation, isGenus } from "../utility/tree"
import { real, complex, boolean } from "../primitives"
import { UnaryNode, unary } from "../closures/unary"
import { 
  add, subtract, multiply, divide, reciprocal, square, sqrt 
} from "../arithmetic"
import { ln } from "./logarithmic"

export type ArcusNode = UnaryNode & {
  readonly genus: Genera.arcus
}

export const isArcus = isGenus<ArcusNode>(Genera.arcus)

type Arcus<S extends Species> = ArcusNode & {
  readonly species: S
}

export type ArcusSine = Arcus<Species.asin>
export type ArcusCosine = Arcus<Species.acos>
export type ArcusTangent = Arcus<Species.atan>
export type ArcusCosecant = Arcus<Species.acsc>
export type ArcusSecant = Arcus<Species.asec>
export type ArcusCotangent = Arcus<Species.acot>

const i = complex(0, 1)
const halfPi = real(Math.PI/2)

export const [acos, isArcusCosine, $acos] = unary<ArcusCosine>(
  'acos', Notation.prefix, Species.acos, Genera.arcus
)(
  r => real(Math.acos(r.value.raw)),
  c => subtract(halfPi, asin(c)), 
  b => b,
)()

export const [asin, isArcusSine, $asin] = unary<ArcusSine>(
  'asin', Notation.prefix, Species.asin, Genera.arcus
)(
  r => real(Math.asin(r.value.raw)),
  c => {
    const iz = multiply(i, c)
    const distance = sqrt(subtract(real(1), square(c)))
    return multiply(i, ln(subtract(distance, iz)))
  },
  b => b, 
)()

export const [atan, isArcusTangent, $atan] = unary<ArcusTangent>(
  'atan', Notation.prefix, Species.atan, Genera.arcus
)(
  r => real(Math.atan(r.value.raw)),
  c => {
    const nHalfI = complex(0, -0.5)
    const inz = subtract(i, c)
    const ipz = add(i, c)
    const ratio = divide(inz, ipz)
    return multiply(nHalfI, ln(ratio))
  },
  b => b
)()

export const [asec, isArcusSecant, $asec] = unary<ArcusSecant>(
  'asec', Notation.prefix, Species.asec, Genera.arcus
)(
  r => acos(reciprocal(r)),
  c => acos(reciprocal(c)),
  b => acos(reciprocal(b))
)()

export const [acsc, isArcusCosecant, $acsc] = unary<ArcusCosecant>(
  'acsc', Notation.prefix, Species.acsc, Genera.arcus
)(
  r => asin(reciprocal(r)),
  c => asin(reciprocal(c)),
  b => asin(reciprocal(b))
)()

export const [acot, isArcusCotangent, $acot] = unary<ArcusCotangent>(
  'acot', Notation.prefix, Species.acot, Genera.arcus
)(
  r => subtract(halfPi, atan(r)), 
  c => subtract(halfPi, atan(c)), // atan(reciprocal(unit(c))), 
  b => boolean(subtract(halfPi, atan(b))), 
)()
