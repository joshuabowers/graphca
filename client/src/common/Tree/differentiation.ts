import { method, multi, Multi } from '@arrows/multimethod'
import { 
  Base, Real, Complex, Variable, Addition, Multiplication, Exponentiation,
  Logarithm, AbsoluteValue,
  Cosine, Sine, Tangent, Secant, Cosecant, Cotangent,
  ArcusCosine, ArcusSine, ArcusTangent,
  ArcusSecant, ArcusCosecant, ArcusCotangent,
  HyperbolicCosine, HyperbolicSine, HyperbolicTangent,
  HyperbolicSecant, HyperbolicCosecant, HyperbolicCotangent,
  AreaHyperbolicCosine, AreaHyperbolicSine, AreaHyperbolicTangent,
  AreaHyperbolicSecant, AreaHyperbolicCosecant, AreaHyperbolicCotangent
} from './Expression'
import { real } from './real'
import { complex } from './complex'
import { add, subtract } from './addition'
import { multiply, divide, negate } from './multiplication'
import { raise, square, sqrt, reciprocal } from './exponentiation'
import { ln } from './logarithmic'
import { abs } from './absolute'
import { cos, sin, tan, sec, csc, cot } from './trigonometric'
import { cosh, sinh, tanh, sech, csch, coth } from './hyperbolic'

const chain = (derivative: Base, argument: Base) =>
  multiply(derivative, differentiate(argument))

type when<T> = (expression: T) => Base

const whenReal: when<Real> = _ => real(0)
const whenComplex: when<Complex> = _ => complex(0, 0)
const whenVariable: when<Variable> = _ => real(1)

const whenAddition: when<Addition> = e =>
  add(differentiate(e.left), differentiate(e.right))

const whenMultiplication: when<Multiplication> = e =>
  add(
    multiply(differentiate(e.left), e.right),
    multiply(e.left, differentiate(e.right))
  )

const whenExponentiation: when<Exponentiation> = e =>
  multiply(
    e,
    add(
      multiply(differentiate(e.left), divide(e.right, e.left)),
      multiply(differentiate(e.right), ln(e.left))
    )
  )

const whenLogarithm: when<Logarithm> = e =>
  divide(
    differentiate(e.right), multiply(e.right, ln(e.left))
  )

const whenAbsolute: when<AbsoluteValue> = e =>
  chain(divide(e.expression, e), e.expression)

const whenCosine: when<Cosine> = e =>
  chain(negate(sin(e.expression)), e.expression)

const whenSine: when<Sine> = e =>
  chain(cos(e.expression), e.expression)

const whenTangent: when<Tangent> = e =>
  chain(square(sec(e.expression)), e.expression)

const whenSecant: when<Secant> = e =>
  chain(multiply(sec(e.expression), tan(e.expression)), e.expression)

const whenCosecant: when<Cosecant> = e => 
  chain(multiply(negate(csc(e.expression)), cot(e.expression)), e.expression)

const whenCotangent: when<Cotangent> = e =>
  chain(negate(square(csc(e.expression))), e.expression)

const whenArcusCosine: when<ArcusCosine> = e =>
  negate(divide(
    differentiate(e.expression),
    sqrt(subtract(real(1), square(e.expression)))
  ))

const whenArcusSine: when<ArcusSine> = e =>
  chain(reciprocal(sqrt(subtract(real(1), square(e.expression)))), e.expression)

const whenArcusTangent: when<ArcusTangent> = e =>
  chain(reciprocal(add(real(1), square(e.expression))), e.expression)

const whenArcusSecant: when<ArcusSecant> = e =>
  chain(
    reciprocal(multiply(
      abs(e.expression), 
      sqrt(subtract(square(e.expression), real(1)))
    )), 
    e.expression
  )

const whenArcusCosecant: when<ArcusCosecant> = e =>
  negate(chain(
    reciprocal(multiply(
      abs(e.expression), 
      sqrt(subtract(square(e.expression), real(1)))
    )), 
    e.expression
  ))

const whenArcusCotangent: when<ArcusCotangent> = e =>
  negate(chain(reciprocal(add(square(e.expression), real(1))), e.expression))

const whenHyperbolicCosine: when<HyperbolicCosine> = e =>
  chain(sinh(e.expression), e.expression)

const whenHyperbolicSine: when<HyperbolicSine> = e =>
  chain(cosh(e.expression), e.expression)

const whenHyperbolicTangent: when<HyperbolicTangent> = e =>
  chain(square(sech(e.expression)), e.expression)

const whenHyperbolicSecant: when<HyperbolicSecant> = e =>
  chain(
    multiply(negate(tanh(e.expression)), sech(e.expression)), 
    e.expression
  )

const whenHyperbolicCosecant: when<HyperbolicCosecant> = e =>
  chain(
    multiply(negate(coth(e.expression)), csch(e.expression)),
    e.expression
  )

const whenHyperbolicCotangent: when<HyperbolicCotangent> = e =>
  chain(
    negate(square(csch(e.expression))),
    e.expression
  )

