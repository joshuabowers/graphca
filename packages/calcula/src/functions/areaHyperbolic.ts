import { unit } from "../monads/writer"
import { Genera, Species, isGenus } from "../utility/tree"
import { real, complex, boolean } from "../primitives"
import { UnaryNode, unary } from "../closures/unary"
import { 
  add, subtract, multiply, divide, square, sqrt, reciprocal 
} from "../arithmetic"
import { ln } from "./logarithmic"

export type AreaHyperbolicNode = UnaryNode & {
  readonly genus: Genera.areaHyperbolic
}

export const isAreaHyperbolic = isGenus<AreaHyperbolicNode>(Genera.areaHyperbolic)

type AreaHyperbolic<S extends Species> = AreaHyperbolicNode & {
  readonly species: S
}

export type AreaHyperbolicSine = AreaHyperbolic<Species.asinh>
export type AreaHyperbolicCosine = AreaHyperbolic<Species.acosh>
export type AreaHyperbolicTangent = AreaHyperbolic<Species.atanh>
export type AreaHyperbolicCosecant = AreaHyperbolic<Species.acsch>
export type AreaHyperbolicSecant = AreaHyperbolic<Species.asech>
export type AreaHyperbolicCotangent = AreaHyperbolic<Species.acoth>

export const [acosh, isAreaHyperbolicCosine, $acosh] = unary<AreaHyperbolicCosine>(
  Species.acosh, Genera.areaHyperbolic
)(
  r => [real(Math.acosh(r.value)), 'computed real area hyperbolic cosine'],
  c => [
    ln(add(
      unit(c), 
      multiply(
        sqrt(add(unit(c), real(1))),
        sqrt(subtract(unit(c), real(1)))
      )
    )),
    'computed complex area hyperbolic cosine'
  ],
  b => [b, 'computed boolean area hyperbolic cosine']
)()

export const [asinh, isAreaHyperbolicSine, $asinh] = unary<AreaHyperbolicSine>(
  Species.asinh, Genera.areaHyperbolic
)(
  r => [real(Math.asinh(r.value)), 'computed real area hyperbolic sine'],
  c => [
    ln(add(
      sqrt(add(square(unit(c)), real(1))),
      unit(c)
    )),
    'computed complex area hyperbolic sine'
  ],
  b => [b, 'computed boolean area hyperbolic sine']
)()

export const [atanh, isAreaHyperbolicTangent, $atanh] = unary<AreaHyperbolicTangent>(
  Species.atanh, Genera.areaHyperbolic
)(
  r => [real(Math.atanh(r.value)), 'computed real hyperbolic tangent'],
  c => [
    multiply(
      real(0.5),
      ln(divide(
        add(real(1), unit(c)),
        subtract(real(1), unit(c))
      ))
    ),
    'computed complex area hyperbolic tangent'
  ],
  b => [b, 'computed boolean area hyperbolic tangent']
)()

export const [asech, isAreaHyperbolicSecant, $asech] = unary<AreaHyperbolicSecant>(
  Species.asech, Genera.areaHyperbolic
)(
  r => [acosh(reciprocal(unit(r))), 'computed real area hyperbolic secant'],
  c => [acosh(reciprocal(unit(c))), 'computed complex area hyperbolic secant'],
  b => [acosh(reciprocal(unit(b))), 'computed boolean area hyperbolic secant']
)()

export const [acsch, isAreaHyperbolicCosecant, $acsch] = unary<AreaHyperbolicCosecant>(
  Species.acsch, Genera.areaHyperbolic
)(
  r => [asinh(reciprocal(unit(r))), 'computed real area hyperbolic cosecant'],
  c => [asinh(reciprocal(unit(c))), 'computed complex area hyperbolic cosecant'],
  b => [asinh(reciprocal(unit(b))), 'computed boolean area hyperbolic cosecant']
)()

export const [acoth, isAreaHyperbolicCotangent, $acoth] = unary<AreaHyperbolicCotangent>(
  Species.acoth, Genera.areaHyperbolic
)(
  r => [atanh(reciprocal(unit(r))), 'computed real area hyperbolic cotangent'],
  c => [atanh(reciprocal(unit(c))), 'computed complex area hyperbolic cotangent'],
  b => [atanh(reciprocal(unit(b))), 'computed boolean area hyperbolic cotangent']
)()
