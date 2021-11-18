import { match, instanceOf, __, not } from 'ts-pattern'
import {
  Tree, Real, Multiplication, Addition, Sine, AbsoluteValue, ArcusCosecant, 
  ArcusCosine, ArcusCotangent, ArcusSecant, ArcusSine, ArcusTangent, 
  AreaHyperbolicCosecant, AreaHyperbolicCosine, AreaHyperbolicCotangent, 
  AreaHyperbolicSecant, AreaHyperbolicSine, AreaHyperbolicTangent, 
  Assignment, BinaryLogarithm, CommonLogarithm, Complex, Cosecant, Cosine, 
  Cotangent, Derivative, Division, Exponentiation, Factorial, Gamma, 
  HyperbolicCosecant, HyperbolicCosine, HyperbolicCotangent, 
  HyperbolicSecant, HyperbolicSine, HyperbolicTangent, Invocation, 
  NaturalLogarithm, Negation, Polygamma, Secant, Subtraction, Tangent, 
  Variable, Expression, Logarithm, Kind,
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
import { Scope, Visitor } from './Visitor'

export class Simplification implements Visitor<Tree> {
  constructor(public scope?: Scope) {}

  visitReal(node: Real): Tree {
    return node
  }

  visitComplex(node: Complex): Tree {
    return node
  }

  visitVariable(node: Variable): Tree {
    return node
  }

  visitAssignment(node: Assignment): Tree {
    throw new Error('Method not implemented.')
  }

  visitInvocation(node: Invocation): Tree {
    throw new Error('Method not implemented.')
  }

  visitAddition(node: Addition): Tree {
    const a = node.a.accept(this), b = node.b.accept(this)
    return match<[Tree, Tree], Tree>([a, b])
      .with([{value: 0}, __], ([, b]) => b)
      .with([__, {value: 0}], ([a, ]) => a)
      // // Can occur in, e.g., $visit(MULTIPLY)
      .with(
        [instanceOf(Real), instanceOf(Real)], 
        ([a, b]) => real(a.value + b.value)
      )
      .with(
        [{$kind: Kind.Multiplication, a: instanceOf(Real)}, not(instanceOf(Multiplication))],
        ([a, b]) => a.b.equals(b),
        ([a, b]) => multiply(real(a.a.value + 1), b)
      )
      // .with(
      //   [{$label: 'MULTIPLY', b: {$label: 'REAL'}}, {$label: not('MULTIPLY')}],
      //   ([a, b]) => equivalent(a.a, b),
      //   ([a, b]) => multiply(real(a.b.value.value + 1), b)        
      // )
      // .with(
      //   [{$label: not('MULTIPLY')}, {$label: 'MULTIPLY', a: {$label: 'REAL'}}],
      //   ([a, b]) => equivalent(a, b.b),
      //   ([a, b]) => multiply(real(b.a.value.value + 1), a)
      // )
      // .with(
      //   [{$label: not('MULTIPLY')}, {$label: 'MULTIPLY', b: {$label: 'REAL'}}],
      //   ([a, b]) => equivalent(a, b.a),
      //   ([a, b]) => multiply(real(b.b.value.value + 1), a)
      // )
      // .with(
      //   [{$label: 'MULTIPLY', a: {$label: 'REAL'}}, {$label: 'MULTIPLY', a: {$label: 'REAL'}}],
      //   ([a, b]) => equivalent(a.b, b.b),
      //   ([a, b]) => multiply(real(a.a.value.value + b.a.value.value), a.b)
      // )
      // .with(
      //   [{$label: 'MULTIPLY', a: {$label: 'REAL'}}, {$label: 'MULTIPLY', b: {$label: 'REAL'}}],
      //   ([a, b]) => equivalent(a.b, b.a),
      //   ([a, b]) => multiply(real(a.a.value.value + b.b.value.value), a.b)
      // )
      // .with(
      //   [{$label: 'MULTIPLY', b: {$label: 'REAL'}}, {$label: 'MULTIPLY', a: {$label: 'REAL'}}],
      //   ([a, b]) => equivalent(a.a, b.b),
      //   ([a, b]) => multiply(real(a.b.value.value + b.a.value.value), a.a)
      // )
      // .with(
      //   [{$label: 'MULTIPLY', b: {$label: 'REAL'}}, {$label: 'MULTIPLY', b: {$label: 'REAL'}}],
      //   ([a, b]) => equivalent(a.a, b.a),
      //   ([a, b]) => multiply(real(a.b.value.value + b.b.value.value), a.a)
      // )
      .when(([a, b]) => a.equals(b), ([a, ]) => multiply(real(2), a))
      .otherwise(([a, b]) => add(a, b))
  }

  visitSubtraction(node: Subtraction): Tree {
    const a = node.a.accept(this), b = node.b.accept(this)
    return match<[Tree, Tree], Tree>([a, b])
      .with([{value: 0}, __], ([, b]) => negate(b))
      .with([__, {value: 0}], ([a, ]) => a)
      // The following case can happen due to, e.g. visitDivision
      .with( 
        [instanceOf(Real), instanceOf(Real)], 
        ([a,b]) => real(a.value - b.value)
      )
      .when(([a, b]) => a.equals(b), () => real(0))
      .otherwise(([a, b]) => subtract(a, b))
  }

  visitMultiplication(node: Multiplication): Tree {
    const a = node.a.accept(this), b = node.b.accept(this)
    return match<[Tree, Tree], Tree>([a, b])
      .with([{value: 0}, __], () => real(0))
      .with([__, {value: 0}], () => real(0))
      .with([{value: 1}, __], ([, b]) => b)
      .with([__, {value: 1}], ([a, ]) => a)
      .with(
        [instanceOf(Division), instanceOf(Division)],
        ([a, b]) => divide(multiply(a.a, b.a), multiply(a.b, b.b)).accept(this)
      )
      .with([__, instanceOf(Division)], ([a, b]) => divide(multiply(a, b.a), b.b).accept(this))
      .with([instanceOf(Division), __], ([a, b]) => divide(multiply(a.a, b), a.b).accept(this))
      .with( // 2 * (3 * x) => 6 * x
        [instanceOf(Real), {$kind: Kind.Multiplication, a: instanceOf(Real)}],
        ([a, b]) => multiply(real(a.value * b.a.value), b.b)
      )
      .with( // (3 * x) * 2 => 6 * x
        [{$kind: Kind.Multiplication, a: instanceOf(Real)}, instanceOf(Real)],
        ([a, b]) => multiply(real(a.a.value * b.value), a.b)
      )
      .with([__, instanceOf(Real)], ([a, b]) => multiply(b, a))
      .with(
        [not(instanceOf(Exponentiation)), instanceOf(Exponentiation)],
        ([a, b]) => a.equals(b.a),
        ([, b]) => raise(b.a, add(b.b, real(1)).accept(this))
      )
      .with(
        [instanceOf(Exponentiation), not(instanceOf(Exponentiation))],
        ([a, b]) => a.a.equals(b),
        ([a, ]) => raise(a.a, add(a.b, real(1)).accept(this))
      )
      .with(
        [instanceOf(Exponentiation), instanceOf(Exponentiation)],
        ([a, b]) => a.a.equals(b.a),
        ([a, b]) => raise(a.a, add(a.b, b.b).accept(this))
      )
      .when(([a, b]) => a.equals(b), ([a, ]) => square(a))
      .otherwise(([a, b]) => multiply(a, b))
  }

  visitDivision(node: Division): Tree {
    const a = node.a.accept(this), b = node.b.accept(this)
    return divide(a, b)
  }

  visitExponentiation(node: Exponentiation): Tree {
    const a = node.a.accept(this), b = node.b.accept(this)
    return raise(a, b)
  }

  visitNegation(node: Negation): Tree {
    const expression = node.expression.accept(this)
    return match<Tree, Tree>(expression)
      .with(instanceOf(Negation), e => e.expression as Tree)
      .otherwise(e => negate(e))
  }

  visitAbsoluteValue(node: AbsoluteValue): Tree {
    return abs(node.expression.accept(this))
  }

  visitBinaryLogarithm(node: BinaryLogarithm): Tree {
    return this.logarithm(2, node, lb)
  }

  visitNaturalLogarithm(node: NaturalLogarithm): Tree {
    return this.logarithm(Math.E, node, ln)
  }

  visitCommonLogarithm(node: CommonLogarithm): Tree {
    return this.logarithm(10, node, lg)
  }

  visitCosine(node: Cosine): Tree {
    return cos(node.expression.accept(this))
  }

  visitSine(node: Sine): Tree {
    return sin(node.expression.accept(this))
  }

  visitTangent(node: Tangent): Tree {
    return tan(node.expression.accept(this))
  }

  visitSecant(node: Secant): Tree {
    return sec(node.expression.accept(this))
  }

  visitCosecant(node: Cosecant): Tree {
    return csc(node.expression.accept(this))
  }

  visitCotangent(node: Cotangent): Tree {
    return cot(node.expression.accept(this))
  }

  visitArcusCosine(node: ArcusCosine): Tree {
    return acos(node.expression.accept(this))
  }

  visitArcusSine(node: ArcusSine): Tree {
    return asin(node.expression.accept(this))
  }

  visitArcusTangent(node: ArcusTangent): Tree {
    return atan(node.expression.accept(this))
  }

  visitArcusSecant(node: ArcusSecant): Tree {
    return asec(node.expression.accept(this))
  }

  visitArcusCosecant(node: ArcusCosecant): Tree {
    return acsc(node.expression.accept(this))
  }

  visitArcusCotangent(node: ArcusCotangent): Tree {
    return acot(node.expression.accept(this))
  }

  visitHyperbolicCosine(node: HyperbolicCosine): Tree {
    return cosh(node.expression.accept(this))
  }

  visitHyperbolicSine(node: HyperbolicSine): Tree {
    return sinh(node.expression.accept(this))
  }

  visitHyperbolicTangent(node: HyperbolicTangent): Tree {
    return tanh(node.expression.accept(this))
  }

  visitHyperbolicSecant(node: HyperbolicSecant): Tree {
    return sech(node.expression.accept(this))
  }

  visitHyperbolicCosecant(node: HyperbolicCosecant): Tree {
    return csch(node.expression.accept(this))
  }

  visitHyperbolicCotangent(node: HyperbolicCotangent): Tree {
    return coth(node.expression.accept(this))
  }

  visitAreaHyperbolicCosine(node: AreaHyperbolicCosine): Tree {
    return acosh(node.expression.accept(this))
  }

  visitAreaHyperbolicSine(node: AreaHyperbolicSine): Tree {
    return asinh(node.expression.accept(this))
  }

  visitAreaHyperbolicTangent(node: AreaHyperbolicTangent): Tree {
    return atanh(node.expression.accept(this))
  }

  visitAreaHyperbolicSecant(node: AreaHyperbolicSecant): Tree {
    return asech(node.expression.accept(this))
  }

  visitAreaHyperbolicCosecant(node: AreaHyperbolicCosecant): Tree {
    return acsch(node.expression.accept(this))
  }

  visitAreaHyperbolicCotangent(node: AreaHyperbolicCotangent): Tree {
    return acoth(node.expression.accept(this))
  }

  visitFactorial(node: Factorial): Tree {
    return factorial(node.expression.accept(this))
  }

  visitGamma(node: Gamma): Tree {
    return gamma(node.expression.accept(this))
  }

  visitPolygamma(node: Polygamma): Tree {
    return polygamma(node.order.accept(this), node.expression.accept(this))
  }

  visitDerivative(node: Derivative): Tree {
    throw new Error('Method not implemented.')
  }

  private logarithm<T extends Logarithm>(base: number, node: T, log: (e: Expression) => T): Tree {
    const expression = node.expression.accept(this)
    return match<Tree, Tree>(expression)
      .with(
        {$kind: Kind.Exponentiation, a: {$kind: Kind.Real, value: base}}, 
        e => e.b as Tree
      )
      .otherwise(e => log(e))
  }
}