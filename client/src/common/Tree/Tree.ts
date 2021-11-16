import { 
  Addition, Subtraction, Multiplication, Division, Exponentiation, Assignment 
} from './Binary';
import {
  Negation, AbsoluteValue,
  Trigonometric, Arcus, Hyperbolic, AreaHyperbolic, Logarithm,
  FactorialLike
} from './Unary';
import { Complex, Real } from './Constant';
import { Variable } from './Variable';
import { Derivative } from './Derivative';
import { Invocation } from './Invocation';

export type Tree = 
| Real 
| Complex 
| Variable 
| Assignment
| Invocation
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
| Derivative
