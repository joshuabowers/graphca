import { Real, primitive } from '../closures/primitive'
import { isNumber } from '../utility/valuePredicates'
export { Real }

export const real = primitive<number, {value: number}, Real>(
  isNumber,
  value => ({value}),
  'Real'
)(
  _create => r => [r, ''],
  create => c => [create(c.a), 'cast to real'],
  create => b => [create(b.value ? 1 : 0), 'cast to real']
)()

// import { Base } from "./Expression";

// export class Real extends Base {
//   readonly $kind = 'Real'
//   constructor(readonly value: number) { super() }
// }

// export function real(value: number|string) {
//   return new Real(Number(value))
// }

export const EulerMascheroni = real(0.57721566490153286060)
