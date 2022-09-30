import { Writer, unit } from "../monads/writer"
import { Multi, multi, method } from "@arrows/multimethod"
import { TreeNode, Species } from "../utility/tree"
import { Real, Complex, real, boolean, isReal, isComplex } from "../primitives"
import { Unary, unary, when } from "../closures/unary"
import { 
  add, subtract, multiply, divide, negate, raise, sqrt 
} from "../arithmetic"
import { sin } from "./trigonometric"
import { factorial } from "./factorial"

const isPIN = (n: number) => n > 0 && n <= 15 && Number.isInteger(n)

const isPositiveInteger = (e: Writer<TreeNode>) =>
  (isReal(e) && isPIN(e.value.value))
  || (isComplex(e) && e.value.b === 0 && isPIN(e.value.a))


export type Predicate<T extends TreeNode> = (t: T) => boolean

export type ConstantPredicate = Multi 
  & Predicate<Real>
  & Predicate<Complex>  

const isSmall: ConstantPredicate = multi(
  method(isReal, (r: Writer<Real>) => r.value.value < 0.5),
  method(isComplex, (c: Writer<Complex>) => c.value.a < 0.5),
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
const gammaReflection = (e: Writer<TreeNode>): Writer<TreeNode> =>
  divide(
    pi,
    multiply(sin(multiply(e, pi)), gamma(subtract(real(1), e)))
  )

const calculateGamma = (input: Writer<Real|Complex>): Writer<TreeNode> => {
  const one = real(1)
  const z = subtract(input, one)
  const x = lanczos.p.reduce(
    (s, v, i) => add(s, divide(real(v), add(z, add(real(i), one)))),
    real(0.99999999999980993) as Writer<TreeNode>
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

export const [gamma, isGamma, $gamma] = unary<Gamma>(Species.gamma)(
  r => [calculateGamma(unit(r)) as Writer<Real>, 'computed real gamma'],
  c => [calculateGamma(unit(c)) as Writer<Complex>, 'computed complex gamma'],
  b => [boolean(calculateGamma(real(b.value ? 1 : 0)) as Writer<Real>), 'computed boolean gamma']
)(
  when(
    isPositiveInteger, 
    t => [factorial(subtract(unit(t), real(1))), 'computing gamma via factorial']
  ),
  when(
    t => (isReal(t) && t.value.value < 0.5)
      || (isComplex(t) && t.value.a < 0.5),
    t => [gammaReflection(unit(t)), 'gamma reflection for small value']
  )
)
