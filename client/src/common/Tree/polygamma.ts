import { fromMulti, multi, Multi, method } from '@arrows/multimethod'
import { Base } from './Expression'
import { Binary, binary } from './binary'
import { unary } from './unary'
import { Real, real } from './real'
import { Complex } from './complex'
import { variable } from './variable'
import { add, subtract } from './addition'
import { multiply, divide, double } from './multiplication'
import { raise } from './exponentiation'
import { cot } from './trigonometric'
import { ln } from './logarithmic'
import { factorial } from './factorial'
import { abs } from './absolute'
import { is } from './predicates'
import { reciprocal } from './exponentiation'
import { differentiate } from './differentiation'
import { invoke } from './invocation'

export class Polygamma extends Binary {
  readonly $kind = 'Polygamma'
}

const isNegative = (e: Base) => is(Real)(e) && e.value < 0

type IsSmallFn = Multi & ((r: Real) => boolean) & ((c: Complex) => boolean)

// 10 is arbitrary, but inputs around that comport with Wolfram-Alpha
const isSmall: IsSmallFn = multi(
  method(is(Real), (r: Real) => r.value < 10),
  method(is(Complex), (c: Complex) => abs(c).a < 10),
  method(false)
)

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

const sum = (fn: (b: Real, k: Real) => Base) => 
  bernoulli.map(
    (b, i) => fn(real(b), real(2*(i+1)))
  ).reduce((p, c) => add(p, c), real(0))

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
      sum(
        (b, k) => divide(
          multiply(b, factorial(subtract(add(k, m), real(1)))),
          multiply(
            raise(z, add(k, m)),
            factorial(k)
          )
        )
      )
    )
  )
}

const polygammaReflection = (m: Base, z: Base) => {
  const pi = real(Math.PI)
  const order = real(is(Real)(m) ? m.value : is(Complex)(m) ? m.a : 0)
  const d = differentiate(order, cot(multiply(pi, variable('x'))))
  return subtract(
    multiply(
      raise(real(-1), m),
      polygamma(m, subtract(real(1), z))
    ),
    multiply(pi, invoke()(d)(z))
  )
}

const polygammaRecurrence = (m: Base, z: Base) => {
  return subtract(
    polygamma(m, add(z, real(1))),
    divide(
      multiply(raise(real(-1), m), factorial(m)),
      raise(z, add(m, real(1)))
    )
  )
}

const rawPolygamma = binary(Polygamma)(
  (l, r) => calculatePolygamma(l, r) as Real,
  (l, r) => calculatePolygamma(l, r) as Complex,
)
export type PolygammaFn = typeof rawPolygamma

export const polygamma: PolygammaFn = fromMulti(
  method([real(0), is(Base)], (_l: Base, r: Base) => digamma(r)),
  method([is(Real), isNegative], (l: Base, r: Base) => polygammaReflection(l, r)),
  method([is(Real), isSmall], (l: Base, r: Base) => polygammaRecurrence(l, r))
)(rawPolygamma)

const calculateDigamma = (z: Real|Complex): Base => {
  return subtract(
    subtract(ln(z), divide(real(0.5), z)),
    sum(
      (b, k) => divide(b, multiply(k, raise(z, k)))
    )
  )
}

const digammaReflection = (e: Base) => {
  const pi = real(Math.PI)
  return subtract(
    digamma(subtract(real(1), e)),
    multiply(pi, cot(multiply(pi, e)))
  )
}

const digammaRecurrence = (e: Base) => {
  return subtract(
    digamma(add(e, real(1))),
    reciprocal(e)
  )
}

const rawDigamma = unary(
  r => calculateDigamma(r) as Real,
  c => calculateDigamma(c) as Complex,
  e => new Polygamma(real(0), e)
)
export type DigammaFn = typeof rawDigamma

export const digamma: DigammaFn = fromMulti(
  method(isNegative, (e: Base) => digammaReflection(e)),
  method(isSmall, (e: Base) => digammaRecurrence(e))
)(rawDigamma)
