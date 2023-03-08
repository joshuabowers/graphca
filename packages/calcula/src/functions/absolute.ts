import { Species, Notation } from "../utility/tree"
import { real, complex } from "../primitives"
import { unary, Unary } from "../closures/unary"

export type Absolute = Unary<Species.abs>

export const [abs, isAbsolute, $abs] = unary<Absolute>(
  'abs', Notation.prefix, Species.abs
)(
  r => real(Math.abs(r.value.raw)),
  c => complex(Math.hypot(c.value.raw.a, c.value.raw.b), 0),
  b => b
)()
