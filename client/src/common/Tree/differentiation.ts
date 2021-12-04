import { method, multi, Multi } from '@arrows/multimethod'
import { Base } from './Expression'
import { Real, real } from './real'
import { Complex, complex } from './complex'
import { Variable } from './variable'
import { Addition, add, subtract } from './addition'
import { Multiplication, multiply, divide, negate } from './multiplication'
import { Exponentiation, square, sqrt, reciprocal } from './exponentiation'
import { Logarithm, ln } from './logarithmic'
import { AbsoluteValue, abs } from './absolute'
import { 
  Cosine, Sine, Tangent, Secant, Cosecant, Cotangent,
  cos, sin, tan, sec, csc, cot 
} from './trigonometric'
import {
  ArcusCosine, ArcusSine, ArcusTangent,
  ArcusSecant, ArcusCosecant, ArcusCotangent,
} from './arcus'
import { 
  HyperbolicCosine, HyperbolicSine, HyperbolicTangent,
  HyperbolicSecant, HyperbolicCosecant, HyperbolicCotangent,
  cosh, sinh, tanh, sech, csch, coth 
} from './hyperbolic'
import {
  AreaHyperbolicCosine, AreaHyperbolicSine, AreaHyperbolicTangent,
  AreaHyperbolicSecant, AreaHyperbolicCosecant, AreaHyperbolicCotangent
} from './areaHyperbolic'
import { Factorial } from './factorial'
import { Gamma } from './gamma'
import { Polygamma, polygamma, digamma } from './polygamma'

export class Derivative extends Base {
  readonly $kind = 'Derivative'
  constructor(readonly expression: Base, readonly order: Base, readonly wrt: Variable[]) { super() }
}

const chain = (derivative: Base, argument: Base) =>
  multiply(derivative, differentiate(argument))

type when<T> = (expression: T) => Base

const whenNthDerivative = (order: Real, expression: Base) => {
  let d: Base = expression
  for(let i = 0; i < order.value; i++) {
    d = differentiate(d)
  }
  return d
}

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

const whenFactorial: when<Factorial> = e =>
  chain(multiply(e, digamma(add(e.expression, real(1)))), e.expression)

const whenGamma: when<Gamma> = e =>
  chain(multiply(e, digamma(e.expression)), e.expression)

const whenPolygamma: when<Polygamma> = e =>
  chain(polygamma(add(e.left, real(1)), e.right), e.right)
  
const whenBase = (expression: Base) => expression

export type DifferentiateFn = Multi
  & typeof whenNthDerivative
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
  & typeof whenFactorial & typeof whenGamma & typeof whenPolygamma
  & typeof whenBase

export const differentiate: DifferentiateFn = multi(
  method([Real, Base], whenNthDerivative), // omg
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
  method(AreaHyperbolicCotangent, whenAreaHyperbolicCotangent),

  method(Factorial, whenFactorial),
  method(Gamma, whenGamma),
  method((v: unknown) => v instanceof Polygamma, whenPolygamma)
  // The above predicate used as Polygamma uses differentiate,
  // but differentiate uses Polygamma. Circular dependency hell;
  // by offsetting when Polygamma is referenced, both constants
  // can be established prior to use. Cleaner, perhaps, than
  // migrating Polygamma's definition to a separate file.
)
