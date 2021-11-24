import { Base, Gamma, Real, Complex } from "./Expression";
import { real } from './real'
import { complex } from "./complex";
import { add, subtract } from "./addition";
import { multiply, divide, negate } from "./multiplication";
import { raise, sqrt } from "./exponentiation";
import { sin } from './trigonometric';
import { unary } from "./unary";

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

const calculateGamma = (input: Real|Complex, ltHalf: boolean, cast: (n: number) => Base): Base => {
  if(ltHalf){
    const pi = real(Math.PI)
    return divide(
      pi,
      multiply(sin(multiply(input, pi)), gamma(subtract(real(1), input)))
    )
  }
  const one = real(1)
  const z = subtract(input, one)
  const x = lanczos.p.reduce(
    (s, v, i) => add(s, divide(real(v), add(z, add(real(i), one)))),
    cast(0.99999999999980993)
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

export const gamma = unary(
  r => calculateGamma(r, r.value < 0.5, real) as Real,
  c => calculateGamma(c, c.a < 0.5, n => complex(n, 0)) as Complex,
  e => new Gamma(e)
)
export type GammaFn = typeof gamma
