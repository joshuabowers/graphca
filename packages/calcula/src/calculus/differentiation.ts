import { method, multi, Multi } from '@arrows/multimethod'
import { Writer, writer, curate } from '../monads/writer'
import { Particle, Action, Operation } from '../utility/operation'
import { parameterName, processLogs } from '../utility/processLogs'
import { 
  TreeNode, TreeNodeGuardFn, isTreeNode, isSpecies, Species 
} from '../utility/tree'
import { 
  Real,
  isReal, isComplex, isBoolean, isNil, isNaN,
  real, complex, boolean, nan
} from '../primitives'
import { isVariable } from '../variable'
import { 
  isAddition, isMultiplication, isExponentiation,
  add, subtract, multiply, divide, negate, square, sqrt, reciprocal 
} from '../arithmetic'

import { isLogarithm, ln } from '../functions/logarithmic'
import { isAbsolute, abs } from '../functions/absolute'
import { 
  isCosine, isSine, isTangent, isSecant, isCosecant, isCotangent,
  cos, sin, tan, sec, csc, cot 
} from '../functions/trigonometric'
import {
  isArcusCosine, isArcusSine, isArcusTangent,
  isArcusSecant, isArcusCosecant, isArcusCotangent,
} from '../functions/arcus'
import { 
  isHyperbolicCosine, isHyperbolicSine, isHyperbolicTangent,
  isHyperbolicSecant, isHyperbolicCosecant, isHyperbolicCotangent,
  cosh, sinh, tanh, sech, csch, coth 
} from '../functions/hyperbolic'
import {
  isAreaHyperbolicCosine, isAreaHyperbolicSine, isAreaHyperbolicTangent,
  isAreaHyperbolicSecant, isAreaHyperbolicCosecant, isAreaHyperbolicCotangent
} from '../functions/areaHyperbolic'
import { isFactorial } from '../functions/factorial'
import { isGamma } from '../functions/gamma'
import { polygamma, digamma, Polygamma } from '../functions/polygamma'
import { Unicode } from '../Unicode'

type DifferentiateFn = Multi
  & ((order: Writer<Real, Operation>, expression: Writer<TreeNode, Operation>) => Writer<TreeNode, Operation>)
  & ((expression: Writer<TreeNode, Operation>) => Writer<TreeNode, Operation>)

type CorrespondingFn<T extends TreeNode> = Action<TreeNode> 
  | ((t: Writer<T, Operation>) => Action<TreeNode>)

const toParticles = (argument: Particle[]): Particle[] =>
  [Unicode.derivative, '(', argument, ')']
const logFunctional = processLogs(toParticles, Species.differentiate)

const toParticlesNth = (order: Particle[], expression: Particle[]): Particle[] =>
  [Unicode.derivative, '(', order, ',', expression, ')']
const logFunctionalNth = processLogs(toParticlesNth, Species.differentiate)

export const when = <T extends TreeNode>(
  predicate: TreeNodeGuardFn<T>, 
  fn: CorrespondingFn<T>
) =>
  method(predicate, (t: Writer<T, Operation>) => {
    const [result, action] = typeof fn === 'function' ? fn(curate(t)) : fn
    return writer(result, ...logFunctional(action, t))
  })

const d = Unicode.derivative

const chain = (derivative: Writer<TreeNode, Operation>, argument: Writer<TreeNode, Operation>) =>
  multiply(derivative, differentiate(argument))

