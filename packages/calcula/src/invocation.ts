// import { method, multi, Multi } from '@arrows/multimethod'
// import { is } from './is'
// import { Base } from './Expression'
// import { Binary } from './binary'
// import { Unary } from './unary'
// import { Scope, scope as createScope } from './scope'
// import { Real } from './real'
// import { Complex } from './complex'
// import { Variable, variable } from './variable'
// import { Addition, add } from './addition'
// import { Multiplication, multiply } from './multiplication'
// import { Exponentiation, raise } from './exponentiation'
// import { Logarithm, log } from './logarithmic'
// import { AbsoluteValue, abs } from './absolute'
// import {
//   Cosine, Sine, Tangent, Secant, Cosecant, Cotangent,
//   cos, sin, tan, sec, csc, cot
// } from './trigonometric'
// import {
//   ArcusCosine, ArcusSine, ArcusTangent,
//   ArcusSecant, ArcusCosecant, ArcusCotangent,
//   acos, asin, atan, asec, acsc, acot
// } from './arcus'
// import { 
//   HyperbolicCosine, HyperbolicSine, HyperbolicTangent,
//   HyperbolicSecant, HyperbolicCosecant, HyperbolicCotangent,
//   cosh, sinh, tanh, sech, csch, coth 
// } from './hyperbolic'
// import {
//   AreaHyperbolicCosine, AreaHyperbolicSine, AreaHyperbolicTangent,
//   AreaHyperbolicSecant, AreaHyperbolicCosecant, AreaHyperbolicCotangent,
//   acosh, asinh, atanh, asech, acsch, acoth
// } from './areaHyperbolic'
// import { Factorial, factorial } from './factorial'
// import { Gamma, gamma } from './gamma'
// import { Polygamma, polygamma } from './polygamma'
// import { Permutation, Combination, permute, combine } from './combinatorics'
// import { 
//   Equals, NotEquals, LessThan, GreaterThan, LessThanEquals, GreaterThanEquals,
//   equals, notEquals, lessThan, greaterThan, lessThanEquals, greaterThanEquals
// } from './inequality'
// import {
//   LogicalComplement,
//   Conjunction, Disjunction, ExclusiveDisjunction, Implication,
//   AlternativeDenial, JointDenial, Biconditional, ConverseImplication,
//   not,
//   and, or, xor, implies,
//   nand, nor, xnor, converse
// } from './connective'

// type EvaluateFn = Multi & ((expression: Base) => Base)

// const createEvaluate = (scope: Scope) => {
//   const constant = <T>() => (n: T) => n
//   const binary = (b: (...args: Base[]) => Base) => 
//     (e: Binary) => b(fn(e.left), fn(e.right))
//   const unary = (u: (arg: Base) => Base) => 
//     (e: Unary) => u(fn(e.expression))

//   const fn: EvaluateFn = multi(
//     method(is(Real), constant<Real>()),
//     method(is(Complex), constant<Complex>()),
//     method(is(Variable), (v: Variable) => scope.get(v.name)?.value ?? v),
  
//     method(is(Addition), binary(add)),
//     method(is(Multiplication), binary(multiply)),
//     method(is(Exponentiation), binary(raise)),
//     method(is(Logarithm), binary(log)),

//     method(is(Equals), binary(equals)),
//     method(is(NotEquals), binary(notEquals)),
//     method(is(LessThan), binary(lessThan)),
//     method(is(GreaterThan), binary(greaterThan)),
//     method(is(LessThanEquals), binary(lessThanEquals)),
//     method(is(GreaterThanEquals), binary(greaterThanEquals)),
//     method(is(LogicalComplement), unary(not)),

//     method(is(Conjunction), binary(and)),
//     method(is(Disjunction), binary(or)),
//     method(is(ExclusiveDisjunction), binary(xor)),
//     method(is(Implication), binary(implies)),
//     method(is(AlternativeDenial), binary(nand)),
//     method(is(JointDenial), binary(nor)),
//     method(is(Biconditional), binary(xnor)),
//     method(is(ConverseImplication), binary(converse)),

//     method(is(Permutation), binary(permute)),
//     method(is(Combination), binary(combine)),
  
//     method(is(AbsoluteValue), unary(abs)),
  
