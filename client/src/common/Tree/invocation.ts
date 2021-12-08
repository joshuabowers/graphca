import { method, multi, Multi } from '@arrows/multimethod'
import { is } from './is'
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

type EvaluateFn = Multi & ((expression: Base) => Base)

const createEvaluate = (scope: Scope) => {
  const constant = <T>() => (n: T) => n
  const binary = (b: (...args: Base[]) => Base) => 
    (e: Binary) => b(fn(e.left), fn(e.right))
  const unary = (u: (arg: Base) => Base) => 
    (e: Unary) => u(fn(e.expression))

  const fn: EvaluateFn = multi(
    method(is(Real), constant<Real>()),
    method(is(Complex), constant<Complex>()),
    method(is(Variable), (v: Variable) => scope.get(v.name)?.value ?? v),
  
    method(is(Addition), binary(add)),
    method(is(Multiplication), binary(multiply)),
    method(is(Exponentiation), binary(raise)),
    method(is(Logarithm), binary(log)),
  
    method(is(AbsoluteValue), unary(abs)),
  
    method(is(Cosine), unary(cos)),
    method(is(Sine), unary(sin)),
    method(is(Tangent), unary(tan)),
    method(is(Secant), unary(sec)),
    method(is(Cosecant), unary(csc)),
    method(is(Cotangent), unary(cot)),
  
    method(is(ArcusCosine), unary(acos)),
    method(is(ArcusSine), unary(asin)),
    method(is(ArcusTangent), unary(atan)),
    method(is(ArcusSecant), unary(asec)),
    method(is(ArcusCosecant), unary(acsc)),
    method(is(ArcusCotangent), unary(acot)),
  
    method(is(HyperbolicCosine), unary(cosh)),
    method(is(HyperbolicSine), unary(sinh)),
    method(is(HyperbolicTangent), unary(tanh)),
    method(is(HyperbolicSecant), unary(sech)),
    method(is(HyperbolicCosecant), unary(csch)),
    method(is(HyperbolicCotangent), unary(coth)),
  
    method(is(AreaHyperbolicCosine), unary(acosh)),
    method(is(AreaHyperbolicSine), unary(asinh)),
    method(is(AreaHyperbolicTangent), unary(atanh)),
    method(is(AreaHyperbolicSecant), unary(asech)),
    method(is(AreaHyperbolicCosecant), unary(acsch)),
    method(is(AreaHyperbolicCotangent), unary(acoth)),
  
    method(is(Factorial), unary(factorial)),
    method(is(Gamma), unary(gamma)),
    method(
      (v: unknown) => v instanceof Polygamma, 
      (e: Binary) => polygamma(fn(e.left), fn(e.right))
    )
  )
  return fn
}

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
  method(is(Variable), (v: Variable) => new Set(v.name)),
  method(is(Binary), (b: Binary) => union(parameterize(b.left), parameterize(b.right))),
  method(is(Unary), (u: Unary) => parameterize(u.expression)),
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
  const evaluate = createEvaluate(inner)
  return (expression: Base) => {
    const parameters = parameterize(expression)
    return (...args: Base[]): Base => {
      for(const [name, value] of zip(parameters, args)) {
        inner.set(name, variable(name, value))
      }
      return evaluate(expression)
    }
  }
}
