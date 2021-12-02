import { Binary, binary } from './binary'
import { real } from './real'
import { complex } from './complex'

export class Polygamma extends Binary {
  readonly $kind = 'Polygamma'
}

// The first 2n Bernoulli numbers, n > 0. e.g. B(2), B(4), B(6), ...
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

// digamma(): T {
//   const one = this.cast(1)
//   if(this.isNegative()){
//     // reflection
//     const pi = this.cast(Math.PI)
//     return this.negate().add(one).digamma().subtract(
//       pi.divide(this.multiply(pi).tan())
//     )
//   // } else if(this.isInteger()){
//   //   // integer implementation
//   // } else if(this.isHalfInteger()){
//   //   // half integer implementation
//   } else if(this.lt(this.cast(10))){
//     // recurrence up toward 10
//     return this.add(one).digamma().subtract(this.raise(one.negate()))
//   } else {
//     // values greater than 10
//     const two = this.cast(2), zero = this.cast(0)
//     return this.ln().subtract(one.divide(this.multiply(two))).subtract(
//       bernoulli.reduce(
//         (sum, b, n) => {
//           const twiceN = this.cast(n).add(one).multiply(two)
//           return sum.add(this.cast(b)).divide(
//             twiceN.multiply(this.raise(twiceN))
//           )
//         }, 
//         zero
//       )
//     )
//   }
// }

// visitPolygamma(node: Polygamma): Tree {
//   const e = node.expression.accept(this)
//   const order = node.order.accept(this)
//   return match<Tree, Tree>(e)
//     .with(instanceOf(Real), instanceOf(Complex), e => e.digamma())
//     .otherwise(e => polygamma(order, e))
// }

export const polygamma = binary(
  (l, r) => real(NaN),
  (l, r) => complex(NaN, NaN),
  (l, r) => complex(NaN, NaN),
  (l, r) => complex(NaN, NaN),
  (l, r) => new Polygamma(l, r)
)
export type PolygammaFn = typeof polygamma

// export const digamma = fixLeft(polygamma, Real.Zero)
