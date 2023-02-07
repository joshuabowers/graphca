import { Genera, Species, Notation, isGenus } from "../utility/tree"
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
  'cosh', Notation.prefix, Species.cosh, Genera.hyperbolic
)(
  r => real(Math.cosh(r.value.value)), 
  c => complex([
    Math.cosh(c.value.a) * Math.cos(c.value.b),
    Math.sinh(c.value.a) * Math.sin(c.value.b)
  ]),
  b => boolean(cosh(real(b)))
)()

export const [sinh, isHyperbolicSine, $sinh] = unary<HyperbolicSine>(
  'sinh', Notation.prefix, Species.sinh, Genera.hyperbolic
)(
  r => real(Math.sinh(r.value.value)),
  c => complex([
    Math.sinh(c.value.a) * Math.cos(c.value.b),
    Math.cosh(c.value.a) * Math.sin(c.value.b)
  ]),
  b => boolean(sinh(real(b))),
)()

export const [tanh, isHyperbolicTangent, $tanh] = unary<HyperbolicTangent>(
  'tanh', Notation.prefix, Species.tanh, Genera.hyperbolic
)(
  r => real(Math.tanh(r.value.value)),
  c => {
    const divisor = Math.cosh(2 * c.value.a) + Math.cos(2 * c.value.b)
    return complex([
      Math.sinh(2 * c.value.a) / divisor,
      Math.sin(2 * c.value.b) / divisor
    ])
  },
  b => boolean(tanh(real(b))),
)()

export const [sech, isHyperbolicSecant, $sech] = unary<HyperbolicSecant>(
  'sech', Notation.prefix, Species.sech, Genera.hyperbolic,
  // t => rule`cosh(${t}) ^ -1`
)(
  r => reciprocal(cosh(r)),
  c => reciprocal(cosh(c)),
  b => reciprocal(cosh(b))
)()

export const [csch, isHyperbolicCosecant, $csch] = unary<HyperbolicCosecant>(
  'csch', Notation.prefix, Species.csch, Genera.hyperbolic,
  // t => rule`sinh(${t}) ^ -1`
)(
  r => reciprocal(sinh(r)),
  c => reciprocal(sinh(c)),
  b => reciprocal(sinh(b))
)()

export const [coth, isHyperbolicCotangent, $coth] = unary<HyperbolicCotangent>(
  'coth', Notation.prefix, Species.coth, Genera.hyperbolic,
  // t => rule`tanh(${t}) ^ -1`
)(
  r => reciprocal(tanh(r)),
  c => reciprocal(tanh(c)),
  b => reciprocal(tanh(b))
)()
