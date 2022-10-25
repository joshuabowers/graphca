import { Species, isSpecies } from '../utility/tree'
import { Boolean, primitive } from '../closures/primitive'
import { isBoolean as isSystemBoolean } from '../utility/valuePredicates'
export { Boolean }

export const boolean = primitive<boolean, {value: boolean}, Boolean>(
  isSystemBoolean,
  value => ({value}),
  Species.boolean
)(
  r => r.value !== 0,
  c => c.a !== 0 || c.b !== 0,
  b => b.value
)()

export const isBoolean = isSpecies<Boolean>(Species.boolean)

