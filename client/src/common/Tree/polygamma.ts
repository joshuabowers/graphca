import { method, multi, Multi } from '@arrows/multimethod'
import { Binary, binary, unaryFrom, bindLeft } from './binary'
import { Real, real } from './real'
import { Complex, complex } from './complex'
import { add, subtract } from './addition'
import { multiply, divide } from './multiplication'
import { raise } from './exponentiation'
import { tan } from './trigonometric'
import { ln } from './logarithmic'
import { factorial } from './factorial'

export class Polygamma extends Binary {
  readonly $kind = 'Polygamma'
}

// The first 30 Bernoulli numbers, n >= 0.
// Note that B[odd] === 0, n > 1
const bernoulli = [
  0, 1/2,
  1/6, 0,
  -1/30, 0,
  1/42, 0,
  -1/30, 0,
  5/66, 0,
  -691/2730, 0,
  7/6, 0,
  -3617/510, 0,
  43867/798, 0,
  -174611/330, 0,
  854513/138, 0,
  -236364091/2730, 0,
  8553103/6, 0,
  -23749461029/870, 0,
  8615841276005/14322
]

// NOTES For implementation:
// polygamma and digamma should be split into two separate functions.
// Unless the app attempts to define fractional calculus, where higher
// order derivatives and integrals are defined for (most) reals and
// complex numbers, restricting order to integers makes intuitive sense.
// (I.e., polygamma's order refers to which derivative of digamma is
// being referenced.)

// In the following code, b2 represents the Bernoulli numbers of the
// second kind (i.e. n === +0.5), starting at B[2], sans all odd-indices.
// As such, any map/reduce on them would need to shift the referenced
// k-index appropriately: k would range between 0 and b2.length; values
// from b2 therefore represent B[2*(k+1)], so any associated index k needs
// to be similarly adjusted (i.e. k => 2 * (k+1))

// Seemingly accurate values for both digamma and polygamma, which comport
// with values coming from Wolfram-Alpha, are obtainable via the following
// implementations: (psi === polygamma, order > 0; dig === digamma)

// Note that psi is using a rough implementation of factorial for
// calculating coefficients of each monomial. As factorial is not currently
// defined for non-integers, this would result in NaN propagation.
// Wolfram-Alpha seems to extend factorial to non-integers explicitly via
// Gamma. (I.e. a! => gamma(a + 1), a E R; z! => gamma(z + 1), z E C)
// Replacing the factorial computations with gamma, or extending factorial
// to comparably handle non-integer edge cases, should result in parity.

// b2 = [
//   1/6,
//   -1/30,
//   1/42,
//   -1/30,
//   5/66,
//   -691/2730,
//   7/6,
//   -3617/510,
//   43867/798,
//   -174611/330,
//   854513/138,
//   -236364091/2730,
//   8553103/6,
//   -23749461029/870,
//   8615841276005/14322
// ]

// factorial = n => n === 0 ? 1 : n * factorial(n-1)
// term = (m, z) => (((-1)**(m-1) * factorial(m-1) * (m + 2*z)) / (2 * z**(m+1)))
// psi = (m, z) => term(m, z) - ((-1)**(m+1)) * b2.map(
//   (b, k) => i = (b * factorial(2 * (k+1)+m-1)) / ((z**(2 * (k+1)+m)) * factorial(2 * (k+1)))
// ).reduce((p, c) => p + c, 0)

// first = (z) => 0.5 / z
// dig = (z) => Math.log(z) - (0.5 / z) - b2.map(
//   (b, k) => b / (2*(k+1) * z**(2*(k+1)))
// ).reduce((p, c) => p+c, 0)

const calculatePolygamma = <C extends Real|Complex>(
  order: C, 
  input: C,
  lt: (l: C, r: number) => boolean,
  cast: (n: number) => C
): C => {
  if(lt(order, 0)){ throw new Error('undefined for order < 0') }
  else if(lt(order, 1)){ // digamma
    return subtract(
      ln(input),
      bernoulli.slice(1).map( 
        // k needs shifting by one, as it starts 0-based
        (b, k) => divide(real(b), multiply(real(k+1), raise(input, real(k+1))))
      ).reduce<C>((p, c) => add(p, c) as unknown as C, cast(0))
    ) as unknown as C
  } else { // polygamma
    return multiply(
      raise(real(-1), add(order, real(1))),
      bernoulli.map(
        (b, k) => multiply(
          divide(factorial(subtract(add(real(k), order), real(1))), factorial(real(k))),
          divide(real(b), raise(input, add(real(k), order)))
        )
      ).reduce<C>((p, c) => add(p, c) as unknown as C, cast(0))
    ) as unknown as C
  }
  return input
}

export const polygamma = binary(Polygamma)(
  (l, r) => calculatePolygamma(l, r, (l, r) => l.value < r, real),
  (l, r) => calculatePolygamma(l, r, (l, r) => l.a < r, n => complex(n, 0)),
)
export type PolygammaFn = typeof polygamma

export const digamma = unaryFrom(polygamma, bindLeft)(real(0))
