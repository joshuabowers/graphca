import { multi, fromMulti, method } from "@arrows/multimethod";
import { is } from './is';
import { Base } from "./Expression";
import { Real, real } from './real'
import { Complex } from "./complex";
import { add, subtract } from "./addition";
import { multiply, divide, negate } from "./multiplication";
import { raise, sqrt } from "./exponentiation";
import { sin } from './trigonometric';
import { Unary, unary } from "./unary";
import { factorial } from './factorial';
import { ConstantPredicate } from "./predicates";

const isPIN = (n: number) => n > 0 && n <= 15 && Number.isInteger(n)

const isPositiveInteger = (e: Base) =>
  (is(Real)(e) && isPIN(e.value))
  || (is(Complex)(e) && e.b === 0 && isPIN(e.a))

const isSmall: ConstantPredicate = multi(
  method(is(Real), (r: Real) => r.value < 0.5),
  method(is(Complex), (c: Complex) => c.a < 0.5),
  method(false)
)

const lanczos = {
  p: [
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7
  ]
}

const pi = real(Math.PI)
const gammaReflection = (e: Base): Base =>
  divide(
    pi,
    multiply(sin(multiply(e, pi)), gamma(subtract(real(1), e)))
  )

const calculateGamma = (input: Real|Complex): Base => {
  const one = real(1)
  const z = subtract(input, one)
  const x = lanczos.p.reduce(
    (s, v, i) => add(s, divide(real(v), add(z, add(real(i), one)))),
    real(0.99999999999980993) as Base
  )
  const t = subtract(add(z, real(lanczos.p.length)), real(0.5))
  return multiply(
    sqrt(real(2 * Math.PI)),
    multiply(
      raise(t, add(z, real(0.5))),
      multiply(raise(real(Math.E), negate(t)), x)
    )
  )
}

export class Gamma extends Unary {
  readonly $kind = 'Gamma'
}

const rawGamma = unary(Gamma)(
  r => calculateGamma(r) as Real,
  c => calculateGamma(c) as Complex
)
export type GammaFn = typeof rawGamma

export const gamma: GammaFn = fromMulti(
  method(isPositiveInteger, (e: Base) => factorial(subtract(e, real(1)))),
  method(isSmall, (e: Base) => gammaReflection(e))
)(rawGamma)
