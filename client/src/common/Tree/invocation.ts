import { method, multi, Multi } from '@arrows/multimethod'
import { Base } from './Expression'
import { Binary } from './binary'
import { Unary } from './unary'
import { Scope, scope as createScope } from './scope'
import { Real } from './real'
import { Complex } from './complex'
import { Variable, variable } from './variable'
import { Addition, add } from './addition'
import { Multiplication, multiply } from './multiplication'
import { Exponentiation, raise } from './exponentiation'
import { Logarithm, log } from './logarithmic'
import { AbsoluteValue, abs } from './absolute'
import {
  Cosine, Sine, Tangent, Secant, Cosecant, Cotangent,
  cos, sin, tan, sec, csc, cot
} from './trigonometric'
import {
  ArcusCosine, ArcusSine, ArcusTangent,
  ArcusSecant, ArcusCosecant, ArcusCotangent,
  acos, asin, atan, asec, acsc, acot
} from './arcus'
import { 
  HyperbolicCosine, HyperbolicSine, HyperbolicTangent,
  HyperbolicSecant, HyperbolicCosecant, HyperbolicCotangent,
  cosh, sinh, tanh, sech, csch, coth 
} from './hyperbolic'
import {
  AreaHyperbolicCosine, AreaHyperbolicSine, AreaHyperbolicTangent,
  AreaHyperbolicSecant, AreaHyperbolicCosecant, AreaHyperbolicCotangent,
  acosh, asinh, atanh, asech, acsch, acoth
} from './areaHyperbolic'
import { Factorial, factorial } from './factorial'
import { Gamma, gamma } from './gamma'
import { Polygamma, polygamma } from './polygamma'

const constant = <T>() => (_s: Scope, n: T) => n
const binary = (b: (...args: Base[]) => Base) => 
  (s: Scope, e: Binary) => b(evaluate(s, e.left), evaluate(s, e.right))
const unary = (u: (arg: Base) => Base) => 
  (s: Scope, e: Unary) => u(evaluate(s, e.expression))

type EvaluateFn = Multi & ((scope: Scope, expression: Base) => Base)

const evaluate: EvaluateFn = multi(
  (_scope: Scope, expression: Base) => expression,
  method(Real, constant<Real>()),
  method(Complex, constant<Complex>()),
  method(Variable, (s: Scope, v: Variable) => s.get(v.name)?.value ?? v),

  method(Addition, binary(add)),
  method(Multiplication, binary(multiply)),
  method(Exponentiation, binary(raise)),
  method(Logarithm, binary(log)),

  method(AbsoluteValue, unary(abs)),

  method(Cosine, unary(cos)),
  method(Sine, unary(sin)),
  method(Tangent, unary(tan)),
  method(Secant, unary(sec)),
  method(Cosecant, unary(csc)),
  method(Cotangent, unary(cot)),

  method(ArcusCosine, unary(acos)),
  method(ArcusSine, unary(asin)),
  method(ArcusTangent, unary(atan)),
  method(ArcusSecant, unary(asec)),
  method(ArcusCosecant, unary(acsc)),
  method(ArcusCotangent, unary(acot)),

  method(HyperbolicCosine, unary(cosh)),
  method(HyperbolicSine, unary(sinh)),
  method(HyperbolicTangent, unary(tanh)),
  method(HyperbolicSecant, unary(sech)),
  method(HyperbolicCosecant, unary(csch)),
  method(HyperbolicCotangent, unary(coth)),

  method(AreaHyperbolicCosine, unary(acosh)),
  method(AreaHyperbolicSine, unary(asinh)),
  method(AreaHyperbolicTangent, unary(atanh)),
  method(AreaHyperbolicSecant, unary(asech)),
  method(AreaHyperbolicCosecant, unary(acsch)),
  method(AreaHyperbolicCotangent, unary(acoth)),

  method(Factorial, unary(factorial)),
  method(Gamma, unary(gamma)),
  method(
    (v: unknown) => v instanceof Polygamma, 
    (s: Scope, e: Binary) => polygamma(evaluate(s, e.left), evaluate(s, e.right))
  )
)

const union = <T>(a: Set<T>, b: Set<T>) => {
  const r = new Set<T>(a)
  for(const i of b){
    r.add(i)
  }
  return r
}

type ParameterizeFn = Multi
  & ((expression: Base) => Set<string>)

// Potential speed boost alternative: write this as generators, and
// coalesce the resulting iterable externally.
export const parameterize: ParameterizeFn = multi(
  method(Variable, (v: Variable) => new Set(v.name)),
  method(Binary, (b: Binary) => union(parameterize(b.left), parameterize(b.right))),
  method(Unary, (u: Unary) => parameterize(u.expression)),
  method(new Set<string>())
)

function* zip<T, U>(parameters: Set<T>, args: U[]) {
  let i = 0
  for(const name of parameters){
    if(args[i]){ yield [name, args[i]] as const }
    i++
  }
}

export const invoke = (scope?: Scope) => {
  const inner = createScope(scope)
  return (expression: Base) => {
    const parameters = parameterize(expression)
    return (...args: Base[]): Base => {
      for(const [name, value] of zip(parameters, args)) {
        inner.set(name, variable(name, value))
      }
      return evaluate(inner, expression)
    }
  }
}
