import { Species } from "../utility/tree"
import { real, complex } from "../primitives"
import { unary, Unary } from "../closures/unary"
import { rule } from "../utility/rule"

export type Absolute = Unary<Species.abs>

export const [abs, isAbsolute, $abs] = unary<Absolute>(Species.abs)(
  r => [real(Math.abs(r.value)), rule`abs(${r})`, 'absolute value'],
  c => [complex([Math.hypot(c.a, c.b), 0]), rule`abs(${c})`, 'absolute value'],
  b => [b, rule`abs(${b})`, 'absolute value']
)()
