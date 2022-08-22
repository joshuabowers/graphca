import { Genera, Species, isGenus, isSpecies } from "../utility/tree"
import { real, complex, boolean } from "../primitives"
import { UnaryNode, unary } from "../closures/unary"

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

export const [sin, isSine] = unary<Sine>(Species.sin)(
  r => [real(Math.sin(r.value)), 'computed sine'],
  c => [
    complex([
      Math.sin(c.a) * Math.cosh(c.b),
      Math.cos(c.a) * Math.sinh(c.b)
    ]),
    'computed sine'
  ],
  b => [boolean(real(Math.sin(b.value ? 1 : 0))), 'computed sine']
)()

export const [cos, isCosine] = unary<Cosine>(Species.cos)(
  r => [real(Math.cos(r.value)), 'computed real cosine'],
  c => [complex([
    Math.cos(c.a) * Math.cosh(c.b),
    -Math.sin(c.a) * Math.sinh(c.b)
  ]), 'computed complex cosine'],
  b => [boolean(real(Math.cos(b.value ? 1 : 0))), 'computed boolean cosine']
)()

export const [tan, isTangent] = unary<Tangent>(Species.tan)(
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

// export const sec = unary(Secant)(
//   r => reciprocal(cos(r)),
//   c => reciprocal(cos(c))
// )()

// export const csc = unary(Cosecant)(
//   r => reciprocal(sin(r)),
//   c => reciprocal(sin(c))
// )()

// export const cot = unary(Cotangent)(
//   r => reciprocal(tan(r)),
//   c => reciprocal(tan(c))
// )()

export const isTrigonometric = isGenus<TrigonometricNode>(Genera.trigonometric)

export const isCosecant = isSpecies<Cosecant>(Species.csc)
export const isSecant = isSpecies<Secant>(Species.sec)
export const isCotangent = isSpecies<Cotangent>(Species.cot)
