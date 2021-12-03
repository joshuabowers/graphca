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

export const polygamma = binary(
  (l, r) => calculatePolygamma(l, r, (l, r) => l.value < r, real),
  (l, r) => calculatePolygamma(l, r, (l, r) => l.a < r, n => complex(n, 0)),
  (l, r) => new Polygamma(l, r)
)
export type PolygammaFn = typeof polygamma

export const digamma = unaryFrom(polygamma, bindLeft)(real(0))
