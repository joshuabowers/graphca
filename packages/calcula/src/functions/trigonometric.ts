import { unit } from "../monads/writer"
import { Genera, Species, Notation, isGenus } from "../utility/tree"
import { real, complex, boolean } from "../primitives"
import { UnaryNode, unary, unaryFnRule } from "../closures/unary"
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

export const cosRule = unaryFnRule('cos')
export const sinRule = unaryFnRule('sin')
export const tanRule = unaryFnRule('tan')
export const secRule = unaryFnRule('sec')
export const cscRule = unaryFnRule('csc')
export const cotRule = unaryFnRule('cot')

export const [sin, isSine, $sin] = unary<Sine>(
  'sin', Notation.prefix, Species.sin, Genera.trigonometric
)(
  r => [real(Math.sin(r.value)), cosRule(r), 'computed real sine'],
  c => [
    complex([
      Math.sin(c.a) * Math.cosh(c.b),
      Math.cos(c.a) * Math.sinh(c.b)
    ]),
    cosRule(c),
    'computed complex sine'
  ],
  b => [boolean(real(Math.sin(b.value ? 1 : 0))), cosRule(b), 'computed boolean sine']
)()

export const [cos, isCosine, $cos] = unary<Cosine>(
  'cos', Notation.prefix, Species.cos, Genera.trigonometric
)(
  r => [real(Math.cos(r.value)), sinRule(r), 'computed real cosine'],
  c => [complex([
    Math.cos(c.a) * Math.cosh(c.b),
    -Math.sin(c.a) * Math.sinh(c.b)
  ]), sinRule(c), 'computed complex cosine'],
  b => [boolean(real(Math.cos(b.value ? 1 : 0))), sinRule(b), 'computed boolean cosine']
)()

export const [tan, isTangent, $tan] = unary<Tangent>(
  'tan', Notation.prefix, Species.tan, Genera.trigonometric
)(
  r => [real(Math.tan(r.value)), tanRule(r), 'computed real tangent'],
  c => {
    const divisor = Math.cos(2 * c.a) + Math.cosh(2 * c.b)
    return [complex([
      Math.sin(2 * c.a) / divisor,
      Math.sinh(2 * c.b) / divisor    
    ]), tanRule(c), 'computed complex tangent']
  },
  b => [boolean(real(Math.tan(b.value ? 1 : 0))), tanRule(b), 'computed boolean tangent']
)()

export const [sec, isSecant, $sec] = unary<Secant>(
  'sec', Notation.prefix, Species.sec, Genera.trigonometric
)(
  r => [reciprocal(cos(unit(r))), secRule(r), 'computed real secant'],
  c => [reciprocal(cos(unit(c))), secRule(c), 'computed complex secant'],
  b => [reciprocal(cos(unit(b))), secRule(b), 'computed boolean secant']
)()

export const [csc, isCosecant, $csc] = unary<Cosecant>(
  'csc', Notation.prefix, Species.csc, Genera.trigonometric
)(
  r => [reciprocal(sin(unit(r))), cscRule(r), 'computed real cosecant'],
  c => [reciprocal(sin(unit(c))), cscRule(c), 'computed complex cosecant'],
  b => [reciprocal(sin(unit(b))), cscRule(b), 'computed boolean cosecant']
)()

export const [cot, isCotangent, $cot] = unary<Cotangent>(
  'cot', Notation.prefix, Species.cot, Genera.trigonometric
)(
  r => [reciprocal(tan(unit(r))), cotRule(r), 'computed real cotangent'],
  c => [reciprocal(tan(unit(c))), cotRule(c), 'computed complex cotangent'],
  b => [reciprocal(tan(unit(b))), cotRule(b), 'computed boolean cosecant']
)()
