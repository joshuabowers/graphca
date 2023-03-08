import { Species } from '../utility/tree'
import { Boolean, primitive } from '../closures/primitive'
import { isBooleanOrString } from '../utility/valuePredicates'
export { Boolean }

export const [boolean, isBoolean, $boolean] = 
  primitive<[boolean], boolean, Boolean>(
  isBooleanOrString,
  value => value,
  Species.boolean,
  b => b.raw.toString()
)(
  r => [r.raw !== 0],
  c => [c.raw.a !== 0 || c.raw.b !== 0],
  b => [b.raw]
)()
