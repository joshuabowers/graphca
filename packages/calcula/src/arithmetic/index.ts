import { add, subtract, Addition, isAddition } from "./addition";
import { 
  multiply, divide, negate, double, Multiplication, isMultiplication 
} from "./multiplication";
import { 
  raise, reciprocal, square, sqrt, Exponentiation, isExponentiation 
} from "./exponentiation";

export { 
  add, subtract, 
  multiply, divide, negate, double,
  raise, reciprocal, square, sqrt
}
export {
  Addition, Multiplication, Exponentiation
}
export {
  isAddition, isMultiplication, isExponentiation
}

export type AdditiveFn = typeof add | typeof subtract
export type MultiplicativeFn = typeof multiply | typeof divide

export const additive = new Map<string, AdditiveFn>([
  ['+', add],
  ['-', subtract]
])

export const multiplicative = new Map<string, MultiplicativeFn>([
  ['*', multiply],
  ['/', divide]
])