const whenAreaHyperbolicCosine: when<AreaHyperbolicCosine> = e =>
  chain(
    reciprocal(sqrt(subtract(square(e.expression), real(1)))),
    e.expression
  )

const whenAreaHyperbolicSine: when<AreaHyperbolicSine> = e =>
  chain(
    reciprocal(sqrt(add(real(1), square(e.expression)))),
    e.expression
  )

const whenAreaHyperbolicTangent: when<AreaHyperbolicTangent> = e =>
  chain(
    reciprocal(subtract(real(1), square(e.expression))),
    e.expression
  )

const whenAreaHyperbolicSecant: when<AreaHyperbolicSecant> = e =>
  negate(chain(
    reciprocal(multiply(
      e.expression, 
      sqrt(subtract(real(1), square(e.expression)))
    )),
    e.expression
  ))

const whenAreaHyperbolicCosecant: when<AreaHyperbolicCosecant> = e =>
  negate(chain(
    reciprocal(multiply(
      abs(e.expression),
      sqrt(add(real(1), square(e.expression)))
    )),
    e.expression
  ))

const whenAreaHyperbolicCotangent: when<AreaHyperbolicCotangent> = e =>
  chain(reciprocal(subtract(real(1), square(e.expression))), e.expression)

  // visitFactorial(node: Factorial): Tree {
  //   return multiply(
  //     multiply(
  //       factorial(node.expression),
  //       digamma(add(node.expression, real(1)))
  //     ),
  //     node.expression.accept(this)
  //   )
  // }

  // visitGamma(node: Gamma): Tree {
  //   return multiply(
  //     multiply(
  //       gamma(node.expression),
  //       digamma(node.expression)
  //     ),
  //     node.expression.accept(this)
  //   )
  // }

  // visitPolygamma(node: Polygamma): Tree {
  //   return multiply(
  //     polygamma(
  //       add(node.order, real(1)),
  //       node.expression
  //     ),
  //     node.expression.accept(this)
  //   )
  // }
  
const whenBase = (expression: Base) => expression

export type DifferentiateFn = Multi
  & typeof whenReal & typeof whenComplex & typeof whenVariable
  & typeof whenAddition & typeof whenMultiplication 
  & typeof whenExponentiation & typeof whenLogarithm & typeof whenAbsolute
  & typeof whenCosine & typeof whenSine & typeof whenTangent
  & typeof whenSecant & typeof whenCosecant & typeof whenCotangent
  & typeof whenArcusCosine & typeof whenArcusSine & typeof whenArcusTangent
  & typeof whenArcusSecant & typeof whenArcusCosecant & typeof whenArcusCotangent
  & typeof whenHyperbolicCosine & typeof whenHyperbolicSine
  & typeof whenHyperbolicTangent & typeof whenHyperbolicSecant
  & typeof whenHyperbolicCosecant & typeof whenHyperbolicCotangent
  & typeof whenAreaHyperbolicCosine & typeof whenAreaHyperbolicSine
  & typeof whenAreaHyperbolicTangent & typeof whenAreaHyperbolicSecant
  & typeof whenAreaHyperbolicCosecant & typeof whenAreaHyperbolicCotangent
  & typeof whenBase

export const differentiate: DifferentiateFn = multi(
  method(Real, whenReal),
  method(Complex, whenComplex),
  method(Variable, whenVariable),

  method(Addition, whenAddition),
  method(Multiplication, whenMultiplication),
  method(Exponentiation, whenExponentiation),
  method(Logarithm, whenLogarithm),

  method(AbsoluteValue, whenAbsolute),

  method(Cosine, whenCosine),
  method(Sine, whenSine),
  method(Tangent, whenTangent),
  method(Secant, whenSecant),
  method(Cosecant, whenCosecant),
  method(Cotangent, whenCotangent),

  method(ArcusCosine, whenArcusCosine),
  method(ArcusSine, whenArcusSine),
  method(ArcusTangent, whenArcusTangent),
  method(ArcusSecant, whenArcusSecant),
  method(ArcusCosecant, whenArcusCosecant),
  method(ArcusCotangent, whenArcusCotangent),

  method(HyperbolicCosine, whenHyperbolicCosine),
  method(HyperbolicSine, whenHyperbolicSine),
  method(HyperbolicTangent, whenHyperbolicTangent),
  method(HyperbolicSecant, whenHyperbolicSecant),
  method(HyperbolicCosecant, whenHyperbolicCosecant),
  method(HyperbolicCotangent, whenHyperbolicCotangent),

  method(AreaHyperbolicCosine, whenAreaHyperbolicCosine),
  method(AreaHyperbolicSine, whenAreaHyperbolicSine),
  method(AreaHyperbolicTangent, whenAreaHyperbolicTangent),
  method(AreaHyperbolicSecant, whenAreaHyperbolicSecant),
  method(AreaHyperbolicCosecant, whenAreaHyperbolicCosecant),
  method(AreaHyperbolicCotangent, whenAreaHyperbolicCotangent)
)