export const differentiate: DifferentiateFn = multi(
  // nth derivative
  method(
    (o: unknown, e: unknown) => isTreeNode(o) && isReal(o) && isTreeNode(e),
    (o: Writer<Real, Operation>, e: Writer<TreeNode, Operation>) => {
        let d: Writer<TreeNode, Operation> = e
        for(let i = 0; i < o.value.value; i++) {
          d = differentiate(d)
        }
        return writer(d, ...logFunctionalNth(
          `calculated ${parameterName(o.value.value, 0)} derivative`, o, e
        ))
    }
  ),

  // Primitives
  when(isReal, [real(0), 'derivative of a real']),
  when(isComplex, [complex([0, 0]), 'derivative of a complex number']),
  when(isBoolean, [boolean(false), 'derivative of a boolean']),
  when(isNil, [nan, 'derivative of nil']),
  when(isNaN, [nan, 'derivative of NaN']),
  when(isVariable, [real(1), 'derivative of a variable']),

  // Arithmetic
  when(isAddition, e => [ 
    add(differentiate(e.value.left), differentiate(e.value.right)),
    'derivative of an addition'
  ]),
  when(isMultiplication, e => [
    add(
      multiply(differentiate(e.value.left), e.value.right),
      multiply(e.value.left, differentiate(e.value.right))
    ),
    'derivative of a multiplication'
  ]),
  when(isExponentiation, e => [
    multiply(
      e,
      add(
        multiply(differentiate(e.value.left), divide(e.value.right, e.value.left)),
        multiply(differentiate(e.value.right), ln(e.value.left))
      )
    ),
    'derivative of an exponentiation'
  ]),

  // Functions
  when(isLogarithm, e => [
    divide(
      differentiate(e.value.right), multiply(e.value.right, ln(e.value.left))
    ),
    'derivative of a logarithm'
  ]),
  when(isAbsolute, e => [
    chain(divide(e.value.expression, e), e.value.expression),
    'derivative of an absolute value'
  ]),

  // :: Trigonometric
  when(isCosine, e => [
    chain(negate(sin(e.value.expression)), e.value.expression),
    'derivative of cosine'
  ]),
  when(isSine, e => [
    chain(cos(e.value.expression), e.value.expression),
    'derivative of sine'
  ]),
  when(isTangent, e => [
    chain(square(sec(e.value.expression)), e.value.expression),
    'derivative of tangent'
  ]),
  when(isSecant, e => [
    chain(multiply(sec(e.value.expression), tan(e.value.expression)), e.value.expression),
    'derivative of secant'
  ]),
  when(isCosecant, e => [
    chain(multiply(negate(csc(e.value.expression)), cot(e.value.expression)), e.value.expression),
    'derivative of cosecant'
  ]),
  when(isCotangent, e => [
    chain(negate(square(csc(e.value.expression))), e.value.expression),
    'derivative of cotangent'
  ]),

  // :: Arcus
  when(isArcusCosine, e => [
    negate(divide(
      differentiate(e.value.expression),
      sqrt(subtract(real(1), square(e.value.expression)))
    )),
    'derivative of arcus cosine'
  ]),
  when(isArcusSine, e => [
    chain(
      reciprocal(sqrt(subtract(real(1), square(e.value.expression)))), 
      e.value.expression
    ),
    'derivative of arcus sine'
  ]),
  when(isArcusTangent, e => [
    chain(reciprocal(add(real(1), square(e.value.expression))), e.value.expression),
    'derivative of arcus tangent'
  ]),
  when(isArcusSecant, e => [
    chain(
      reciprocal(multiply(
        abs(e.value.expression), 
        sqrt(subtract(square(e.value.expression), real(1)))
      )), 
      e.value.expression
    ),
    'derivative of arcus secant'
  ]),
  when(isArcusCosecant, e => [
    negate(chain(
      reciprocal(multiply(
        abs(e.value.expression), 
        sqrt(subtract(square(e.value.expression), real(1)))
      )), 
      e.value.expression
    )),
    'derivative of arcus cosecant'
  ]),
  when(isArcusCotangent, e => [
    negate(chain(reciprocal(add(square(e.value.expression), real(1))), e.value.expression)),
    'derivative of arcus cotangent'
  ]),

  // :: Hyperbolic
  when(isHyperbolicCosine, e => [
    chain(sinh(e.value.expression), e.value.expression),
    'derivative of hyperbolic cosine'
  ]),
  when(isHyperbolicSine, e => [
    chain(cosh(e.value.expression), e.value.expression),
    'derivative of hyperbolic sine'
  ]),
  when(isHyperbolicTangent, e => [
    chain(square(sech(e.value.expression)), e.value.expression),
    'derivative of hyperbolic tangent'
  ]),
  when(isHyperbolicSecant, e => [
    chain(
      multiply(negate(tanh(e.value.expression)), sech(e.value.expression)), 
      e.value.expression
    ),
    'derivative of hyperbolic secant'
  ]),
  when(isHyperbolicCosecant, e => [
    chain(
      multiply(negate(coth(e.value.expression)), csch(e.value.expression)),
      e.value.expression
    ),
    'derivative of hyperbolic cosecant'
  ]),
  when(isHyperbolicCotangent, e => [
    chain(
      negate(square(csch(e.value.expression))),
      e.value.expression
    ),
    'derivative of hyperbolic cotangent'
  ]),

  // :: Area Hyperbolic
  when(isAreaHyperbolicCosine, e => [
    chain(
      reciprocal(sqrt(subtract(square(e.value.expression), real(1)))),
      e.value.expression
    ),
    'derivative of area hyperbolic cosine'
  ]),
  when(isAreaHyperbolicSine, e => [
    chain(
      reciprocal(sqrt(add(real(1), square(e.value.expression)))),
      e.value.expression
    ),
    'derivative of area hyperbolic sine'
  ]),
  when(isAreaHyperbolicTangent, e => [
    chain(
      reciprocal(subtract(real(1), square(e.value.expression))),
      e.value.expression
    ),
    'derivative of area hyperbolic tangent'
  ]),
  when(isAreaHyperbolicSecant, e => [
    negate(chain(
      reciprocal(multiply(
        e.value.expression, 
        sqrt(subtract(real(1), square(e.value.expression)))
      )),
      e.value.expression
    )),
    'derivative of area hyperbolic secant'
  ]),
  when(isAreaHyperbolicCosecant, e => [
    negate(chain(
      reciprocal(multiply(
        abs(e.value.expression),
        sqrt(add(real(1), square(e.value.expression)))
      )),
      e.value.expression
    )),
    'derivative of area hyperbolic cosecant'
  ]),
  when(isAreaHyperbolicCotangent, e => [
    chain(reciprocal(subtract(real(1), square(e.value.expression))), e.value.expression),
    'derivative of area hyperbolic cotangent'
  ]),

  // :: Factorial-likes
  when(isFactorial, e => [
    chain(multiply(e, digamma(add(e.value.expression, real(1)))), e.value.expression),
    'derivative of factorial'
  ]),
  when(isGamma, e => [
    chain(multiply(e, digamma(e.value.expression)), e.value.expression),
    'derivative of gamma'
  ]),
  // NOTE: while 'isPolygamma' is the more natural and consistent fit, here,
  // that function is defined explicitly as the output of 'binary'; the
  // 'polygamma' function depends upon 'differentiate', in part, for its
  // reflection formula, which borks this logic. Easier to replace with a
  // 'isSpecies'.
  when(isSpecies<Polygamma>(Species.polygamma), e => [
    chain(polygamma(add(e.value.left, real(1)), e.value.right), e.value.right),
    'derivative of polygamma'
  ])
)
