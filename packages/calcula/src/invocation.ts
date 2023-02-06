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
  equals, notEquals, lessThan, greaterThan, lessThanEquals, greaterThanEquals,
  isEquality, isStrictInequality, isLessThan, isGreaterThan,
  isLessThanEquals, isGreaterThanEquals
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
import {
  acos, asin, atan, asec, acsc, acot,
  isArcusCosine, isArcusSine, isArcusTangent,
  isArcusSecant, isArcusCosecant, isArcusCotangent
} from './functions/arcus'
import {
  cosh, sinh, tanh, sech, csch, coth,
  isHyperbolicCosine, isHyperbolicSine, isHyperbolicTangent,
  isHyperbolicSecant, isHyperbolicCosecant, isHyperbolicCotangent
} from './functions/hyperbolic'
import {
  acosh, asinh, atanh, asech, acsch, acoth,
  isAreaHyperbolicCosine, isAreaHyperbolicSine, isAreaHyperbolicTangent,
  isAreaHyperbolicSecant, isAreaHyperbolicCosecant, isAreaHyperbolicCotangent
} from './functions/areaHyperbolic'
import { factorial, isFactorial } from './functions/factorial'
import { gamma, isGamma } from './functions/gamma'
import { polygamma, isPolygamma } from './functions/polygamma'
import { parameterize } from './utility/parameterization'
import { rule } from './utility/rule'

type EvaluableNode<T extends TreeNode> = R.Reader<Scope, W.Writer<T>>
type EvaluateFn = Multi 
  & ((expression: EvaluableNode<TreeNode>) => EvaluableNode<TreeNode>)
type CorrespondingFn<T extends TreeNode> = 
  R.Reader<Scope, (node: T) => W.Action<TreeNode>>

const emptyScope = createScope()

const guardFrom = <T extends TreeNode>(guard: TreeNodeGuardFn<T>) =>
  (expression: EvaluableNode<T>) => guard(expression(emptyScope))

const constant = <T extends PrimitiveNode>(): CorrespondingFn<T> => 
  _ => (n: T): W.Action<T> => [n, rule`${n}`, `invoked ${n.species}`]

const binary = <T extends BinaryNode, R>(b: BinaryFn<T, R>): CorrespondingFn<T> =>
  scope => (e: BinaryNode): W.Action<T> => [
    b(evaluate(s => e.left)(scope), evaluate(s => e.right)(scope)), 
    rule`[${e}](${scope})`,
    `invoked ${e.species}`
  ]

const unary = <T extends UnaryNode, R>(u: UnaryFn<T, R>): CorrespondingFn<T> =>
  scope => (e: UnaryNode): W.Action<T> => [
    u(evaluate(s => e.expression)(scope)),
    rule`[${e}](${scope})`,
    `invoked ${e.species}`
  ]

const when = <T extends TreeNode>(guard: TreeNodeGuardFn<T>, fn: CorrespondingFn<T>) =>
  method(
    guardFrom(guard),
    (reader: EvaluableNode<T>) => R.bind(reader)<W.Writer<TreeNode>>(
      writer => scope => W.bind(writer, input => {
        const [result, rewrite, action] = fn(scope)(input)
        return ({
          value: W.isWriter(result) ? result.value : result,
          log: [
            {input: rule`(${input})(${scope})`, rewrite, action},
            ...(W.isWriter(result) ? result.log : [])
          ]
        })
      })
    )
  )

const evaluate: EvaluateFn = multi(
  when(isReal, constant<Real>()),
  when(isComplex, constant<Complex>()),
  when(isBoolean, constant<Boolean>()),

  when(isVariable, scope => v => [
    scope.get(v.name)?.result.value ?? v, 
    rule`${scope.get(v.name)?.result.value ?? v}`,
    `${scope.get(v.name)?.result.value ? 'substituting' : 'invoking'} variable ${v.name}`
  ]),

  when(isAddition, binary(add)),
  when(isMultiplication, binary(multiply)),
  when(isExponentiation, binary(raise)),
  when(isLogarithm, binary(log)),

  when(isEquality, binary(equals)),
  when(isStrictInequality, binary(notEquals)),
  when(isLessThan, binary(lessThan)),
  when(isGreaterThan, binary(greaterThan)),
  when(isLessThanEquals, binary(lessThanEquals)),
  when(isGreaterThanEquals, binary(greaterThanEquals)),

  when(isComplement, unary(not)),
  when(isConjunction, binary(and)),
  when(isDisjunction, binary(or)),
  when(isExclusiveDisjunction, binary(xor)),
  when(isImplication, binary(implies)),
  when(isAlternativeDenial, binary(nand)),
  when(isJointDenial, binary(nor)),
  when(isBiconditional, binary(xnor)),
  when(isConverseImplication, binary(converse)),

  when(isPermutation, binary(permute)),
  when(isCombination, binary(combine)),

  when(isAbsolute, unary(abs)),

  when(isCosine, unary(cos)),
  when(isSine, unary(sin)),
  when(isTangent, unary(tan)),
  when(isSecant, unary(sec)),
  when(isCosecant, unary(csc)),
  when(isCotangent, unary(cot)),

  when(isArcusCosine, unary(acos)),
  when(isArcusSine, unary(asin)),
  when(isArcusTangent, unary(atan)),
  when(isArcusSecant, unary(asec)),
  when(isArcusCosecant, unary(acsc)),
  when(isArcusCotangent, unary(acot)),
  
  when(isHyperbolicCosine, unary(cosh)),
  when(isHyperbolicSine, unary(sinh)),
  when(isHyperbolicTangent, unary(tanh)),
  when(isHyperbolicSecant, unary(sech)),
  when(isHyperbolicCosecant, unary(csch)),
  when(isHyperbolicCotangent, unary(coth)),
  
  when(isAreaHyperbolicCosine, unary(acosh)),
  when(isAreaHyperbolicSine, unary(asinh)),
  when(isAreaHyperbolicTangent, unary(atanh)),
  when(isAreaHyperbolicSecant, unary(asech)),
  when(isAreaHyperbolicCosecant, unary(acsch)),
  when(isAreaHyperbolicCotangent, unary(acoth)),

  when(isFactorial, unary(factorial)),
  when(isGamma, unary(gamma)),
  when(isPolygamma, binary(polygamma))
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
