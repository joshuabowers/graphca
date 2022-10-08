import { unit } from "../monads/writer"
import { Genera, Species, Notation, isGenus } from "../utility/tree"
import { real, complex, boolean } from "../primitives"
import { UnaryNode, unary, unaryFnRule } from "../closures/unary"
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

export const acosRule = unaryFnRule('acos')
export const asinRule = unaryFnRule('asin')
export const atanRule = unaryFnRule('atan')
export const asecRule = unaryFnRule('asec')
export const acscRule = unaryFnRule('acsc')
export const acotRule = unaryFnRule('acot')

const i = complex([0, 1])
const halfPi = real(Math.PI/2)

export const [acos, isArcusCosine, $acos] = unary<ArcusCosine>(
  'acos', Notation.prefix, Species.acos, Genera.arcus
)(
  r => [real(Math.acos(r.value)), acosRule(r), 'computed real arcus cosine'],
  c => [subtract(halfPi, asin(unit(c))), acosRule(c), 'computed complex arcus cosine'],
  b => [b, acosRule(b), 'computed boolean arcus cosine']
)()

export const [asin, isArcusSine, $asin] = unary<ArcusSine>(
  'asin', Notation.prefix, Species.asin, Genera.arcus
)(
  r => [real(Math.asin(r.value)), asinRule(r), 'computed real arcus sine'],
  c => {
    const iz = multiply(i, unit(c))
    const distance = sqrt(subtract(real(1), square(unit(c))))
    return [
      multiply(i, ln(subtract(distance, iz))),
      asinRule(c), 
      'computed complex arcus sine'
    ]
  },
  b => [b, asinRule(b), 'computed boolean arcus sine']
)()

export const [atan, isArcusTangent, $atan] = unary<ArcusTangent>(
  'atan', Notation.prefix, Species.atan, Genera.arcus
)(
  r => [real(Math.atan(r.value)), atanRule(r), 'computed real arcus tangent'],
  c => {
    const nHalfI = complex([0, -0.5])
    const inz = subtract(i, unit(c))
    const ipz = add(i, unit(c))
    const ratio = divide(inz, ipz)
    return [multiply(nHalfI, ln(ratio)), atanRule(c), 'computed complex arcus tangent']
  },
  b => [b, atanRule(b), 'computed boolean arcus tangent']
)()

export const [asec, isArcusSecant, $asec] = unary<ArcusSecant>(
  'asec', Notation.prefix, Species.asec, Genera.arcus
)(
  r => [acos(reciprocal(unit(r))), asecRule(r), 'computed complex arcus secant'],
  c => [acos(reciprocal(unit(c))), asecRule(c), 'computed real arcus secant'],
  b => [acos(reciprocal(unit(b))), asecRule(b), 'computed boolean arcus secant']
)()

export const [acsc, isArcusCosecant, $acsc] = unary<ArcusCosecant>(
  'acsc', Notation.prefix, Species.acsc, Genera.arcus
)(
  r => [asin(reciprocal(unit(r))), acscRule(r), 'computed real arcus cosecant'],
  c => [asin(reciprocal(unit(c))), acscRule(c), 'computed complex arcus cosecant'],
  b => [asin(reciprocal(unit(b))), acscRule(b), 'computed boolean arcus cosecant']
)()

export const [acot, isArcusCotangent, $acot] = unary<ArcusCotangent>(
  'acot', Notation.prefix, Species.acot, Genera.arcus
)(
  r => [subtract(halfPi, atan(unit(r))), acotRule(r), 'computed real arcus cotangent'],
  c => [atan(reciprocal(unit(c))), acotRule(c), 'computed complex arcus cotangent'],
  b => [
    boolean(subtract(halfPi, atan(unit(b)))), 
    acotRule(b),
    'computed boolean arcus cotangent'
  ]
)()
