import { unit } from "../monads/writer";
import { Species, Notation } from "../utility/tree";
import { ComplexInfinity } from '../primitives/complex';
import { real, complex, boolean, isReal, isComplex } from '../primitives'
import { Unary, unary, when, UnaryNodeMetaTuple, unaryPostfixRule } from "../closures/unary";
import { add, multiply } from "../arithmetic";
import { gamma } from './gamma';
import { isValue } from "../utility/deepEquals";
import { rule } from "../utility/rule";
import { Unicode } from "../Unicode";

export type Factorial = Unary<Species.factorial>

export const factorialRule = unaryPostfixRule('!')

const isNegativeInteger = (t: number) => t < 0 && Number.isInteger(t)

export const [factorial, isFactorial, $factorial] = unary<Factorial>(
  '!', Notation.postfix, Species.factorial, undefined, 
  (i) => rule`${i} * (${i} - 1)!`
)(
  r => multiply(unit(r), factorial(add(unit(r), real(-1)))), 
  c => multiply(unit(c), factorial(add(unit(c), complex([-1, 0])))), 
  _b => boolean(true),
)(
  when(
    t => isReal(t) && isNegativeInteger(t.result.value), 
    [ComplexInfinity, rule`${ComplexInfinity}`, 'singularity'])
  ,
  when(
    t => isComplex(t) && isNegativeInteger(t.result.a) && t.result.b === 0, 
    [ComplexInfinity, rule`${ComplexInfinity}`, 'singularity']
  ),
  when(
    t => isReal(t) && !Number.isInteger(t.result.value),
    r => [
      gamma(add(unit(r), real(1))), 
      rule`${Unicode.gamma}(${r} + ${real(1)})`, 
      'calculated factorial via gamma'
    ]
  ),
  when(
    t => isComplex(t) && (t.result.b !== 0 || !Number.isInteger(t.result.a)),
    c => [
      gamma(add(unit(c), complex([1, 0]))), 
      rule`${Unicode.gamma}(${c} + ${complex([1, 0])})`,
      'calculated factorial via gamma'
    ]
  ),
  when(isValue(real(0)), [real(1), rule`${real(1)}`, 'degenerate case']),
  when(isValue(complex([0, 0])), [complex([1, 0]), rule`${complex([1, 0])}`, 'degenerate case'])
) as UnaryNodeMetaTuple<Factorial, void> // ffs
