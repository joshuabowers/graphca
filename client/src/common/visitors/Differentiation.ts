import { Visitor, Scope } from './Visitor'
import {
  Expression, Binary, Unary, Field,
  Addition, Subtraction, Multiplication, Division, Exponentiation,
  Negation, AbsoluteValue,
  BinaryLogarithm, NaturalLogarithm, CommonLogarithm,
  Cosine, Sine, Tangent,
  Secant, Cosecant, Cotangent,
  ArcusCosine, ArcusSine, ArcusTangent,
  ArcusSecant, ArcusCosecant, ArcusCotangent,
  HyperbolicCosine, HyperbolicSine, HyperbolicTangent,
  HyperbolicSecant, HyperbolicCosecant, HyperbolicCotangent,
  AreaHyperbolicCosine, AreaHyperbolicSine, AreaHyperbolicTangent,
  AreaHyperbolicSecant, AreaHyperbolicCosecant, AreaHyperbolicCotangent,
  Factorial, Gamma, Polygamma,
  Real, Complex, Variable, Assignment, Invocation,
  Derivative,
  Logarithm, Kind,
  add, subtract, multiply, divide, raise, square, sqrt,
  real, complex, variable, assign, invoke, differentiate,
  negate, abs,
  lb, ln, lg,
  cos, sin, tan, sec, csc, cot,
  acos, asin, atan, asec, acsc, acot,
  cosh, sinh, tanh, sech, csch, coth,
  acosh, asinh, atanh, asech, acsch, acoth,
  factorial, gamma, polygamma, digamma
} from '../Tree'
import { Tree } from "../Tree"


export class Differentiation implements Visitor<Tree> {
  constructor(public scope?: Scope) {}

  visitReal(_: Real): Tree {
    return real(0)
  }

  visitComplex(_: Complex): Tree {
    return complex(0)
  }

  visitVariable(node: Variable): Tree {
    const value = this.scope?.get(node.name)
    return value?.accept(this) ?? real(1)
  }

  visitAssignment(node: Assignment): Tree {
    return assign(node.a, node.b.accept(this))
  }

  /**
   * Performs the derivative of the expression the invocation is
   * applied to.
   * @param node an invocation to visit
   * @returns a new invocation, whose body is the derivative of
   * node.expression; the parameters are unaffected and passed-
   * through.
   */
  visitInvocation(node: Invocation): Tree {
    return invoke(node.expression.accept(this), ...node.args)
  }

  visitAddition(node: Addition): Tree {
    return add(node.a.accept(this), node.b.accept(this))
  }

  visitSubtraction(node: Subtraction): Tree {
    return subtract(node.a.accept(this), node.b.accept(this))
  }

  visitMultiplication(node: Multiplication): Tree {
    return add(
      multiply(node.a.accept(this), node.b),
      multiply(node.a, node.b.accept(this))
    )
  }

  visitDivision(node: Division): Tree {
    return divide(
      subtract(
        multiply(node.a.accept(this), node.b),
        multiply(node.b.accept(this), node.a)
      ),
      raise(node.b, real(2))
    )
  }

  visitExponentiation(node: Exponentiation): Tree {
    return multiply(
      node,
      add(
        multiply(
          node.a.accept(this),
          divide(node.b, node.a)
        ),
        multiply(
          node.b.accept(this),
          ln(node.a)
        )
      )
    )
  }

  visitNegation(node: Negation): Tree {
    return negate(node.expression.accept(this))
  }

  visitAbsoluteValue(node: AbsoluteValue): Tree {
    return divide(
      multiply(node.expression, node.expression.accept(this)),
      node
    )
  }

  visitBinaryLogarithm(node: BinaryLogarithm): Tree {
    return this.logarithm(2, node)
  }

  visitNaturalLogarithm(node: NaturalLogarithm): Tree {
    return this.logarithm(Math.E, node)
  }

  visitCommonLogarithm(node: CommonLogarithm): Tree {
    return this.logarithm(10, node)
  }

  visitCosine(node: Cosine): Tree {
    return multiply(
      negate(sin(node.expression)),
      node.expression.accept(this)
    )
  }

  visitSine(node: Sine): Tree {
    return multiply(
      cos(node.expression),
      node.expression.accept(this)
    )
  }

  visitTangent(node: Tangent): Tree {
    return multiply(
      raise(
        sec(node.expression),
        real(2)
      ),  
      node.expression.accept(this)
    )
  }

  visitSecant(node: Secant): Tree {
    return multiply(
      multiply(
        sec(node.expression),
        tan(node.expression)
      ),
      node.expression.accept(this)
    )
  }

  visitCosecant(node: Cosecant): Tree {
    return multiply(
      multiply(
        negate(csc(node.expression)),
        cot(node.expression)
      ),
      node.expression.accept(this)
    )
  }

  visitCotangent(node: Cotangent): Tree {
    return multiply(
      negate(square(csc(node.expression))),
      node.expression.accept(this)
    )
  }

