import { unit } from "../monads/writer";
import { Species } from "../utility/tree";
import { ComplexInfinity } from '../primitives/complex';
import { real, complex, boolean, isReal, isComplex } from '../primitives'
import { Unary, unary, UnaryNodeMetaTuple } from "../closures/unary";
import { add, subtract, multiply } from "../arithmetic";
import { gamma } from './gamma';
import { isValue } from "../utility/deepEquals";

export type Factorial = Unary<Species.factorial>

const isNegativeInteger = (t: number) => t < 0 && Number.isInteger(t)

export const [factorial, isFactorial, $factorial] = unary<Factorial>(Species.factorial)(
  r => [multiply(unit(r), factorial(add(unit(r), real(-1)))), 'real factorial'],
  c => [multiply(unit(c), factorial(add(unit(c), complex([-1, 0])))), 'complex factorial'],
  _b => [boolean(true), 'boolean factorial']
)( when => [
  when(
    t => isReal(t) && isNegativeInteger(t.value.value), 
    [ComplexInfinity, 'singularity'])
  ,
  when(
    t => isComplex(t) && isNegativeInteger(t.value.a) && t.value.b === 0, 
    [ComplexInfinity, 'singularity']
  ),
  when(
    t => isReal(t) && !Number.isInteger(t.value.value),
    r => [gamma(add(unit(r), real(1))), 'calculated factorial via gamma']
  ),
  when(
    t => isComplex(t) && (t.value.b !== 0 || !Number.isInteger(t.value.a)),
    c => [gamma(add(unit(c), complex([1, 0]))), 'calculated factorial via gamma']
  ),
  when(isValue(real(0)), [real(1), 'degenerate case']),
  when(isValue(complex([0, 0])), [complex([1, 0]), 'degenerate case'])
]) as UnaryNodeMetaTuple<Factorial, void> // ffs
