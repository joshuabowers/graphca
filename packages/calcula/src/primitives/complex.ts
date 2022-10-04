import { Species, isSpecies } from "../utility/tree"
import { Complex, primitive } from "../closures/primitive"
import { isNumberTuple } from "../utility/valuePredicates"
export { Complex }

export const complex = primitive<[number, number], {a: number, b: number}, Complex>(
  isNumberTuple,
  ([a, b]) => ({a, b}),
  Species.complex
)(
  create => r => [create([r.value, 0]), () => `complex(${r.value})`, 'cast to complex'],
  _create => c => [c, () => `${c.a} + ${c.b}`, ''],
  create => b => [create([b.value ? 1 : 0, 0]), () => `complex(${b.value})`, 'cast to complex']
)()

export const isComplex = isSpecies<Complex>(Species.complex)

export const ComplexInfinity = complex([Infinity, NaN])