  visitArcusCosine(node: ArcusCosine): Tree {
    return negate(
      divide(
        node.expression.accept(this),
        sqrt(
          subtract(
            real(1),
            square(node.expression)
          )
        )
      )
    )
  }

  visitArcusSine(node: ArcusSine): Tree {
    return divide(
      node.expression.accept(this),
      sqrt(
        subtract(
          real(1),
          square(node.expression)
        )
      )
    )
  }

  visitArcusTangent(node: ArcusTangent): Tree {
    return divide(
      node.expression.accept(this),
      add(
        real(1),
        raise(node.expression, real(2))
      )
    )
  }

  visitArcusSecant(node: ArcusSecant): Tree {
    return divide(
      node.expression.accept(this),
      multiply(
        abs(node.expression),
        sqrt(
          subtract(
            square(node.expression),
            real(1)
          )
        )
      )
    )
  }

  visitArcusCosecant(node: ArcusCosecant): Tree {
    return negate(
      divide(
        node.expression.accept(this),
        multiply(
          abs(node.expression),
          sqrt(
            subtract(
              square(node.expression),
              real(1)
            )
          )
        )
      )
    )
  }

  visitArcusCotangent(node: ArcusCotangent): Tree {
    return negate(
      divide(
        node.expression.accept(this),
        add(
          square(node.expression),
          real(1)
        )
      )
    )
  }

  visitHyperbolicCosine(node: HyperbolicCosine): Tree {
    return multiply(
      sinh(node.expression),
      node.expression.accept(this)
    )
  }

  visitHyperbolicSine(node: HyperbolicSine): Tree {
    return multiply(
      cosh(node.expression),
      node.expression.accept(this)
    )
  }

  visitHyperbolicTangent(node: HyperbolicTangent): Tree {
    return multiply(
      square(sech(node.expression)),
      node.expression.accept(this)
    )
  }

  visitHyperbolicSecant(node: HyperbolicSecant): Tree {
    return multiply(
      multiply(negate(tanh(node.expression)), sech(node.expression)),
      node.expression.accept(this)
    )
  }

  visitHyperbolicCosecant(node: HyperbolicCosecant): Tree {
    return multiply(
      multiply(negate(coth(node.expression)), csch(node.expression)),
      node.expression.accept(this)
    )
  }

  visitHyperbolicCotangent(node: HyperbolicCotangent): Tree {
    return multiply(
      negate(square(csch(node.expression))),
      node.expression.accept(this)
    )
  }

  visitAreaHyperbolicCosine(node: AreaHyperbolicCosine): Tree {
    return divide(
      node.expression.accept(this),
      raise(
        subtract(
          raise(node.expression, real(2)),
          real(1)
        ),
        real(0.5)
      )
    )
  }

  visitAreaHyperbolicSine(node: AreaHyperbolicSine): Tree {
    return divide(
      node.expression.accept(this),
      raise(
        add(
          real(1),
          raise(node.expression, real(2))
        ),
        real(0.5)
      )
    )
  }

  visitAreaHyperbolicTangent(node: AreaHyperbolicTangent): Tree {
    return divide(
      node.expression.accept(this),
      subtract(real(1), square(node.expression))
    )
  }

  visitAreaHyperbolicSecant(node: AreaHyperbolicSecant): Tree {
    return negate(
      divide(
        node.expression.accept(this),
        multiply(
          node.expression,
          sqrt(subtract(real(1), square(node.expression)))
        )
      )
    )
  }

  visitAreaHyperbolicCosecant(node: AreaHyperbolicCosecant): Tree {
    return negate(
      divide(
        node.expression.accept(this),
        multiply(
          abs(node.expression),
          sqrt(add(real(1), square(node.expression)))
        )
      )
    )
  }

  visitAreaHyperbolicCotangent(node: AreaHyperbolicCotangent): Tree {
    return divide(
      node.expression.accept(this),
      subtract(real(1), square(node.expression))
    )
  }

  visitFactorial(node: Factorial): Tree {
    return multiply(
      multiply(
        factorial(node.expression),
        digamma(add(node.expression, real(1)))
      ),
      node.expression.accept(this)
    )
  }

  visitGamma(node: Gamma): Tree {
    return multiply(
      multiply(
        gamma(node.expression),
        digamma(node.expression)
      ),
      node.expression.accept(this)
    )
  }

  visitPolygamma(node: Polygamma): Tree {
    return multiply(
      polygamma(
        add(node.order, real(1)),
        node.expression
      ),
      node.expression.accept(this)
    )
  }

  visitDerivative(node: Derivative): Tree {
    return node.expression.accept(this).accept(this)
  }

  private logarithm(base: number, node: Logarithm): Tree {
    return divide(
      node.expression.accept(this),
      base === Math.E ? node.expression : multiply(
        node.expression,
        ln(real(base))
      )
    )
  }
}
