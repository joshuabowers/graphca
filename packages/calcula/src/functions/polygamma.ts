import { multi, method, _, Multi } from "@arrows/multimethod"
import { Writer, unit } from "../monads/writer"
import { TreeNode, Species } from "../utility/tree"
import { Real, Complex, Boolean, real, isReal, isComplex, isPrimitive } from "../primitives"
import { variable } from "../variable"
import { Binary, binary, when, partialLeft, binaryFnRule } from "../closures/binary"
import { 
  add, subtract, multiply, divide, double, raise, reciprocal
} from "../arithmetic"
import { abs } from "./absolute"
import { ln } from "./logarithmic"
import { cot } from "./trigonometric"
import { factorial } from "./factorial"
import { isValue } from "../utility/deepEquals"
import { differentiate } from "../calculus/differentiation"
import { invoke } from "../invocation"
import { Unicode } from "../Unicode"
import { unaryFnRule } from "../closures/unary"

export type Polygamma = Binary<Species.polygamma>

const isNegative = (e: Writer<TreeNode>) => isReal(e) && e.value.value < 0

type IsSmallFn = Multi 
  & ((r: Writer<Real>) => boolean) 
  & ((c: Writer<Complex>) => boolean)
  & ((v: Writer<TreeNode>) => boolean)

// 10 is arbitrary, but inputs around that comport with Wolfram-Alpha
const isSmall: IsSmallFn = multi(
  method(isReal, (r: Writer<Real>) => r.value.value < 10),
  method(isComplex, (c: Writer<Complex>) => abs(c).value.a < 10),
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
].map((b, i) => [real(b), real(2*(i+1))])

const sum = (fn: (b: Writer<Real>, k: Writer<Real>) => Writer<TreeNode>) => 
  bernoulli.map(
    ([b, i]) => fn(b, i)
  ).reduce((p, c) => add(p, c), real(0))

const calculatePolygamma = (
  m: Writer<Real|Complex|Boolean>,
  z: Writer<Real|Complex|Boolean>,
): Writer<TreeNode> => {
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

const polygammaReflection = (m: Writer<TreeNode>, z: Writer<TreeNode>) => {
  const pi = real(Math.PI)
  const order = real(isReal(m) ? m.value.value : isComplex(m) ? m.value.a : 0)
  const d = differentiate(order, cot(multiply(pi, variable('x'))))
  return subtract(
    multiply(
      raise(real(-1), m),
      polygamma(m, subtract(real(1), z))
    ),
    multiply(pi, invoke()(d)(z))
  )
}

const polygammaRecurrence = (m: Writer<TreeNode>, z: Writer<TreeNode>) => {
  return subtract(
    polygamma(m, add(z, real(1))),
    divide(
      multiply(raise(real(-1), m), factorial(m)),
      raise(z, add(m, real(1)))
    )
  )
}

const calculateDigamma = (z: Writer<Real|Complex|Boolean>): Writer<TreeNode> => {
  return subtract(
    subtract(ln(z), divide(real(0.5), z)),
    sum(
      (b, k) => divide(b, multiply(k, raise(z, k)))
    )
  )
}

const digammaReflection = (e: Writer<TreeNode>) => {
  const pi = real(Math.PI)
  return subtract(
    digamma(subtract(real(1), e)),
    multiply(pi, cot(multiply(pi, e)))
  )
}

const digammaRecurrence = (e: Writer<TreeNode>) => {
  return subtract(
    digamma(add(e, real(1))),
    reciprocal(e)
  )
}

export const polygammaRule = binaryFnRule(Unicode.digamma)
export const digammaRule = unaryFnRule(Unicode.digamma)

export const [polygamma, isPolygamma, $polygamma] = binary<Polygamma>(Species.polygamma)(
  (l, r) => [
    calculatePolygamma(unit(l), unit(r)) as Writer<Real>, 
    polygammaRule(l, r),
    'computed real polygamma'
  ],
  (l, r) => [
    calculatePolygamma(unit(l), unit(r)) as Writer<Complex>, 
    polygammaRule(l, r),
    'computed complex polygamma'
  ],
  (l, r) => [
    calculatePolygamma(unit(l), unit(r)) as Writer<Boolean>, 
    polygammaRule(l, r),
    'computed boolean polygamma'
  ]
)(
  when(
    (l, r) => isValue(real(0))(l) && isNegative(r),
    (_l, r) => [digammaReflection(unit(r)), digammaRule(r), 'digamma reflection for negative value']
  ),
  when(
    (l, r) => isValue(real(0))(l) && isSmall(r),
    (_l, r) => [digammaRecurrence(unit(r)), digammaRule(r), 'digamma recurrence for small value']
  ),
  when<Real, Real|Complex|Boolean>(
    (l, r) => isValue(real(0))(l) && isPrimitive(r),
    (_l, r) => [calculateDigamma(unit(r)), digammaRule(r), 'computed digamma']
  ),
  when(
    (l, r) => isReal(l) && isNegative(r),
    (l, r) => [
      polygammaReflection(unit(l), unit(r)), 
      polygammaRule(l, r),
      'polygamma reflection for negative value'
    ]
  ),
  when(
    (l, r) => isReal(l) && isSmall(r),
    (l, r) => [
      polygammaRecurrence(unit(l), unit(r)), 
      polygammaRule(l, r),
      'polygamma recurrence for small value'
    ]
  )
)

export const digamma = partialLeft(polygamma)(real(0))
