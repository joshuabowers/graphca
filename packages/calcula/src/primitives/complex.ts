import { Species } from "../utility/tree"
import { Complex, primitive } from "../closures/primitive"
import { isNumberTuple } from "../utility/valuePredicates"
export { Complex }

export const [complex, isComplex, $complex] = 
  primitive<[number, number], {a: number, b: number}, Complex>(
  isNumberTuple,
  ([a, b]) => ({a, b}),
  Species.complex
)(
  r => [r.value, 0],
  c => [c.a, c.b],
  b => [b.value ? 1 : 0, 0]
)()

export const ComplexInfinity = complex([Infinity, NaN])
