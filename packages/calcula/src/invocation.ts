import { multi, method, Multi } from '@arrows/multimethod'
import * as R from './monads/reader'
import * as W from './monads/writer'
import { 
  Particle, Operation, Action, operation, context, interleave
} from './utility/operation'
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
import { 
  LogFunctionalFn, processLogs, processed, processing 
} from './utility/processLogs'

type EvaluableNode<T extends TreeNode> = R.Reader<Scope, W.Writer<T, Operation>>
type EvaluateFn = Multi 
  & ((expression: EvaluableNode<TreeNode>) => EvaluableNode<TreeNode>)
type CorrespondingFn<T extends TreeNode> = 
  R.Reader<Scope, (node: W.Writer<T, Operation>) => Action<TreeNode>>

const emptyScope = createScope()

const guardFrom = <T extends TreeNode>(guard: TreeNodeGuardFn<T>) =>
  (expression: EvaluableNode<T>) => guard(expression(emptyScope))

const constant = <T extends PrimitiveNode>(): CorrespondingFn<T> => 
  _ => (n: W.Writer<T, Operation>): Action<T> => [
    n, `evaluating ${n.value.species.toLocaleLowerCase()}`
  ]

const binary = <T extends BinaryNode, R>(b: BinaryFn<T, R>): CorrespondingFn<T> =>
  scope => (e: W.Writer<BinaryNode, Operation>): Action<T> => [
    b(evaluate(s => e.value.left)(scope), evaluate(s => e.value.right)(scope)), 
    'looking for variables to substitute in expression'
  ]

const unary = <T extends UnaryNode, R>(u: UnaryFn<T, R>): CorrespondingFn<T> =>
  scope => (e: W.Writer<UnaryNode, Operation>): Action<T> => [
    u(evaluate(s => e.value.expression)(scope)),
    'looking for variables to substitute in expression'
  ]

const when = <T extends TreeNode>(guard: TreeNodeGuardFn<T>, fn: CorrespondingFn<T>) =>
  method(
    guardFrom(guard),
    (reader: EvaluableNode<T>) => R.bind(reader)<W.Writer<TreeNode, Operation>>(
      e => scope => {
        const [result, action] = fn(scope)(W.curate(e))
        return W.writer(result, operation(context(e, -1), action))
      }
    )
  )

const evaluate: EvaluateFn = multi(
  when(isReal, constant<Real>()),
  when(isComplex, constant<Complex>()),
  when(isBoolean, constant<Boolean>()),

  when(isVariable, scope => v => [
    scope.get(v.value.name)?.value.binding ?? v, 
    `${
      scope.get(v.value.name)?.value.binding 
      ? 'substituting' 
      : 'no substitution found in scope for'
    } variable ${v.value.name}`
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

const toParticles = (expression: Particle[]) => 
  (...parameters: Particle[][]): Particle[] =>
    ['(', expression, ')', '(', ...interleave(parameters, ','), ')']

const logFunctional = (
  expression: W.Writer<TreeNode, Operation>
): LogFunctionalFn => { 
  const tp = toParticles(context(expression, -1))
  const lf = processLogs(tp, Species.invoke)
  return (action, ...expressions) => {
    const unprocessed = expressions.map(e => context(e, 0))
    const [identify, ...parameters] = lf(action, ...expressions)
    return [
      identify,
      operation(
        toParticles(processing(context(expression, 0)))(...unprocessed), 
        'processing expression'
      ),
      ...expression.log,
      operation(
        toParticles(processed(context(expression, -1)))(...unprocessed),
        'processed expression'
      ),
      ...parameters
    ]
  }
}

const logScope = (scope: Scope): Operation =>
  operation(
    [
      '{', 
      Array.from(
        scope.entries(), 
        ([k, v], i) => {
          const r = [k, ':=', context(v.value.binding, -1)] as Particle[]
          return i+1 < scope.size ? [r, ','] : [r]
        }
      ).flat(1), 
      '}'
    ], 
    'established scope'
  )

// Ideally, this would generate a number of contextually global logs for
// the operation being executed, so that the when steps are minimally complex.
// Likely the best approach would be to capture the [value, log] pair
// from the evaluate call and use those in a writer call.
export const invoke = (scope?: Scope) => {
  const inner = createScope(scope)
  return (expression: W.Writer<TreeNode, Operation>) => {
    const parameters = parameterize(expression)
    const mExpression = R.unit<Scope, W.Writer<TreeNode, Operation>>(expression)
    const lf = logFunctional(expression)
    return (...args: W.Writer<TreeNode, Operation>[]): W.Writer<TreeNode, Operation> => {
      for(const [name, value] of zip(parameters, args)) {
        inner.set(name, variable(name, value))
      }
      // return evaluate(mExpression)(inner)
      const {value, log} = evaluate(mExpression)(inner)
      return W.writer(
        value,
        // Insert contextually global, "setup" logs here. The ...log after
        // this would then be the when operations performed to produce the
        // result. 
        ...lf(`${expression.value.species.toLocaleLowerCase()} invocation`, ...args),
        logScope(inner),
        ...log
      )
    }
  }
}
