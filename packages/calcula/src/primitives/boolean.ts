import { Species, isSpecies } from '../utility/tree'
import { Boolean, primitive } from '../closures/primitive'
import { isBoolean as isSystemBoolean } from '../utility/valuePredicates'
export { Boolean }

export const boolean = primitive<boolean, {value: boolean}, Boolean>(
  isSystemBoolean,
  value => ({value}),
  Species.boolean
)(
  create => r => [create(r.value !== 0), () => `boolean(${r.value})`, 'cast to boolean'],
  create => c => [create(c.a !== 0 || c.b !== 0), () => `boolean(${c.a} + ${c.b})`, 'cast to boolean'],
  _create => b => [b, () => `${b.value}`, '']
)()

export const isBoolean = isSpecies<Boolean>(Species.boolean)
