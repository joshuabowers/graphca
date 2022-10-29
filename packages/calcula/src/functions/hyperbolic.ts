import { unit } from "../monads/writer"
import { Genera, Species, Notation, isGenus } from "../utility/tree"
import { real, complex, boolean } from "../primitives"
import { UnaryNode, unary, unaryFnRule } from "../closures/unary"
import { reciprocal } from "../arithmetic"
import { rule } from "../utility/rule"

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

export const coshRule = unaryFnRule('cosh')
export const sinhRule = unaryFnRule('sinh')
export const tanhRule = unaryFnRule('tanh')
export const sechRule = unaryFnRule('sech')
export const cschRule = unaryFnRule('csch')
export const cothRule = unaryFnRule('coth')

export const [cosh, isHyperbolicCosine, $cosh] = unary<HyperbolicCosine>(
  'cosh', Notation.prefix, Species.cosh, Genera.hyperbolic
)(
  r => real(Math.cosh(r.value)), 
  c => complex([
    Math.cosh(c.a) * Math.cos(c.b),
    Math.sinh(c.a) * Math.sin(c.b)
  ]),
  b => boolean(cosh(real(unit(b))))
)()

export const [sinh, isHyperbolicSine, $sinh] = unary<HyperbolicSine>(
  'sinh', Notation.prefix, Species.sinh, Genera.hyperbolic
)(
  r => real(Math.sinh(r.value)),
  c => complex([
    Math.sinh(c.a) * Math.cos(c.b),
    Math.cosh(c.a) * Math.sin(c.b)
  ]),
  b => boolean(sinh(real(unit(b)))),
)()

export const [tanh, isHyperbolicTangent, $tanh] = unary<HyperbolicTangent>(
  'tanh', Notation.prefix, Species.tanh, Genera.hyperbolic
)(
  r => real(Math.tanh(r.value)),
  c => {
    const divisor = Math.cosh(2 * c.a) + Math.cos(2 * c.b)
    return complex([
      Math.sinh(2 * c.a) / divisor,
      Math.sin(2 * c.b) / divisor
    ])
  },
  b => boolean(tanh(real(unit(b)))),
)()

export const [sech, isHyperbolicSecant, $sech] = unary<HyperbolicSecant>(
  'sech', Notation.prefix, Species.sech, Genera.hyperbolic,
  t => rule`cosh(${t}) ^ -1`
)(
  r => reciprocal(cosh(unit(r))),
  c => reciprocal(cosh(unit(c))),
  b => reciprocal(cosh(unit(b)))
)()

export const [csch, isHyperbolicCosecant, $csch] = unary<HyperbolicCosecant>(
  'csch', Notation.prefix, Species.csch, Genera.hyperbolic,
  t => rule`sinh(${t}) ^ -1`
)(
  r => reciprocal(sinh(unit(r))),
  c => reciprocal(sinh(unit(c))),
  b => reciprocal(sinh(unit(b)))
)()

export const [coth, isHyperbolicCotangent, $coth] = unary<HyperbolicCotangent>(
  'coth', Notation.prefix, Species.coth, Genera.hyperbolic,
  t => rule`tanh(${t}) ^ -1`
)(
  r => reciprocal(tanh(unit(r))),
  c => reciprocal(tanh(unit(c))),
  b => reciprocal(tanh(unit(b)))
)()
