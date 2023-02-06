import { unit } from "../monads/writer"
import { Genera, Species, Notation, isGenus } from "../utility/tree"
import { real, complex, boolean } from "../primitives"
import { UnaryNode, unary } from "../closures/unary"
import { 
  add, subtract, multiply, divide, reciprocal, square, sqrt 
} from "../arithmetic"
import { ln } from "./logarithmic"
import { rule } from "../utility/rule"
import { Unicode } from "../Unicode"

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

// export const acosRule = unaryFnRule('acos')
// export const asinRule = unaryFnRule('asin')
// export const atanRule = unaryFnRule('atan')
// export const asecRule = unaryFnRule('asec')
// export const acscRule = unaryFnRule('acsc')
// export const acotRule = unaryFnRule('acot')

const i = complex([0, 1])
const halfPi = real(Math.PI/2)

export const [acos, isArcusCosine, $acos] = unary<ArcusCosine>(
  'acos', Notation.prefix, Species.acos, Genera.arcus
)(
  r => real(Math.acos(r.value)),
  c => subtract(halfPi, asin(unit(c))), 
  b => unit(b),
)()

export const [asin, isArcusSine, $asin] = unary<ArcusSine>(
  'asin', Notation.prefix, Species.asin, Genera.arcus
)(
  r => real(Math.asin(r.value)),
  c => {
    const iz = multiply(i, unit(c))
    const distance = sqrt(subtract(real(1), square(unit(c))))
    return multiply(i, ln(subtract(distance, iz)))
  },
  b => unit(b), 
)()

export const [atan, isArcusTangent, $atan] = unary<ArcusTangent>(
  'atan', Notation.prefix, Species.atan, Genera.arcus
)(
  r => real(Math.atan(r.value)),
  c => {
    const nHalfI = complex([0, -0.5])
    const inz = subtract(i, unit(c))
    const ipz = add(i, unit(c))
    const ratio = divide(inz, ipz)
    return multiply(nHalfI, ln(ratio))
  },
  b => unit(b)
)()

export const [asec, isArcusSecant, $asec] = unary<ArcusSecant>(
  'asec', Notation.prefix, Species.asec, Genera.arcus,
  // t => rule`acos(${t} ^ -1)`
)(
  r => acos(reciprocal(unit(r))),
  c => acos(reciprocal(unit(c))),
  b => acos(reciprocal(unit(b)))
)()

export const [acsc, isArcusCosecant, $acsc] = unary<ArcusCosecant>(
  'acsc', Notation.prefix, Species.acsc, Genera.arcus,
  // t => rule`asin(${t} ^ -1)`
)(
  r => asin(reciprocal(unit(r))),
  c => asin(reciprocal(unit(c))),
  b => asin(reciprocal(unit(b)))
)()

export const [acot, isArcusCotangent, $acot] = unary<ArcusCotangent>(
  'acot', Notation.prefix, Species.acot, Genera.arcus,
  // t => rule`(${Unicode.pi} / 2) - atan(${t})`
)(
  r => subtract(halfPi, atan(unit(r))), 
  c => subtract(halfPi, atan(unit(c))), // atan(reciprocal(unit(c))), 
  b => boolean(subtract(halfPi, atan(unit(b)))), 
)()
