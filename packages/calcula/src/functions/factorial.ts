import { Species, Notation } from "../utility/tree";
import { ComplexInfinity } from '../primitives/complex';
import { real, complex, boolean, isReal, isComplex } from '../primitives'
import { Unary, unary, when, UnaryNodeMetaTuple } from "../closures/unary";
import { add, multiply } from "../arithmetic";
import { gamma } from './gamma';
import { isValue } from "../utility/deepEquals";

export type Factorial = Unary<Species.factorial>

const isNegativeInteger = (t: number) => t < 0 && Number.isInteger(t)

export const [factorial, isFactorial, $factorial] = unary<Factorial>(
  '!', Notation.postfix, Species.factorial, undefined, 
)(
  r => multiply(r, factorial(add(r, real(-1)))), 
  c => multiply(c, factorial(add(c, complex(-1, 0)))), 
  _b => boolean(true),
)(
  when(
    t => isReal(t) && isNegativeInteger(t.value.raw), 
    [ComplexInfinity, 'singularity'])
  ,
  when(
    t => isComplex(t) && isNegativeInteger(t.value.raw.a) && t.value.raw.b === 0, 
    [ComplexInfinity, 'singularity']
  ),
  when(
    t => isReal(t) && !Number.isInteger(t.value.raw),
    r => [
      gamma(add(r, real(1))), 
      'calculated factorial via gamma'
    ]
  ),
  when(
    t => isComplex(t) && (t.value.raw.b !== 0 || !Number.isInteger(t.value.raw.a)),
    c => [
      gamma(add(c, complex(1, 0))), 
      'calculated factorial via gamma'
    ]
  ),
  when(isValue(real(0)), [real(1), 'degenerate case']),
  when(isValue(complex(0, 0)), [complex(1, 0), 'degenerate case'])
) as UnaryNodeMetaTuple<Factorial, void> // ffs
