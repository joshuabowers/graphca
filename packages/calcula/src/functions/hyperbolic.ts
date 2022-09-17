import { unit } from "../monads/writer"
import { Genera, Species, isGenus } from "../utility/tree"
import { real, complex, boolean } from "../primitives"
import { UnaryNode, unary } from "../closures/unary"
import { reciprocal } from "../arithmetic"

export type HyperbolicNode = UnaryNode & {
  readonly genus: Genera.hyperbolic
}

export const isHyperbolic = isGenus<HyperbolicNode>(Genera.hyperbolic)

type Hyperbolic<S extends Species> = HyperbolicNode & {
  readonly species: S
}

export type HyperbolicSine = Hyperbolic<Species.sinh>
export type HyperbolicCosine = Hyperbolic<Species.cosh>
export type HyperbolicTangent = Hyperbolic<Species.tanh>
export type HyperbolicCosecant = Hyperbolic<Species.csch>
export type HyperbolicSecant = Hyperbolic<Species.sech>
export type HyperbolicCotangent = Hyperbolic<Species.coth>

export const [cosh, isHyperbolicCosine, $cosh] = unary<HyperbolicCosine>(
  Species.cosh, Genera.hyperbolic
)(
  r => [real(Math.cosh(r.value)), 'computed real hyperbolic cosine'],
  c => [
    complex([
      Math.cosh(c.a) * Math.cos(c.b),
      Math.sinh(c.a) * Math.sin(c.b)
    ]),
    'computed complex hyperbolic cosine'
  ],
  b => [b, 'computed boolean hyperbolic cosine']
)()

export const [sinh, isHyperbolicSine, $sinh] = unary<HyperbolicSine>(
  Species.sinh, Genera.hyperbolic
)(
  r => [real(Math.sinh(r.value)), 'computed real hyperbolic sine'],
  c => [
    complex([
      Math.sinh(c.a) * Math.cos(c.b),
      Math.cosh(c.a) * Math.sin(c.b)
    ]),
    'computed complex hyperbolic sine'
  ],
  b => [b, 'computed boolean hyperbolic sine']
)()

export const [tanh, isHyperbolicTangent, $tanh] = unary<HyperbolicTangent>(
  Species.tanh, Genera.hyperbolic
)(
  r => [real(Math.tanh(r.value)), 'computed real hyperbolic tangent'],
  c => {
    const divisor = Math.cosh(2 * c.a) + Math.cos(2 * c.b)
    return [
      complex([
        Math.sinh(2 * c.a) / divisor,
        Math.sin(2 * c.b) / divisor
      ]),
      'computed complex hyperbolic tangent'
    ]
  },
  b => [b, 'computed boolean hyperbolic tangent']
)()

export const [sech, isHyperbolicSecant, $sech] = unary<HyperbolicSecant>(
  Species.sech, Genera.hyperbolic
)(
  r => [reciprocal(cosh(unit(r))), 'computed real hyperbolic secant'],
  c => [reciprocal(cosh(unit(c))), 'computed complex hyperbolic secant'],
  b => [reciprocal(cosh(unit(b))), 'computed boolean hyperbolic secant']
)()

export const [csch, isHyperbolicCosecant, $csch] = unary<HyperbolicCosecant>(
  Species.csch, Genera.hyperbolic 
)(
  r => [reciprocal(sinh(unit(r))), 'computed real hyperbolic cosecant'],
  c => [reciprocal(sinh(unit(c))), 'computed complex hyperbolic cosecant'],
  b => [reciprocal(sinh(unit(b))), 'computed boolean hyperbolic cosecant']
)()

export const [coth, isHyperbolicCotangent, $coth] = unary<HyperbolicCotangent>(
  Species.coth, Genera.hyperbolic
)(
  r => [reciprocal(tanh(unit(r))), 'computed hyperbolic cotangent'],
  c => [reciprocal(tanh(unit(c))), 'computed hyperbolic cotangent'],
  b => [reciprocal(tanh(unit(b))), 'computed boolean hyperbolic cotangent']
)()
