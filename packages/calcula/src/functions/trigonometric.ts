import { unit } from "../monads/writer"
import { Genera, Species, isGenus } from "../utility/tree"
import { real, complex, boolean } from "../primitives"
import { UnaryNode, unary } from "../closures/unary"
import { reciprocal } from "../arithmetic"

export type TrigonometricNode = UnaryNode & {
  readonly genus: Genera.trigonometric
}

type Trigonometric<S extends Species> = TrigonometricNode & {
  readonly species: S
}

export type Sine = Trigonometric<Species.sin>
export type Cosine = Trigonometric<Species.cos>
export type Tangent = Trigonometric<Species.tan>
export type Cosecant = Trigonometric<Species.csc>
export type Secant = Trigonometric<Species.sec>
export type Cotangent = Trigonometric<Species.cot>

export const [sin, isSine] = unary<Sine>(Species.sin, Genera.trigonometric)(
  r => [real(Math.sin(r.value)), 'computed real sine'],
  c => [
    complex([
      Math.sin(c.a) * Math.cosh(c.b),
      Math.cos(c.a) * Math.sinh(c.b)
    ]),
    'computed complex sine'
  ],
  b => [boolean(real(Math.sin(b.value ? 1 : 0))), 'computed boolean sine']
)()

export const [cos, isCosine] = unary<Cosine>(Species.cos, Genera.trigonometric)(
  r => [real(Math.cos(r.value)), 'computed real cosine'],
  c => [complex([
    Math.cos(c.a) * Math.cosh(c.b),
    -Math.sin(c.a) * Math.sinh(c.b)
  ]), 'computed complex cosine'],
  b => [boolean(real(Math.cos(b.value ? 1 : 0))), 'computed boolean cosine']
)()

export const [tan, isTangent] = unary<Tangent>(Species.tan, Genera.trigonometric)(
  r => [real(Math.tan(r.value)), 'computed real tangent'],
  c => {
    const divisor = Math.cos(2 * c.a) + Math.cosh(2 * c.b)
    return [complex([
      Math.sin(2 * c.a) / divisor,
      Math.sinh(2 * c.b) / divisor    
    ]), 'computed complex tangent']
  },
  b => [boolean(real(Math.tan(b.value ? 1 : 0))), 'computed boolean tangent']
)()

export const [sec, isSecant] = unary<Secant>(Species.sec, Genera.trigonometric)(
  r => [reciprocal(cos(unit(r))), 'computed real secant'],
  c => [reciprocal(cos(unit(c))), 'computed complex secant'],
  b => [reciprocal(cos(unit(b))), 'computed boolean secant']
)()

export const [csc, isCosecant] = unary<Cosecant>(Species.csc, Genera.trigonometric)(
  r => [reciprocal(sin(unit(r))), 'computed real cosecant'],
  c => [reciprocal(sin(unit(c))), 'computed complex cosecant'],
  b => [reciprocal(sin(unit(b))), 'computed boolean cosecant']
)()

export const [cot, isCotangent] = unary<Cotangent>(Species.cot, Genera.trigonometric)(
  r => [reciprocal(tan(unit(r))), 'computed real cotangent'],
  c => [reciprocal(tan(unit(c))), 'computed complex cotangent'],
  b => [reciprocal(tan(unit(b))), 'computed boolean cosecant']
)()

export const isTrigonometric = isGenus<TrigonometricNode>(Genera.trigonometric)
