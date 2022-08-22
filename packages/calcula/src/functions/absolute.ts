import { Species } from "../utility/tree"
import { real, complex } from "../primitives"
import { unary, Unary } from "../closures/unary"

export type Absolute = Unary<Species.abs>

export const [abs, isAbsolute] = unary<Absolute>(Species.abs)(
  r => [real(Math.abs(r.value)), 'absolute value'],
  c => [complex([Math.hypot(c.a, c.b), 0]), 'absolute value'],
  b => [b, 'absolute value']
)()