//     method(is(Cosine), unary(cos)),
//     method(is(Sine), unary(sin)),
//     method(is(Tangent), unary(tan)),
//     method(is(Secant), unary(sec)),
//     method(is(Cosecant), unary(csc)),
//     method(is(Cotangent), unary(cot)),
  
//     method(is(ArcusCosine), unary(acos)),
//     method(is(ArcusSine), unary(asin)),
//     method(is(ArcusTangent), unary(atan)),
//     method(is(ArcusSecant), unary(asec)),
//     method(is(ArcusCosecant), unary(acsc)),
//     method(is(ArcusCotangent), unary(acot)),
  
//     method(is(HyperbolicCosine), unary(cosh)),
//     method(is(HyperbolicSine), unary(sinh)),
//     method(is(HyperbolicTangent), unary(tanh)),
//     method(is(HyperbolicSecant), unary(sech)),
//     method(is(HyperbolicCosecant), unary(csch)),
//     method(is(HyperbolicCotangent), unary(coth)),
  
//     method(is(AreaHyperbolicCosine), unary(acosh)),
//     method(is(AreaHyperbolicSine), unary(asinh)),
//     method(is(AreaHyperbolicTangent), unary(atanh)),
//     method(is(AreaHyperbolicSecant), unary(asech)),
//     method(is(AreaHyperbolicCosecant), unary(acsch)),
//     method(is(AreaHyperbolicCotangent), unary(acoth)),
  
//     method(is(Factorial), unary(factorial)),
//     method(is(Gamma), unary(gamma)),
//     method(
//       (v: unknown) => v instanceof Polygamma, 
//       (e: Binary) => polygamma(fn(e.left), fn(e.right))
//     )
//   )
//   return fn
// }

// const union = <T>(a: Set<T>, b: Set<T>) => {
//   const r = new Set<T>(a)
//   for(const i of b){
//     r.add(i)
//   }
//   return r
// }

// type ParameterizeFn = Multi
//   & ((expression: Base) => Set<string>)

// // Potential speed boost alternative: write this as generators, and
// // coalesce the resulting iterable externally.
// export const parameterize: ParameterizeFn = multi(
//   method(is(Variable), (v: Variable) => new Set(v.name)),
//   method(is(Binary), (b: Binary) => union(parameterize(b.left), parameterize(b.right))),
//   method(is(Unary), (u: Unary) => parameterize(u.expression)),
//   method(new Set<string>())
// )

import { multi, method, Multi } from '@arrows/multimethod'
import * as R from './monads/reader'
import * as W from './monads/writer'
import { TreeNode, TreeNodeGuardFn, Species } from "./utility/tree"
import { PrimitiveNode } from './primitives'
import { UnaryNode, UnaryFn } from './closures/unary'
import { BinaryNode, BinaryFn } from './closures/binary'
import { 
  Real, Complex, Boolean,
  isReal, isComplex, isBoolean 
} from './primitives'
import { variable, Scope, scope as createScope, isVariable } from "./variable"
import { 
  add, multiply, raise,
  isAddition, isMultiplication, isExponentiation
} from './arithmetic'
import { log, isLogarithm } from './functions/logarithmic'
import { 
  equals, 
  isEquality 
} from './functions/inequality'
import { 
  not, and, or, xor, implies, nand, nor, xnor, converse,
  isComplement, isConjunction, isDisjunction, isExclusiveDisjunction,
  isImplication, isAlternativeDenial, isJointDenial, isBiconditional,
  isConverseImplication
} from './functions/connectives'
import { 
  permute, combine,
  isPermutation, isCombination
} from './functions/combinatorics'
import { abs, isAbsolute } from './functions/absolute'
import { 
  cos, sin, tan, sec, csc, cot,
  isCosine, isSine, isTangent, isSecant, isCosecant, isCotangent
} from './functions/trigonometric'
import { parameterize } from './utility/parameterization'

type EvaluableNode<T extends TreeNode> = R.Reader<Scope, W.Writer<T>>
type EvaluateFn = Multi 
  & ((expression: EvaluableNode<TreeNode>) => EvaluableNode<TreeNode>)
