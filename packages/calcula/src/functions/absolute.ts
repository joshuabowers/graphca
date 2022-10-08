import { Species, Notation } from "../utility/tree"
import { real, complex } from "../primitives"
import { unary, Unary, unaryFnRule } from "../closures/unary"

export type Absolute = Unary<Species.abs>

export const absRule = unaryFnRule('abs')

export const [abs, isAbsolute, $abs] = unary<Absolute>(
  'abs', Notation.prefix, Species.abs
)(
  r => [real(Math.abs(r.value)), absRule(r), 'absolute value'],
  c => [complex([Math.hypot(c.a, c.b), 0]), absRule(c), 'absolute value'],
  b => [b, absRule(b), 'absolute value']
)()
