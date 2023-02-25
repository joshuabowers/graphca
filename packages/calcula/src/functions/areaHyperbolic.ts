import { Genera, Species, Notation, isGenus } from "../utility/tree"
import { boolean, real } from "../primitives"
import { UnaryNode, unary, UnaryNodeMetaTuple } from "../closures/unary"
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
  'acosh', Notation.prefix, Species.acosh, Genera.areaHyperbolic
)(
  r => real(Math.acosh(r.value.value)),
  c => ln(add(
    c, 
    multiply(
      sqrt(add(c, real(1))),
      sqrt(subtract(c, real(1)))
    )
  )),
  b => boolean(acosh(real(b)))
)() as UnaryNodeMetaTuple<AreaHyperbolicCosine, void>

export const [asinh, isAreaHyperbolicSine, $asinh] = unary<AreaHyperbolicSine>(
  'asinh', Notation.prefix, Species.asinh, Genera.areaHyperbolic
)(
  r => real(Math.asinh(r.value.value)), 
  c => ln(add(
    sqrt(add(square(c), real(1))),
    c
  )),
  b => boolean(asinh(real(b)))
)() as UnaryNodeMetaTuple<AreaHyperbolicSine, void>

export const [atanh, isAreaHyperbolicTangent, $atanh] = unary<AreaHyperbolicTangent>(
  'atanh', Notation.prefix, Species.atanh, Genera.areaHyperbolic
)(
  r => real(Math.atanh(r.value.value)), 
  c => multiply(
    real(0.5),
    ln(divide(
      add(real(1), c),
      subtract(real(1), c)
    ))
  ),
  b => boolean(atanh(real(b)))
)() as UnaryNodeMetaTuple<AreaHyperbolicTangent, void>

export const [asech, isAreaHyperbolicSecant, $asech] = unary<AreaHyperbolicSecant>(
  'asech', Notation.prefix, Species.asech, Genera.areaHyperbolic
)(
  r => acosh(reciprocal(r)),
  c => acosh(reciprocal(c)),
  b => acosh(reciprocal(b))
)() as UnaryNodeMetaTuple<AreaHyperbolicSecant, void>

export const [acsch, isAreaHyperbolicCosecant, $acsch] = unary<AreaHyperbolicCosecant>(
  'acsch', Notation.prefix, Species.acsch, Genera.areaHyperbolic
)(
  r => asinh(reciprocal(r)),
  c => asinh(reciprocal(c)),
  b => asinh(reciprocal(b))
)() as UnaryNodeMetaTuple<AreaHyperbolicCosecant, void>

export const [acoth, isAreaHyperbolicCotangent, $acoth] = unary<AreaHyperbolicCotangent>(
  'acoth', Notation.prefix, Species.acoth, Genera.areaHyperbolic
)(
  r => atanh(reciprocal(r)),
  c => atanh(reciprocal(c)),
  b => atanh(reciprocal(b))
)() as UnaryNodeMetaTuple<AreaHyperbolicCotangent, void>
