import { Writer } from "../monads/writer"
import { Operation } from "../utility/operation"
import { Multi, multi, method } from "@arrows/multimethod"
import { TreeNode, Species, Notation } from "../utility/tree"
import { Real, Complex, real, boolean, isReal, isComplex } from "../primitives"
import { Unary, unary, when } from "../closures/unary"
import { 
  add, subtract, multiply, divide, negate, raise, sqrt 
} from "../arithmetic"
import { sin } from "./trigonometric"
import { factorial } from "./factorial"
import { Unicode } from "../Unicode"

const isPIN = (n: number) => n > 0 && n <= 15 && Number.isInteger(n)

const isPositiveInteger = (e: Writer<TreeNode, Operation>) =>
  (isReal(e) && isPIN(e.value.raw))
  || (isComplex(e) && e.value.raw.b === 0 && isPIN(e.value.raw.a))


export type Predicate<T extends TreeNode> = (t: T) => boolean

export type ConstantPredicate = Multi 
  & Predicate<Real>
  & Predicate<Complex>  

const isSmall: ConstantPredicate = multi(
  method(isReal, (r: Writer<Real, Operation>) => r.value.raw < 0.5),
  method(isComplex, (c: Writer<Complex, Operation>) => c.value.raw.a < 0.5),
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

const pi = real(Math.PI), sqrtTwicePi = sqrt(real(2 * Math.PI))
const gammaReflection = (e: Writer<TreeNode, Operation>): Writer<TreeNode, Operation> =>
  divide(
    pi,
    multiply(sin(multiply(e, pi)), gamma(subtract(real(1), e)))
  )

const calculateGamma = (input: Writer<Real|Complex, Operation>): Writer<TreeNode, Operation> => {
  const one = real(1)
  const z = subtract(input, one)
  const x = lanczos.p.reduce(
    (s, v, i) => add(s, divide(real(v), add(z, add(real(i), one)))),
    real(0.99999999999980993) as Writer<TreeNode, Operation>
  )
  const t = subtract(add(z, real(lanczos.p.length)), real(0.5))
  return multiply(
    sqrtTwicePi,
    multiply(
      raise(t, add(z, real(0.5))),
      multiply(raise(real(Math.E), negate(t)), x)
    )
  )
}

export type Gamma = Unary<Species.gamma>

export const [gamma, isGamma, $gamma] = unary<Gamma>(
  Unicode.gamma, Notation.prefix, Species.gamma
)(
  r => calculateGamma(r) as Writer<Real, Operation>,
  c => calculateGamma(c) as Writer<Complex, Operation>, 
  b => boolean(calculateGamma(real(b.value ? 1 : 0)) as Writer<Real, Operation>)
)(
  when(
    isPositiveInteger, 
    t => [factorial(subtract(t, real(1))), 'computing gamma via factorial']
  ),
  when(
    t => (isReal(t) && t.value.raw < 0.5)
      || (isComplex(t) && t.value.raw.a < 0.5),
    t => [gammaReflection(t), 'gamma reflection for small value']
  )
)
