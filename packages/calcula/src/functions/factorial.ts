// import { method } from '@arrows/multimethod'
// import { is } from './is'
// import { Base } from './Expression'
// import { Real, real } from './real'
// import { Complex, complex, ComplexInfinity } from './complex'
// import { add, subtract } from './addition'
// import { multiply } from './multiplication'
// import { Unary, unary, UnaryFn } from './unary'
// import { gamma } from './gamma'

// const isNegativeRealInteger = (e: Base) => is(Real)(e) && e.value < 0 
//   && Number.isInteger(e.value)
// const isNegativeComplexInteger = (e: Base) => is(Complex)(e) && e.a < 0 
//   && e.b === 0 && Number.isInteger(e.a)
// const isNonIntegerReal = (e: Base) => is(Real)(e) && !Number.isInteger(e.value)
// const isNonIntegerComplex = (e: Base) => is(Complex)(e) 
//   && (e.b !== 0 || !Number.isInteger(e.a))

// export class Factorial extends Unary {
//   readonly $kind = 'Factorial'
// }

// export const factorial: UnaryFn<Factorial> = unary(Factorial)(
//   r => multiply(r, factorial(subtract(r, real(1)))),
//   c => multiply(c, factorial(subtract(c, real(1))))
// )(
//   method(isNegativeRealInteger, ComplexInfinity),
//   method(isNegativeComplexInteger, ComplexInfinity),
//   method(isNonIntegerReal, (r: Real) => gamma(add(r, real(1)))),
//   method(isNonIntegerComplex, (c: Complex) => gamma(add(c, real(1)))),
//   method(real(0), real(1)),
//   method(complex(0, 0), complex(1, 0))
// )

import { method } from '@arrows/multimethod'
import { unit } from "../monads/writer";
import { Species } from "../utility/tree";
import { real, complex, boolean } from '../primitives'
import { Unary, unary, UnaryNodeGuardPair } from "../closures/unary";
import { subtract, multiply } from "../arithmetic";

export type Factorial = Unary<Species.factorial>

export const [factorial, isFactorial] = unary<Factorial>(Species.factorial)(
  r => [multiply(unit(r), factorial(subtract(unit(r), real(1)))), 'real factorial'],
  c => [multiply(unit(c), factorial(subtract(unit(c), real(1)))), 'complex factorial'],
  b => [boolean(true), 'boolean factorial']
)(
  method(real(0), real(1)),
  method(complex([0, 0]), complex([1, 0]))
) as UnaryNodeGuardPair<Factorial, void> // ffs
