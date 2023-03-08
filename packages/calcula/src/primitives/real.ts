import { Species } from '../utility/tree'
import { Real, primitive } from '../closures/primitive'
import { isNumericOrString } from '../utility/valuePredicates'
import { numeric } from '../utility/numeric'
import { nan } from './nan'
export { Real }

export const [real, isReal, $real] = 
  primitive<[number|string], number, Real>(
  isNumericOrString,
  value => Number(value),
  Species.real,
  r => numeric(r.raw)
)(
  r => [r.raw],
  c => [c.raw.a],
  b => [b.raw ? 1 : 0]
)(
  when => [
    when(v => Number.isNaN(v), [nan, 'incalculable'])
  ]
)

export const EulerMascheroni = real(0.57721566490153286060)
