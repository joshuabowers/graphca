import { unit } from "../monads/writer";
import { Species } from "../utility/tree";
import { ComplexInfinity } from '../primitives/complex';
import { real, complex, boolean, isReal, isComplex } from '../primitives'
import { Unary, unary, UnaryNodeGuardPair, when } from "../closures/unary";
import { add, subtract, multiply } from "../arithmetic";
import { gamma } from './gamma';

export type Factorial = Unary<Species.factorial>

const isNegativeInteger = (t: number) => t < 0 && Number.isInteger(t)

export const [factorial, isFactorial] = unary<Factorial>(Species.factorial)(
  r => [multiply(unit(r), factorial(subtract(unit(r), real(1)))), 'real factorial'],
  c => [multiply(unit(c), factorial(subtract(unit(c), real(1)))), 'complex factorial'],
  _b => [boolean(true), 'boolean factorial']
)(
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
    r => [gamma(add(r, real(1))), 'calculate factorial via gamma']
  ),
  when(
    t => isComplex(t) && (t.value.b !== 0 || !Number.isInteger(t.value.a)),
    c => [gamma(add(c, real(1))), 'calculate factorial via gamma']
  ),
  when(real(0), [real(1), 'degenerate case']),
  when(complex([0, 0]), [complex([1, 0]), 'degenerate case'])
) as UnaryNodeGuardPair<Factorial, void> // ffs
