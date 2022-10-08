import { unit } from "../monads/writer"
import { Genera, Species, Notation, isGenus } from "../utility/tree"
import { real, complex } from "../primitives"
import { UnaryNode, unary, unaryFnRule } from "../closures/unary"
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

export const coshRule = unaryFnRule('cosh')
export const sinhRule = unaryFnRule('sinh')
export const tanhRule = unaryFnRule('tanh')
export const sechRule = unaryFnRule('sech')
export const cschRule = unaryFnRule('csch')
export const cothRule = unaryFnRule('coth')

export const [cosh, isHyperbolicCosine, $cosh] = unary<HyperbolicCosine>(
  'cosh', Notation.prefix, Species.cosh, Genera.hyperbolic
)(
  r => [real(Math.cosh(r.value)), coshRule(r), 'computed real hyperbolic cosine'],
  c => [
    complex([
      Math.cosh(c.a) * Math.cos(c.b),
      Math.sinh(c.a) * Math.sin(c.b)
    ]),
    coshRule(c),
    'computed complex hyperbolic cosine'
  ],
  b => [b, coshRule(b), 'computed boolean hyperbolic cosine']
)()

export const [sinh, isHyperbolicSine, $sinh] = unary<HyperbolicSine>(
  'sinh', Notation.prefix, Species.sinh, Genera.hyperbolic
)(
  r => [real(Math.sinh(r.value)), sinhRule(r), 'computed real hyperbolic sine'],
  c => [
    complex([
      Math.sinh(c.a) * Math.cos(c.b),
      Math.cosh(c.a) * Math.sin(c.b)
    ]),
    sinhRule(c),
    'computed complex hyperbolic sine'
  ],
  b => [b, sinhRule(b), 'computed boolean hyperbolic sine']
)()

export const [tanh, isHyperbolicTangent, $tanh] = unary<HyperbolicTangent>(
  'tanh', Notation.prefix, Species.tanh, Genera.hyperbolic
)(
  r => [real(Math.tanh(r.value)), tanhRule(r), 'computed real hyperbolic tangent'],
  c => {
    const divisor = Math.cosh(2 * c.a) + Math.cos(2 * c.b)
    return [
      complex([
        Math.sinh(2 * c.a) / divisor,
        Math.sin(2 * c.b) / divisor
      ]),
      tanhRule(c),
      'computed complex hyperbolic tangent'
    ]
  },
  b => [b, tanhRule(b), 'computed boolean hyperbolic tangent']
)()

export const [sech, isHyperbolicSecant, $sech] = unary<HyperbolicSecant>(
  'sech', Notation.prefix, Species.sech, Genera.hyperbolic
)(
  r => [reciprocal(cosh(unit(r))), sechRule(r), 'computed real hyperbolic secant'],
  c => [reciprocal(cosh(unit(c))), sechRule(c), 'computed complex hyperbolic secant'],
  b => [reciprocal(cosh(unit(b))), sechRule(b), 'computed boolean hyperbolic secant']
)()

export const [csch, isHyperbolicCosecant, $csch] = unary<HyperbolicCosecant>(
  'csch', Notation.prefix, Species.csch, Genera.hyperbolic 
)(
  r => [reciprocal(sinh(unit(r))), cschRule(r), 'computed real hyperbolic cosecant'],
  c => [reciprocal(sinh(unit(c))), cschRule(c), 'computed complex hyperbolic cosecant'],
  b => [reciprocal(sinh(unit(b))), cschRule(b), 'computed boolean hyperbolic cosecant']
)()

export const [coth, isHyperbolicCotangent, $coth] = unary<HyperbolicCotangent>(
  'coth', Notation.prefix, Species.coth, Genera.hyperbolic
)(
  r => [reciprocal(tanh(unit(r))), cothRule(r), 'computed hyperbolic cotangent'],
  c => [reciprocal(tanh(unit(c))), cothRule(c), 'computed hyperbolic cotangent'],
  b => [reciprocal(tanh(unit(b))), cothRule(b), 'computed boolean hyperbolic cotangent']
)()
