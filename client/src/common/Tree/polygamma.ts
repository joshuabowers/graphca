import { fromMulti, method, _ } from '@arrows/multimethod'
import { Base } from './Expression'
import { Binary, binary } from './binary'
import { unary } from './unary'
import { Real, real } from './real'
import { Complex } from './complex'
import { add, subtract } from './addition'
import { multiply, divide, double } from './multiplication'
import { raise } from './exponentiation'
import { tan } from './trigonometric'
import { ln } from './logarithmic'
import { factorial } from './factorial'

export class Polygamma extends Binary {
  readonly $kind = 'Polygamma'
}

const bernoulli = [
  1/6,
  -1/30,
  1/42,
  -1/30,
  5/66,
  -691/2730,
  7/6,
  -3617/510,
  43867/798,
  -174611/330,
  854513/138,
  -236364091/2730,
  8553103/6,
  -23749461029/870,
  8615841276005/14322
]

const calculatePolygamma = (
  m: Real|Complex, 
  z: Real|Complex,
): Base => {
  return add(
    divide(
      multiply(
        multiply(
          raise(real(-1), add(m, real(1))),
          factorial(subtract(m, real(1)))
        ),
        add(m, double(z))
      ),
      double(raise(z, add(m, real(1))))
    ),
    multiply(
      raise(real(-1), add(m, real(1))),
      bernoulli.map(
        (b, i) => {
          const k = real(2 * (i+1))
          return divide(
            multiply(real(b), factorial(subtract(add(k, m), real(1)))),
            multiply(
              raise(z, add(k, m)),
              factorial(k)
            )
          )
        }
      ).reduce<Base>((p, c) => add(p, c), real(0))
    )
  )
}

const rawPolygamma = binary(Polygamma)(
  (l, r) => calculatePolygamma(l, r) as Real,
  (l, r) => calculatePolygamma(l, r) as Complex,
)
export type PolygammaFn = typeof rawPolygamma

export const polygamma: PolygammaFn = fromMulti(
  method([real(0), _], (_l: Base, r: Base) => digamma(r))
)(rawPolygamma)

const calculateDigamma = (z: Real|Complex): Base => {
  return subtract(
    subtract(ln(z), divide(real(0.5), z)),
    bernoulli.map(
      (b, i) => {
        const k = real(2 * (i+1))
        return divide(
          real(b),
          multiply(k, raise(z, k))
        )
      }
    ).reduce<Base>((p, c) => add(p, c), real(0))
  )
}

export const digamma = unary(
  r => calculateDigamma(r) as Real,
  c => calculateDigamma(c) as Complex,
  e => new Polygamma(real(0), e)
)
