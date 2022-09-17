import { unit } from "../monads/writer"
import { Genera, Species, isGenus } from "../utility/tree"
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

const i = complex([0, 1])
const halfPi = real(Math.PI/2)

export const [acos, isArcusCosine, $acos] = unary<ArcusCosine>(Species.acos, Genera.arcus)(
  r => [real(Math.acos(r.value)), 'computed real arcus cosine'],
  c => [subtract(halfPi, asin(unit(c))), 'computed complex arcus cosine'],
  b => [b, 'computed boolean arcus cosine']
)()

export const [asin, isArcusSine, $asin] = unary<ArcusSine>(Species.asin, Genera.arcus)(
  r => [real(Math.asin(r.value)), 'computed real arcus sine'],
  c => {
    const iz = multiply(i, unit(c))
    const distance = sqrt(subtract(real(1), square(unit(c))))
    return [
      multiply(i, ln(subtract(distance, iz))), 
      'computed complex arcus sine'
    ]
  },
  b => [b, 'computed boolean arcus sine']
)()

export const [atan, isArcusTangent, $atan] = unary<ArcusTangent>(Species.atan, Genera.arcus)(
  r => [real(Math.atan(r.value)), 'computed real arcus tangent'],
  c => {
    const nHalfI = complex([0, -0.5])
    const inz = subtract(i, unit(c))
    const ipz = add(i, unit(c))
    const ratio = divide(inz, ipz)
    return [multiply(nHalfI, ln(ratio)), 'computed complex arcus tangent']
  },
  b => [b, 'computed boolean arcus tangent']
)()

export const [asec, isArcusSecant, $asec] = unary<ArcusSecant>(Species.asec, Genera.arcus)(
  c => [acos(reciprocal(unit(c))), 'computed real arcus secant'],
  r => [acos(reciprocal(unit(r))), 'computed complex arcus secant'],
  b => [acos(reciprocal(unit(b))), 'computed boolean arcus secant']
)()

export const [acsc, isArcusCosecant, $acsc] = unary<ArcusCosecant>(Species.acsc, Genera.arcus)(
  r => [asin(reciprocal(unit(r))), 'computed real arcus cosecant'],
  c => [asin(reciprocal(unit(c))), 'computed complex arcus cosecant'],
  b => [asin(reciprocal(unit(b))), 'computed boolean arcus cosecant']
)()

export const [acot, isArcusCotangent, $acot] = unary<ArcusCotangent>(Species.acot, Genera.arcus)(
  r => [subtract(halfPi, atan(unit(r))), 'computed real arcus cotangent'],
  c => [atan(reciprocal(unit(c))), 'computed complex arcus cotangent'],
  b => [
    boolean(subtract(halfPi, atan(unit(b)))), 
    'computed boolean arcus cotangent'
  ]
)()