type CorrespondingFn<T extends TreeNode> = 
  R.Reader<Scope, (node: T) => W.Action<TreeNode>>

const emptyScope = createScope()

const guardFrom = <T extends TreeNode>(guard: TreeNodeGuardFn<T>) =>
  (expression: EvaluableNode<T>) => guard(expression(emptyScope))

const constant = <T extends PrimitiveNode>(species: Species): CorrespondingFn<T> => 
  _ => (n: T): W.Action<T> => [n, `invoked ${species}`]

const binary = <T extends BinaryNode, R>(b: BinaryFn<T, R>, species: Species): CorrespondingFn<T> =>
  scope => (e: BinaryNode): W.Action<T> => [
    b(evaluate(s => e.left)(scope), evaluate(s => e.right)(scope)), 
    `invoked ${species}`
  ]

const unary = <T extends UnaryNode, R>(u: UnaryFn<T, R>, species: Species): CorrespondingFn<T> =>
  scope => (e: UnaryNode): W.Action<T> => [
    u(evaluate(s => e.expression)(scope)),
    `invoked ${species}`
  ]

const when = <T extends TreeNode>(guard: TreeNodeGuardFn<T>, fn: CorrespondingFn<T>) =>
  method(
    guardFrom(guard),
    (reader: EvaluableNode<T>) => R.bind(reader)<W.Writer<TreeNode>>(
      writer => scope => W.bind(writer, input => {
        const [result, action] = fn(scope)(input)
        return ({
          value: W.isWriter(result) ? result.value : result,
          log: [
            {input, action},
            ...(W.isWriter(result) ? result.log : [])
          ]
        })
      })
    )
  )

const evaluate: EvaluateFn = multi(
  when(isReal, constant<Real>(Species.real)),
  when(isComplex, constant<Complex>(Species.complex)),
  when(isBoolean, constant<Boolean>(Species.boolean)),

  when(isVariable, scope => v => [
    scope.get(v.name)?.value.value ?? v, 
    `${scope.get(v.name)?.value.value ? 'substituting' : 'invoking'} variable ${v.name}`
  ]),

  when(isAddition, binary(add, Species.add)),
  when(isMultiplication, binary(multiply, Species.multiply)),
  when(isExponentiation, binary(raise, Species.raise)),
  when(isLogarithm, binary(log, Species.log)),

//     method(is(Equals), binary(equals)),
//     method(is(NotEquals), binary(notEquals)),
//     method(is(LessThan), binary(lessThan)),
//     method(is(GreaterThan), binary(greaterThan)),
//     method(is(LessThanEquals), binary(lessThanEquals)),
//     method(is(GreaterThanEquals), binary(greaterThanEquals)),
  when(isEquality, binary(equals, Species.equals)),

  when(isComplement, unary(not, Species.not)),
  when(isConjunction, binary(and, Species.and)),
  when(isDisjunction, binary(or, Species.or)),
  when(isExclusiveDisjunction, binary(xor, Species.xor)),
  when(isImplication, binary(implies, Species.implies)),
  when(isAlternativeDenial, binary(nand, Species.nand)),
  when(isJointDenial, binary(nor, Species.nor)),
  when(isBiconditional, binary(xnor, Species.xnor)),
  when(isConverseImplication, binary(converse, Species.converse)),

  when(isPermutation, binary(permute, Species.permute)),
  when(isCombination, binary(combine, Species.combine)),

  when(isAbsolute, unary(abs, Species.abs)),

  when(isCosine, unary(cos, Species.cos)),
  when(isSine, unary(sin, Species.sin)),
  when(isTangent, unary(tan, Species.tan)),
  when(isSecant, unary(sec, Species.sec)),
  when(isCosecant, unary(csc, Species.csc)),
  when(isCotangent, unary(cot, Species.cot)),
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
  return (expression: W.Writer<TreeNode>) => {
    const parameters = parameterize(expression)
    const mExpression = R.unit<Scope, W.Writer<TreeNode>>(expression)
    return (...args: W.Writer<TreeNode>[]): W.Writer<TreeNode> => {
      for(const [name, value] of zip(parameters, args)) {
        inner.set(name, variable(name, value))
      }
      return evaluate(mExpression)(inner)
    }
  }
}
