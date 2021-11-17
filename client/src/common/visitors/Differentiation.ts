import { Visitor } from './Visitor'
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
  add, subtract, multiply, divide, raise, 
  real, complex, variable, assign, invoke, differentiate,
  negate, abs,
  lb, ln, lg,
  cos, sin, tan, sec, csc, cot,
  acos, asin, atan, asec, acsc, acot,
  cosh, sinh, tanh, sech, csch, coth,
  acosh, asinh, atanh, asech, acsch, acoth,
  factorial, gamma, polygamma
} from '../Tree'
import { Tree } from "../Tree"


export class Differentiation implements Visitor<Tree> {
  visitReal(_: Real): Tree {
    return real(0)
  }

  visitComplex(_: Complex): Tree {
    return complex(0)
  }

  visitVariable(node: Variable): Tree {
    return real(1)
  }

  visitAssignment(node: Assignment): Tree {
    return real(0)
  }

  visitInvocation(node: Invocation): Tree {
    return real(0)
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
    return real(0)
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
      add(
        real(1),
        raise(
          tan(node.expression),
          real(2)
        )
      ),
      node.expression.accept(this)
    )
  }

  visitSecant(node: Secant): Tree {
    return real(0)
  }

  visitCosecant(node: Cosecant): Tree {
    return real(0)
  }

  visitCotangent(node: Cotangent): Tree {
    return real(0)
  }

  visitArcusCosine(node: ArcusCosine): Tree {
    return real(0)
  }

  visitArcusSine(node: ArcusSine): Tree {
    return real(0)
  }

  visitArcusTangent(node: ArcusTangent): Tree {
    return real(0)
  }

  visitArcusSecant(node: ArcusSecant): Tree {
    return real(0)
  }

  visitArcusCosecant(node: ArcusCosecant): Tree {
    return real(0)
  }

  visitArcusCotangent(node: ArcusCotangent): Tree {
    return real(0)
  }

  visitHyperbolicCosine(node: HyperbolicCosine): Tree {
    return real(0)
  }

  visitHyperbolicSine(node: HyperbolicSine): Tree {
    return real(0)
  }

  visitHyperbolicTangent(node: HyperbolicTangent): Tree {
    return real(0)
  }

  visitHyperbolicSecant(node: HyperbolicSecant): Tree {
    return real(0)
  }

  visitHyperbolicCosecant(node: HyperbolicCosecant): Tree {
    return real(0)
  }

  visitHyperbolicCotangent(node: HyperbolicCotangent): Tree {
    return real(0)
  }

  visitAreaHyperbolicCosine(node: AreaHyperbolicCosine): Tree {
    return real(0)
  }

  visitAreaHyperbolicSine(node: AreaHyperbolicSine): Tree {
    return real(0)
  }

  visitAreaHyperbolicTangent(node: AreaHyperbolicTangent): Tree {
    return real(0)
  }

  visitAreaHyperbolicSecant(node: AreaHyperbolicSecant): Tree {
    return real(0)
  }

  visitAreaHyperbolicCosecant(node: AreaHyperbolicCosecant): Tree {
    return real(0)
  }

  visitAreaHyperbolicCotangent(node: AreaHyperbolicCotangent): Tree {
    return real(0)
  }

  visitFactorial(node: Factorial): Tree {
    return real(0)
  }

  visitGamma(node: Gamma): Tree {
    return real(0)
  }

  visitPolygamma(node: Polygamma): Tree {
    return real(0)
  }

  visitDerivative(node: Derivative): Tree {
    return real(0)
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
