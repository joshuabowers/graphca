import { unit } from "../monads/writer"
import { Species, Notation } from "../utility/tree"
import { real, complex, boolean } from "../primitives"
import { unary, Unary } from "../closures/unary"

export type Absolute = Unary<Species.abs>

// export const absRule = unaryFnRule('abs')

export const [abs, isAbsolute, $abs] = unary<Absolute>(
  'abs', Notation.prefix, Species.abs
)(
  r => real(Math.abs(r.value)),
  c => complex([Math.hypot(c.a, c.b), 0]),
  b => boolean(b.value)
)()
