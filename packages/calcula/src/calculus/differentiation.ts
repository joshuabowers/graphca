import { method, multi, Multi } from '@arrows/multimethod'
import { Writer, Action, unit, bind, isWriter } from '../monads/writer'
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

type DifferentiateFn = Multi
  & ((order: Writer<Real>, expression: Writer<TreeNode>) => Writer<TreeNode>)
  & ((expression: Writer<TreeNode>) => Writer<TreeNode>)

type CorrespondingFn<T extends TreeNode> = Action<TreeNode> 
  | ((t: T) => Action<TreeNode>)

export const when = <T extends TreeNode>(
  predicate: TreeNodeGuardFn<T>, 
  fn: CorrespondingFn<T>
) =>
  method(predicate, (t: Writer<T>) =>
    bind(t, input => {
      const [result, action] = typeof fn === 'function' ? fn(input) : fn
      const output = isWriter(result) ? result.value : result
      return ({
        value: output,
        log: [
          {input, output, action},
          ...(isWriter(result) ? result.log : [])
        ]
      })
    })
  )

const chain = (derivative: Writer<TreeNode>, argument: Writer<TreeNode>) =>
  multiply(derivative, differentiate(argument))

export const differentiate: DifferentiateFn = multi(
  // nth derivative
  method(
    (o: unknown, e: unknown) => isTreeNode(o) && isReal(o) && isTreeNode(e),
    (o: Writer<Real>, e: Writer<TreeNode>) =>
      bind(o, order => bind(e, expression => {
        let d: Writer<TreeNode> = unit(expression)
        for(let i = 0; i < order.value; i++) {
          d = differentiate(d)
        }
        return d
      }))
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
    add(differentiate(e.left), differentiate(e.right)),
    'derivative of an addition'
  ]),
  when(isMultiplication, e => [
    add(
      multiply(differentiate(e.left), e.right),
      multiply(e.left, differentiate(e.right))
    ),
    'derivative of a multiplication'
  ]),
  when(isExponentiation, e => [
    multiply(
      unit(e),
      add(
        multiply(differentiate(e.left), divide(e.right, e.left)),
        multiply(differentiate(e.right), ln(e.left))
      )
    ),
    'derivative of an exponentiation'
  ]),

  // Functions
  when(isLogarithm, e => [
    divide(
      differentiate(e.right), multiply(e.right, ln(e.left))
    ),
    'derivative of a logarithm'
  ]),
  when(isAbsolute, e => [
    chain(divide(e.expression, unit(e)), e.expression),
    'derivative of an absolute value'
  ]),

  // :: Trigonometric
  when(isCosine, e => [
    chain(negate(sin(e.expression)), e.expression),
    'derivative of cosine'
  ]),
  when(isSine, e => [
    chain(cos(e.expression), e.expression),
    'derivative of sine'
  ]),
  when(isTangent, e => [
    chain(square(sec(e.expression)), e.expression),
    'derivative of tangent'
  ]),
  when(isSecant, e => [
    chain(multiply(sec(e.expression), tan(e.expression)), e.expression),
    'derivative of secant'
  ]),
  when(isCosecant, e => [
    chain(multiply(negate(csc(e.expression)), cot(e.expression)), e.expression),
    'derivative of cosecant'
  ]),
  when(isCotangent, e => [
    chain(negate(square(csc(e.expression))), e.expression),
    'derivative of cotangent'
  ]),

  // :: Arcus
  when(isArcusCosine, e => [
    negate(divide(
      differentiate(e.expression),
      sqrt(subtract(real(1), square(e.expression)))
    )),
    'derivative of arcus cosine'
  ]),
  when(isArcusSine, e => [
    chain(
      reciprocal(sqrt(subtract(real(1), square(e.expression)))), 
      e.expression
    ),
    'derivative of arcus sine'
  ]),
  when(isArcusTangent, e => [
    chain(reciprocal(add(real(1), square(e.expression))), e.expression),
    'derivative of arcus tangent'
  ]),
  when(isArcusSecant, e => [
    chain(
      reciprocal(multiply(
        abs(e.expression), 
        sqrt(subtract(square(e.expression), real(1)))
      )), 
      e.expression
    ),
    'derivative of arcus secant'
  ]),
  when(isArcusCosecant, e => [
    negate(chain(
      reciprocal(multiply(
        abs(e.expression), 
        sqrt(subtract(square(e.expression), real(1)))
      )), 
      e.expression
    )),
    'derivative of arcus cosecant'
  ]),
  when(isArcusCotangent, e => [
    negate(chain(reciprocal(add(square(e.expression), real(1))), e.expression)),
    'derivative of arcus cotangent'
  ]),

  // :: Hyperbolic
  when(isHyperbolicCosine, e => [
    chain(sinh(e.expression), e.expression),
    'derivative of hyperbolic cosine'
  ]),
  when(isHyperbolicSine, e => [
    chain(cosh(e.expression), e.expression),
    'derivative of hyperbolic sine'
  ]),
  when(isHyperbolicTangent, e => [
    chain(square(sech(e.expression)), e.expression),
    'derivative of hyperbolic tangent'
  ]),
  when(isHyperbolicSecant, e => [
    chain(
      multiply(negate(tanh(e.expression)), sech(e.expression)), 
      e.expression
    ),
    'derivative of hyperbolic secant'
  ]),
  when(isHyperbolicCosecant, e => [
    chain(
      multiply(negate(coth(e.expression)), csch(e.expression)),
      e.expression
    ),
    'derivative of hyperbolic cosecant'
  ]),
  when(isHyperbolicCotangent, e => [
    chain(
      negate(square(csch(e.expression))),
      e.expression
    ),
    'derivative of hyperbolic cotangent'
  ]),

  // :: Area Hyperbolic
  when(isAreaHyperbolicCosine, e => [
    chain(
      reciprocal(sqrt(subtract(square(e.expression), real(1)))),
      e.expression
    ),
    'derivative of area hyperbolic cosine'
  ]),
  when(isAreaHyperbolicSine, e => [
    chain(
      reciprocal(sqrt(add(real(1), square(e.expression)))),
      e.expression
    ),
    'derivative of area hyperbolic sine'
  ]),
  when(isAreaHyperbolicTangent, e => [
    chain(
      reciprocal(subtract(real(1), square(e.expression))),
      e.expression
    ),
    'derivative of area hyperbolic tangent'
  ]),
  when(isAreaHyperbolicSecant, e => [
    negate(chain(
      reciprocal(multiply(
        e.expression, 
        sqrt(subtract(real(1), square(e.expression)))
      )),
      e.expression
    )),
    'derivative of area hyperbolic secant'
  ]),
  when(isAreaHyperbolicCosecant, e => [
    negate(chain(
      reciprocal(multiply(
        abs(e.expression),
        sqrt(add(real(1), square(e.expression)))
      )),
      e.expression
    )),
    'derivative of area hyperbolic cosecant'
  ]),
  when(isAreaHyperbolicCotangent, e => [
    chain(reciprocal(subtract(real(1), square(e.expression))), e.expression),
    'derivative of area hyperbolic cotangent'
  ]),

  // :: Factorial-likes
  when(isFactorial, e => [
    chain(multiply(unit(e), digamma(add(e.expression, real(1)))), e.expression),
    'derivative of factorial'
  ]),
  when(isGamma, e => [
    chain(multiply(unit(e), digamma(e.expression)), e.expression),
    'derivative of gamma'
  ]),
  // NOTE: while 'isPolygamma' is the more natural and consistent fit, here,
  // that function is defined explicitly as the output of 'binary'; the
  // 'polygamma' function depends upon 'differentiate', in part, for its
  // reflection formula, which borks this logic. Easier to replace with a
  // 'isSpecies'.
  when(isSpecies<Polygamma>(Species.polygamma), e => [
    chain(polygamma(add(e.left, real(1)), e.right), e.right),
    'derivative of polygamma'
  ])
)
