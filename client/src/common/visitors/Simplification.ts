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

enum Transform {
  DoubleNegation,
  NegateReal
}

function transformDescription(t: Transform): string {
  return Transform[t].split(/(!$)[A-Z]/).map(s => s.toLowerCase()).join(' ')
}

const aTransform = transformDescription(Transform.DoubleNegation)

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
    return node
  }

  visitInvocation(node: Invocation): Tree {
    return node
  }

  visitAddition(node: Addition): Tree {
    const a = node.a.accept(this), b = node.b.accept(this)
    return match<[Tree, Tree], Tree>([a, b])
      .with([{value: 0}, __], ([, b]) => b)
      .with([__, {value: 0}], ([a, ]) => a)
      // // Can occur in, e.g., MULTIPLY.accept(this)
      .with( // 2 + 5 => 7
        [instanceOf(Real), instanceOf(Real)], 
        ([a, b]) => real(a.value + b.value)
      )
      .with( // 1 + (1 + x) => 2 + x
        [instanceOf(Real), {$kind: Kind.Addition, a: instanceOf(Real)}],
        ([a, b]) => add(real(a.value + b.a.value), b.b).accept(this)
      )
      .with( // 1 + (x + 1) => 2 + x
        [instanceOf(Real), {$kind: Kind.Addition, b: instanceOf(Real)}],
        ([a, b]) => add(real(a.value + b.b.value), b.a).accept(this)
      )
      .with( // (1 + x) + 1 => 2 + x
        [{$kind: Kind.Addition, a: instanceOf(Real)}, instanceOf(Real)],
        ([a, b]) => add(real(a.a.value + b.value), a.b).accept(this)
      )
      .with( // (x + 1) + 1 => 2 + x
        [{$kind: Kind.Addition, b: instanceOf(Real)}, instanceOf(Real)],
        ([a, b]) => add(real(a.b.value + b.value), a.a).accept(this)
      )
      .with( // (2 * x) + x => 3 * x
        [{$kind: Kind.Multiplication, a: instanceOf(Real)}, not(instanceOf(Multiplication))],
        ([a, b]) => a.b.equals(b),
        ([a, b]) => multiply(real(a.a.value + 1), b)
      )
      .with( // (x * 2) + x => 3 * x
        [{$kind: Kind.Multiplication, b: instanceOf(Real)}, not(instanceOf(Multiplication))],
        ([a, b]) => a.a.equals(b),
        ([a, b]) => multiply(real(a.b.value + 1), b)        
      )
      .with( // x + (2 * x) => 3 * x
        [not(instanceOf(Multiplication)), {$kind: Kind.Multiplication, a: instanceOf(Real)}],
        ([a, b]) => a.equals(b.b),
        ([a, b]) => multiply(real(b.a.value + 1), a)
      )
      .with( // x + (x * 2) => 3 * x
        [not(instanceOf(Multiplication)), {$kind: Kind.Multiplication, b: instanceOf(Real)}],
        ([a, b]) => a.equals(b.a),
        ([a, b]) => multiply(real(b.b.value + 1), a)
      )
      .with( // (2 * x) + (3 * x) => 5 * x
        [{$kind: Kind.Multiplication, a: instanceOf(Real)}, {$kind: Kind.Multiplication, a: instanceOf(Real)}],
        ([a, b]) => a.b.equals(b.b),
        ([a, b]) => multiply(real(a.a.value + b.a.value), a.b)
      )
      .with( // (2 * x) + (x * 3) => 5 * x
        [{$kind: Kind.Multiplication, a: instanceOf(Real)}, {$kind: Kind.Multiplication, b: instanceOf(Real)}],
        ([a, b]) => a.b.equals(b.a),
        ([a, b]) => multiply(real(a.a.value + b.b.value), a.b)
      )
      .with( // (x * 2) + (3 * x) => 5 * x
        [{$kind: Kind.Multiplication, b: instanceOf(Real)}, {$kind: Kind.Multiplication, a: instanceOf(Real)}],
        ([a, b]) => a.a.equals(b.b),
        ([a, b]) => multiply(real(a.b.value + b.a.value), a.a)
      )
      .with( // (x * 2) + (x * 3) => 5 * x
        [{$kind: Kind.Multiplication, b: instanceOf(Real)}, {$kind: Kind.Multiplication, b: instanceOf(Real)}],
        ([a, b]) => a.a.equals(b.a),
        ([a, b]) => multiply(real(a.b.value + b.b.value), a.a)
      )
      .when(([a, b]) => a.equals(b), ([a, ]) => multiply(real(2), a))
      .otherwise(([a, b]) => add(a, b))
  }

  visitSubtraction(node: Subtraction): Tree {
    const a = node.a.accept(this), b = node.b.accept(this)
    return match<[Tree, Tree], Tree>([a, b])
      .with([{value: 0}, __], ([, b]) => negate(b))
      .with([__, {value: 0}], ([a, ]) => a)
      // The following case can happen due to, e.g. visitDivision
      .with( // 2 - 3 => -1
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
      .with([instanceOf(Real), instanceOf(Real)], ([a, b]) => a.multiply(b))
      .with( // (x / y) * (z / w) => (x * z) / (y * w)
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
      .with( // x * x^2 => x^3
        [not(instanceOf(Exponentiation)), instanceOf(Exponentiation)],
        ([a, b]) => a.equals(b.a),
        ([, b]) => raise(b.a, add(b.b, real(1)).accept(this))
      )
      .with( // x^2 * x => x^3
        [instanceOf(Exponentiation), not(instanceOf(Exponentiation))],
        ([a, b]) => a.a.equals(b),
        ([a, ]) => raise(a.a, add(a.b, real(1)).accept(this))
      )
      .with( // x^3 * x^2 => x^5
        [instanceOf(Exponentiation), instanceOf(Exponentiation)],
        ([a, b]) => a.a.equals(b.a),
        ([a, b]) => raise(a.a, add(a.b, b.b).accept(this))
      )
      .with( // (x * y) * x
        [instanceOf(Multiplication), __],
        ([a, b]) => a.a.equals(b),
        ([a, ]) => multiply(square(a.a), a.b).accept(this)
      )
      .with( // (y * x) * x
        [instanceOf(Multiplication), __],
        ([a, b]) => a.b.equals(b),
        ([a, ]) => multiply(square(a.b), a.a).accept(this)
      )
      .with( // x * (x * y)
        [__, instanceOf(Multiplication)],
        ([a, b]) => a.equals(b.a),
        ([, b]) => multiply(b.b, square(b.a)).accept(this)
      )
      .with( // x * (y * x)
        [__, instanceOf(Multiplication)],
        ([a, b]) => a.equals(b.b),
        ([, b]) => multiply(b.a, square(b.b)).accept(this)
      )
      .when(([a, b]) => a.equals(b), ([a, ]) => square(a))
      .otherwise(([a, b]) => multiply(a, b))
  }

  visitDivision(node: Division): Tree {
    const a = node.a.accept(this), b = node.b.accept(this)
    return match<[Tree, Tree], Tree>([a, b])
      .with([{value: 0}, __], () => real(0))
      .with([__, {value: 0}], () => real(Infinity))
      .with([__, {value: 1}], ([a, ]) => a)
      .when(([a, b]) => a.equals(b), () => real(1))
      .with( // x^2 / x => x
        [instanceOf(Exponentiation), not(instanceOf(Exponentiation))],
        ([a, b]) => a.a.equals(b),
        ([a, ]) => raise(a.a, subtract(a.b, real(1))).accept(this)
      )
      .with( // x / x^2 => 1 / x
        [not(instanceOf(Exponentiation)), instanceOf(Exponentiation)],
        ([a, b]) => a.equals(b.a),
        ([, b]) => divide(real(1), raise(b.a, subtract(b.b, real(1)))).accept(this)
      )
      .with( // x^5 / x^2 => x^3
        [instanceOf(Exponentiation), instanceOf(Exponentiation)],
        ([a, b]) => a.a.equals(b.a),
        ([a, b]) => raise(a.a, subtract(a.b, b.b)).accept(this)
      )
      .with( // (x^2 * y) / x => x * y
        [{$kind: Kind.Multiplication, a: instanceOf(Exponentiation)}, not(instanceOf(Multiplication))],
        ([a, b]) => a.a.a.equals(b),
        ([a, ]) => multiply(raise(a.a.a, subtract(a.a.b, real(1))), a.b).accept(this)
      )
      .with( // (x * y^2) / y => x * y
        [{$kind: Kind.Multiplication, b: instanceOf(Exponentiation)}, not(instanceOf(Multiplication))],
        ([a, b]) => a.b.a.equals(b),
        ([a, ]) => multiply(a.a, raise(a.b.a, subtract(a.b.b, real(1)))).accept(this)
      )
      .with( // x / (x^2 * y) => 1 / (x * y)
        [not(instanceOf(Multiplication)), {$kind: Kind.Multiplication, a: instanceOf(Exponentiation)}],
        ([a, b]) => a.equals(b.a.a),
        ([, b]) => divide(real(1), multiply(raise(b.a.a, subtract(b.a.b, real(1))), b.b)).accept(this)
      )
      .with( // y / (x * y^2) => 1 / (x * y)
        [not(instanceOf(Multiplication)), {$kind: Kind.Multiplication, b: instanceOf(Exponentiation)}],
        ([a, b]) => a.equals(b.b.a),
        ([, b]) => divide(real(1), multiply(b.a, raise(b.b.a, subtract(b.b.b, real(1))))).accept(this)
      )
      .with( // (x * y) / x^2 => y / x
        [instanceOf(Multiplication), instanceOf(Exponentiation)],
        ([a, b]) => a.a.equals(b.a),
        ([a, b]) => divide(a.b, raise(b.a, subtract(b.b, real(1)))).accept(this)
      )
      .with( // (y * x) / x^2 => y / x
        [instanceOf(Multiplication), instanceOf(Exponentiation)],
        ([a, b]) => a.b.equals(b.a),
        ([a, b]) => divide(a.a, raise(b.a, subtract(b.b, real(1)))).accept(this)
      )
      .with( // x^2 / (x * y) => x / y
        [instanceOf(Exponentiation), instanceOf(Multiplication)],
        ([a, b]) => a.a.equals(b.a),
        ([a, b]) => divide(raise(a.a, subtract(a.b, real(1))), b.b).accept(this)
      )
      .with( // x^2 / (y * x) => x / y
        [instanceOf(Exponentiation), instanceOf(Multiplication)],
        ([a, b]) => a.a.equals(b.b),
        ([a, b]) => divide(raise(a.a, subtract(a.b, real(1))), b.a).accept(this)
      )
      .with( // (x^2 * y) / x^3 => y / x
        [{$kind: Kind.Multiplication, a: instanceOf(Exponentiation)}, instanceOf(Exponentiation)],
        ([a, b]) => a.a.a.equals(b.a),
        ([a, b]) => multiply(raise(a.a.a, subtract(a.a.b, b.b)), a.b).accept(this)
      )
      .with( // (y * x^2) / x^3 => y / x
        [{$kind: Kind.Multiplication, b: instanceOf(Exponentiation)}, instanceOf(Exponentiation)],
        ([a, b]) => a.b.a.equals(b.a),
        ([a, b]) => multiply(a.a, raise(a.b.a, subtract(a.b.b, b.b))).accept(this)
      )
      .with( // x^3 / (x^2 * y)
        [instanceOf(Exponentiation), {$kind: Kind.Multiplication, a: instanceOf(Exponentiation)}],
        ([a, b]) => a.a.equals(b.a.a),
        ([a, b]) => divide(raise(a.a, subtract(a.b, b.a.b)), b.b).accept(this)
      )
      .with( // x^3 / (y * x^2)
        [instanceOf(Exponentiation), {$kind: Kind.Multiplication, b: instanceOf(Exponentiation)}],
        ([a, b]) => a.a.equals(b.b.a),
        ([a, b]) => divide(raise(a.a, subtract(a.b, b.b.b)), b.a).accept(this)
      )
      .with( // (x * y) / x => y
        [instanceOf(Multiplication), not(instanceOf(Multiplication))],
        ([a, b]) => a.a.equals(b),
        ([a, ]) => a.b as Tree
      )
      .with( // (x * y) / y => x
        [instanceOf(Multiplication), not(instanceOf(Multiplication))],
        ([a, b]) => a.b.equals(b),
        ([a, ]) => a.a as Tree
      )
      .with( // x / (x * y) => 1 / y
        [not(instanceOf(Multiplication)), instanceOf(Multiplication)],
        ([a, b]) => a.equals(b.a),
        ([, b]) => divide(real(1), b.b)
      )
      .with( // y / (x * y) => 1 / x
        [not(instanceOf(Multiplication)), instanceOf(Multiplication)],
        ([a, b]) => a.equals(b.b),
        ([, b]) => divide(real(1), b.a)
      )
      .with( // (x * y) / (x * z) => y / z
        [instanceOf(Multiplication), instanceOf(Multiplication)],
        ([a, b]) => a.a.equals(b.a),
        ([a, b]) => divide(a.b, b.b).accept(this)
      )
      .with( // (x * y) / (z * x) => y / z
        [instanceOf(Multiplication), instanceOf(Multiplication)],
        ([a, b]) => a.a.equals(b.b),
        ([a, b]) => divide(a.b, b.a).accept(this)
      )
      .with( // (x * y) / (y * z) => x / z
        [instanceOf(Multiplication), instanceOf(Multiplication)],
        ([a, b]) => a.b.equals(b.a),
        ([a, b]) => divide(a.a, b.b).accept(this)
      )
      .with( // (x * y) / (z * y) => x / z
        [instanceOf(Multiplication), instanceOf(Multiplication)],
        ([a, b]) => a.b.equals(b.b),
        ([a, b]) => divide(a.a, b.a).accept(this)
      )
      .otherwise(([a, b]) => divide(a, b))
  }

  visitExponentiation(node: Exponentiation): Tree {
    const a = node.a.accept(this), b = node.b.accept(this)
    return match<[Tree, Tree], Tree>([a, b])
      .with([{value: 0}, __], () => real(0))
      .with([__, {value: 0}], () => real(1))
      .with([{value: 1}, __], ([a,]) => a)
      .with([__, {value: 1}], ([a,]) => a)
      .with([__, instanceOf(Negation)], ([a, b]) => divide(real(1), raise(a, b.expression)).accept(this))
      .with([__, {value: -1}], ([a, ]) => divide(real(1), a).accept(this))
      .with( // x^-2 => 1 / x^2
        [__, instanceOf(Real)],
        ([, b]) => b.value < 0,
        ([a, b]) => divide(real(1), raise(a, real(-b.value))).accept(this)
      )
      .with([{value: 2}, instanceOf(BinaryLogarithm)], ([, b]) => b.expression as Tree)
      .with([{value: Math.E}, instanceOf(NaturalLogarithm)], ([, b]) => b.expression as Tree)
      .with([{value: 10}, instanceOf(CommonLogarithm)], ([, b]) => b.expression as Tree)
      .with( // (x^2)^2 => x^4
        [instanceOf(Exponentiation), __],
        ([a, b]) => raise(a.a, multiply(a.b, b)).accept(this)
      )
      .otherwise(([a, b]) => raise(a, b))
  }

  visitNegation(node: Negation): Tree {
    const expression = node.expression.accept(this)
    const [output, transform] = match<Tree, [Tree, string]>(expression)
      .with(instanceOf(Negation), e => [e.expression as Tree, 'double negation'])
      // Negated Reals can occur when a substitution results in a real
      // e.g. -(x / x) => -(1) => -1
      .with(instanceOf(Real), e => [e.negate(), 'negate real'])
      .with(instanceOf(Multiplication), e => [multiply(negate(e.a), e.b), 'multiply negation'])
      .with(instanceOf(Division), e => [divide(negate(e.a), e.b), 'negate numerator'])
      .otherwise(e => [negate(e), ''])
    return this.guardedAcceptAndReport(node, output, transform)
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
    return differentiate(node.expression.accept(this))
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
  
  private guardedAcceptAndReport(input: Tree, output: Tree, transform: string): Tree {
    if(!input.equals(output)) {
      // this.transform(input, transform)
      return output.accept(this)
    } else {
      return output
    }
  }
}
