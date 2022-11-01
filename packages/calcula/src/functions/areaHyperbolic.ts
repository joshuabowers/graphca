import { unit } from "../monads/writer"
import { Genera, Species, Notation, isGenus } from "../utility/tree"
import { boolean, real } from "../primitives"
import { UnaryNode, unary, unaryFnRule } from "../closures/unary"
import { 
  add, subtract, multiply, divide, square, sqrt, reciprocal 
} from "../arithmetic"
import { ln } from "./logarithmic"
import { rule } from "../utility/rule"

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

export const acoshRule = unaryFnRule('acosh')
export const asinhRule = unaryFnRule('asinh')
export const atanhRule = unaryFnRule('atanh')
export const asechRule = unaryFnRule('asech')
export const acschRule = unaryFnRule('acsch')
export const acothRule = unaryFnRule('acoth')

export const [acosh, isAreaHyperbolicCosine, $acosh] = unary<AreaHyperbolicCosine>(
  'acosh', Notation.prefix, Species.acosh, Genera.areaHyperbolic
)(
  r => real(Math.acosh(r.value)),
  c => ln(add(
    unit(c), 
    multiply(
      sqrt(add(unit(c), real(1))),
      sqrt(subtract(unit(c), real(1)))
    )
  )),
  b => boolean(acosh(real(unit(b))))
)()

export const [asinh, isAreaHyperbolicSine, $asinh] = unary<AreaHyperbolicSine>(
  'asinh', Notation.prefix, Species.asinh, Genera.areaHyperbolic
)(
  r => real(Math.asinh(r.value)), 
  c => ln(add(
    sqrt(add(square(unit(c)), real(1))),
    unit(c)
  )),
  b => boolean(asinh(real(unit(b))))
)()

export const [atanh, isAreaHyperbolicTangent, $atanh] = unary<AreaHyperbolicTangent>(
  'atanh', Notation.prefix, Species.atanh, Genera.areaHyperbolic
)(
  r => real(Math.atanh(r.value)), 
  c => multiply(
    real(0.5),
    ln(divide(
      add(real(1), unit(c)),
      subtract(real(1), unit(c))
    ))
  ),
  b => boolean(atanh(real(unit(b))))
)()

export const [asech, isAreaHyperbolicSecant, $asech] = unary<AreaHyperbolicSecant>(
  'asech', Notation.prefix, Species.asech, Genera.areaHyperbolic,
  t => rule`acosh(${t} ^ -1)`
)(
  r => acosh(reciprocal(unit(r))),
  c => acosh(reciprocal(unit(c))),
  b => acosh(reciprocal(unit(b)))
)()

export const [acsch, isAreaHyperbolicCosecant, $acsch] = unary<AreaHyperbolicCosecant>(
  'acsch', Notation.prefix, Species.acsch, Genera.areaHyperbolic,
  t => rule`asinh(${t} ^ -1)`
)(
  r => asinh(reciprocal(unit(r))),
  c => asinh(reciprocal(unit(c))),
  b => asinh(reciprocal(unit(b)))
)()

export const [acoth, isAreaHyperbolicCotangent, $acoth] = unary<AreaHyperbolicCotangent>(
  'acoth', Notation.prefix, Species.acoth, Genera.areaHyperbolic,
  t => rule`atanh(${t} ^ -1)`
)(
  r => atanh(reciprocal(unit(r))),
  c => atanh(reciprocal(unit(c))),
  b => atanh(reciprocal(unit(b)))
)()
