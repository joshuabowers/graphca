import { Boolean, primitive } from '../closures/primitive'
import { isBoolean } from '../utility/valuePredicates'
export { Boolean }

// import { Base } from './Expression'
// import { method, multi, Multi } from '@arrows/multimethod'

// export class Boolean extends Base {
//   readonly $kind = 'Boolean'
//   constructor(readonly value: boolean) { super() }

//   static readonly true = new Boolean(true);
//   static readonly false = new Boolean(false);
// }

// export type BoolFunc = Multi & ((value: boolean) => Boolean)

// export const bool: BoolFunc = multi(
//   method(false, Boolean.false),
//   method(true, Boolean.true)
// )

export const boolean = primitive<boolean, {value: boolean}, Boolean>(
  isBoolean,
  value => ({value}),
  'Boolean'
)(
  create => r => [create(r.value !== 0), 'cast to boolean'],
  create => c => [create(c.a !== 0 || c.b !== 0), 'cast to boolean'],
  _create => b => [b, '']
)()
