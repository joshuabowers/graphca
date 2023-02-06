import { Species } from '../utility/tree'
import { Boolean, primitive } from '../closures/primitive'
import { isBoolean as isSystemBoolean } from '../utility/valuePredicates'
export { Boolean }

export const [boolean, isBoolean, $boolean] = 
  primitive<boolean, {value: boolean}, Boolean>(
  isSystemBoolean,
  value => ({value}),
  Species.boolean,
  b => b.value.toString()
)(
  r => r.value !== 0,
  c => c.a !== 0 || c.b !== 0,
  b => b.value
)()
