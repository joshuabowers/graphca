import { Complex, primitive } from "../closures/primitive"
import { isNumberTuple } from "../utility/valuePredicates"
export { Complex }

// import { Base } from './Expression';

// export class Complex extends Base {
//   readonly $kind = 'Complex'
//   constructor(readonly a: number, readonly b: number) { super() }
// }

// export function complex(a: number|string, b: number|string) {
//   return new Complex(Number(a), Number(b))
// }

// export const ComplexInfinity = complex(Infinity, NaN)

export const complex = primitive<[number, number], {a: number, b: number}, Complex>(
  isNumberTuple,
  ([a, b]) => ({a, b}),
  'Complex'
)(
  create => r => [create([r.value, 0]), 'cast to complex'],
  _create => c => [c, ''],
  create => b => [create([b.value ? 1 : 0, 0]), 'cast to complex']
)()

export const ComplexInfinity = complex([Infinity, NaN])
