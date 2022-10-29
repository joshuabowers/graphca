import { unit } from "../monads/writer"
import { Genera, Species, Notation, isGenus } from "../utility/tree"
import { real, complex, boolean } from "../primitives"
import { UnaryNode, unary, unaryFnRule } from "../closures/unary"
import { reciprocal } from "../arithmetic"
import { rule } from "../utility/rule"

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

export const cosRule = unaryFnRule('cos')
export const sinRule = unaryFnRule('sin')
export const tanRule = unaryFnRule('tan')
export const secRule = unaryFnRule('sec')
export const cscRule = unaryFnRule('csc')
export const cotRule = unaryFnRule('cot')

export const [sin, isSine, $sin] = unary<Sine>(
  'sin', Notation.prefix, Species.sin, Genera.trigonometric
)(
  r => real(Math.sin(r.value)),
  c => complex([
    Math.sin(c.a) * Math.cosh(c.b),
    Math.cos(c.a) * Math.sinh(c.b)
  ]),
  b => boolean(real(Math.sin(b.value ? 1 : 0))),
)()

export const [cos, isCosine, $cos] = unary<Cosine>(
  'cos', Notation.prefix, Species.cos, Genera.trigonometric
)(
  r => real(Math.cos(r.value)), 
  c => complex([
    Math.cos(c.a) * Math.cosh(c.b),
    -Math.sin(c.a) * Math.sinh(c.b)
  ]),
  b => boolean(real(Math.cos(b.value ? 1 : 0))),
)()

export const [tan, isTangent, $tan] = unary<Tangent>(
  'tan', Notation.prefix, Species.tan, Genera.trigonometric
)(
  r => real(Math.tan(r.value)),
  c => {
    const divisor = Math.cos(2 * c.a) + Math.cosh(2 * c.b)
    return complex([
      Math.sin(2 * c.a) / divisor,
      Math.sinh(2 * c.b) / divisor    
    ])
  },
  b => boolean(real(Math.tan(b.value ? 1 : 0))),
)()

export const [sec, isSecant, $sec] = unary<Secant>(
  'sec', Notation.prefix, Species.sec, Genera.trigonometric,
  t => rule`cos(${t}) ^ -1`
)(
  r => reciprocal(cos(unit(r))),
  c => reciprocal(cos(unit(c))),
  b => reciprocal(cos(unit(b)))
)()

export const [csc, isCosecant, $csc] = unary<Cosecant>(
  'csc', Notation.prefix, Species.csc, Genera.trigonometric,
  t => rule`sin(${t}) ^ -1`
)(
  r => reciprocal(sin(unit(r))),
  c => reciprocal(sin(unit(c))),
  b => reciprocal(sin(unit(b)))
)()

export const [cot, isCotangent, $cot] = unary<Cotangent>(
  'cot', Notation.prefix, Species.cot, Genera.trigonometric,
  t => rule`tan(${t}) ^ -1`
)(
  r => reciprocal(tan(unit(r))),
  c => reciprocal(tan(unit(c))),
  b => reciprocal(tan(unit(b)))
)()
