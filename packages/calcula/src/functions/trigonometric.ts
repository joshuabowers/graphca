import { Genera, Species, Notation, isGenus } from "../utility/tree"
import { real, complex, boolean } from "../primitives"
import { UnaryNode, unary } from "../closures/unary"
import { reciprocal } from "../arithmetic"

export type TrigonometricNode = UnaryNode & {
  readonly genus: Genera.trigonometric
}

export const isTrigonometric = isGenus<TrigonometricNode>(Genera.trigonometric)

type Trigonometric<S extends Species> = TrigonometricNode & {
  readonly species: S
}

export type Sine = Trigonometric<Species.sin>
export type Cosine = Trigonometric<Species.cos>
export type Tangent = Trigonometric<Species.tan>
export type Cosecant = Trigonometric<Species.csc>
export type Secant = Trigonometric<Species.sec>
export type Cotangent = Trigonometric<Species.cot>

export const [sin, isSine, $sin] = unary<Sine>(
  'sin', Notation.prefix, Species.sin, Genera.trigonometric
)(
  r => real(Math.sin(r.value.value)),
  c => complex([
    Math.sin(c.value.a) * Math.cosh(c.value.b),
    Math.cos(c.value.a) * Math.sinh(c.value.b)
  ]),
  b => boolean(real(Math.sin(b.value.value ? 1 : 0))),
)()

export const [cos, isCosine, $cos] = unary<Cosine>(
  'cos', Notation.prefix, Species.cos, Genera.trigonometric
)(
  r => real(Math.cos(r.value.value)), 
  c => complex([
    Math.cos(c.value.a) * Math.cosh(c.value.b),
    -Math.sin(c.value.a) * Math.sinh(c.value.b)
  ]),
  b => boolean(real(Math.cos(b.value.value ? 1 : 0))),
)()

export const [tan, isTangent, $tan] = unary<Tangent>(
  'tan', Notation.prefix, Species.tan, Genera.trigonometric
)(
  r => real(Math.tan(r.value.value)),
  c => {
    const divisor = Math.cos(2 * c.value.a) + Math.cosh(2 * c.value.b)
    return complex([
      Math.sin(2 * c.value.a) / divisor,
      Math.sinh(2 * c.value.b) / divisor    
    ])
  },
  b => boolean(real(Math.tan(b.value ? 1 : 0))),
)()

export const [sec, isSecant, $sec] = unary<Secant>(
  'sec', Notation.prefix, Species.sec, Genera.trigonometric,
)(
  r => reciprocal(cos(r)),
  c => reciprocal(cos(c)),
  b => reciprocal(cos(b))
)()

export const [csc, isCosecant, $csc] = unary<Cosecant>(
  'csc', Notation.prefix, Species.csc, Genera.trigonometric,
)(
  r => reciprocal(sin(r)),
  c => reciprocal(sin(c)),
  b => reciprocal(sin(b))
)()

export const [cot, isCotangent, $cot] = unary<Cotangent>(
  'cot', Notation.prefix, Species.cot, Genera.trigonometric,
)(
  r => reciprocal(tan(r)),
  c => reciprocal(tan(c)),
  b => reciprocal(tan(b))
)()
