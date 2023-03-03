import { Species } from '../utility/tree'
import { Real, primitive, when } from '../closures/primitive'
import { isNumber } from '../utility/valuePredicates'
import { numeric } from '../utility/numeric'
import { nan } from './nan'
export { Real }

export const [real, isReal, $real] = 
  primitive<number, {value: number}, Real>(
  isNumber,
  value => ({value}),
  Species.real,
  r => numeric(r.value)
)(
  r => r.value,
  c => c.a,
  b => b.value ? 1 : 0
)(
  when(Number.isNaN, [nan, 'incalculable'])
)

export const EulerMascheroni = real(0.57721566490153286060)
