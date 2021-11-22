// import { Kind, FunExp } from './Expression'
import { Kind, Base, Real, Complex, Variable, Binary } from './Expression'
// import { match, select } from 'ts-pattern'
import { method, multi, Multi } from '@arrows/multimethod'

const equalsReal = (left: Real, right: Real) => left.value === right.value
const equalsComplex = (left: Complex, right: Complex) => 
  left.a === right.a && left.b === right.b
const equalsVariable = (left: Variable, right: Variable) => 
  left.name === right.name
const equalsBinary = (left: Binary, right: Binary): boolean => 
  left.$kind === right.$kind &&
  equals(left.left, right.left) && equals(left.right, right.right)
const equalsBase = (left: Base, right: Base) => false

export type Equality = Multi
  & typeof equalsReal
  & typeof equalsComplex
  & typeof equalsVariable
  & typeof equalsBinary
  & typeof equalsBase

export const equals: Equality = multi(
  method([Real, Real], equalsReal),
  method([Complex, Complex], equalsComplex),
  method([Variable, Variable], equalsVariable),
  method([Binary, Binary], equalsBinary),
  method([Base, Base], false)
)

// export function equals(left: Base, right: Base): boolean {
//   if(left.$kind !== right.$kind){ return false }
//   return match<[Tree, Tree], boolean>([left, right])
//     .with([{$kind: 'Real'}, {$kind: 'Real'}], ([l, r]) => l.value === r.value)
//     .with(
//       [{$kind: 'Complex'}, {$kind: 'Complex'}],
//       ([l, r]) => l.a === r.a && l.b === r.b
//     )
//     .with(
//       [{$kind: 'Variable'}, {$kind: 'Variable'}],
//       ([l, r]) => l.name === r.name
//     )
//     .with(
//       [{left: select('ll'), right: select('lr')}, {left: select('rl'), right: select('rr')}],
//       ({ll, lr, rl, rr}) => equals(ll, rl) && equals(lr, rr)
//     )
//     .with(
//       [{expression: select('l')}, {expression: select('r')}],
//       ({l, r}) => equals(l, r)
//     )
//     .otherwise(() => false)
// }
