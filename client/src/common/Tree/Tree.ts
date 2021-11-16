import { Addition, Subtraction, Multiplication, Division, Exponentiation } from './Binary';
import {
  Negation, AbsoluteValue,
  Trigonometric, Arcus, Hyperbolic, AreaHyperbolic, Logarithm,
  FactorialLike
} from './Unary';
import { Complex, Real } from './Constant';
import { Variable } from './Variable';

export type Tree = 
| Real 
| Complex 
| Variable 
| Addition 
| Subtraction 
| Multiplication 
| Division 
| Exponentiation 
| Negation 
| AbsoluteValue
| Trigonometric
| Arcus
| Hyperbolic
| AreaHyperbolic
| Logarithm
| FactorialLike
