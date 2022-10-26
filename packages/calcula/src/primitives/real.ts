import { Species } from '../utility/tree'
import { Real, primitive } from '../closures/primitive'
import { isNumber } from '../utility/valuePredicates'
export { Real }

export const [real, isReal, $real] = 
  primitive<number, {value: number}, Real>(
  isNumber,
  value => ({value}),
  Species.real
)(
  r => r.value,
  c => c.a,
  b => b.value ? 1 : 0
)()

export const EulerMascheroni = real(0.57721566490153286060)
