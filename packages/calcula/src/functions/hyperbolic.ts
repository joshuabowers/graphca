import { Genera, Species, Notation, isGenus } from "../utility/tree"
import { real, complex, boolean } from "../primitives"
import { UnaryNode, unary, UnaryNodeMetaTuple } from "../closures/unary"
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
  r => real(Math.cosh(r.value.raw)), 
  c => complex(
    Math.cosh(c.value.raw.a) * Math.cos(c.value.raw.b),
    Math.sinh(c.value.raw.a) * Math.sin(c.value.raw.b)
  ),
  b => boolean(cosh(real(b)))
)() as UnaryNodeMetaTuple<HyperbolicCosine, void>

export const [sinh, isHyperbolicSine, $sinh] = unary<HyperbolicSine>(
  'sinh', Notation.prefix, Species.sinh, Genera.hyperbolic
)(
  r => real(Math.sinh(r.value.raw)),
  c => complex(
    Math.sinh(c.value.raw.a) * Math.cos(c.value.raw.b),
    Math.cosh(c.value.raw.a) * Math.sin(c.value.raw.b)
  ),
  b => boolean(sinh(real(b))),
)() as UnaryNodeMetaTuple<HyperbolicSine, void>

export const [tanh, isHyperbolicTangent, $tanh] = unary<HyperbolicTangent>(
  'tanh', Notation.prefix, Species.tanh, Genera.hyperbolic
)(
  r => real(Math.tanh(r.value.raw)),
  c => {
    const divisor = Math.cosh(2 * c.value.raw.a) + Math.cos(2 * c.value.raw.b)
    return complex(
      Math.sinh(2 * c.value.raw.a) / divisor,
      Math.sin(2 * c.value.raw.b) / divisor
    )
  },
  b => boolean(tanh(real(b))),
)() as UnaryNodeMetaTuple<HyperbolicTangent, void>

export const [sech, isHyperbolicSecant, $sech] = unary<HyperbolicSecant>(
  'sech', Notation.prefix, Species.sech, Genera.hyperbolic
)(
  r => reciprocal(cosh(r)),
  c => reciprocal(cosh(c)),
  b => reciprocal(cosh(b))
)() as UnaryNodeMetaTuple<HyperbolicSecant, void>

export const [csch, isHyperbolicCosecant, $csch] = unary<HyperbolicCosecant>(
  'csch', Notation.prefix, Species.csch, Genera.hyperbolic
)(
  r => reciprocal(sinh(r)),
  c => reciprocal(sinh(c)),
  b => reciprocal(sinh(b))
)() as UnaryNodeMetaTuple<HyperbolicCosecant, void>

export const [coth, isHyperbolicCotangent, $coth] = unary<HyperbolicCotangent>(
  'coth', Notation.prefix, Species.coth, Genera.hyperbolic
)(
  r => reciprocal(tanh(r)),
  c => reciprocal(tanh(c)),
  b => reciprocal(tanh(b))
)() as UnaryNodeMetaTuple<HyperbolicCotangent, void>
