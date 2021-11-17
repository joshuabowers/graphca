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
import { Differentiation } from './Differentiation'
import { Parameterization } from './Parameterization'
import { match, instanceOf } from 'ts-pattern'

type WhenBinaryNumeric = <C extends Field<C>>(a: C, b: C) => C
type WhenBinarySymbolic<T extends Tree | Binary> = <L extends Expression, R extends Expression>(a: L, b: R) => T
type WhenUnaryNumeric = <C extends Field<C>>(a: C) => C
type WhenUnarySymbolic<T extends Tree | Unary> = <E extends Expression>(e: E) => T

export class Evaluation implements Visitor<Tree> {
  constructor(public scope?: Map<string, Expression>){}

  visitReal(node: Real): Tree {
    return node
  }

  visitComplex(node: Complex): Tree {
    return node
  }

  visitVariable(node: Variable): Tree {
    const value = this.scope?.get(node.name)
    return match<Expression | undefined, Tree>(value)
      .with(instanceOf(Variable), v => v.name === node.name, () => node)
      .otherwise(e => e?.accept(this) ?? node)
  }

  visitAssignment(node: Assignment): Tree {
    if(!this.scope){ throw new Error(`No scope provided for assignment context`); }
    const evaluated = node.b.accept(this)
    this.scope.set(node.a.name, evaluated)
    return evaluated  
  }

  visitInvocation(node: Invocation): Tree {
    if(!this.scope){ throw new Error('No scope provided for invocation context'); }
    const previousScope = new Map(this.scope)
    try {
      const parameters = node.expression.accept(new Parameterization(this.scope))
      let index = 0
      for(const parameter of parameters){
        const argument = node.args[index]?.accept(this)
        if(argument){
          this.scope.set(parameter, argument)
        }
        index++
      }
      return node.expression.accept(this)
    } finally {
      this.scope.clear()
      for(const [key, value] of previousScope){
        this.scope.set(key, value)
      }
    }
  }

  visitAddition(node: Addition): Tree {
    return this.binary(node, (a, b) => a.add(b), add)
  }

  visitSubtraction(node: Subtraction): Tree {
    return this.binary(node, (a, b) => a.subtract(b), subtract)
  }

  visitMultiplication(node: Multiplication): Tree {
    return this.binary(node, (a, b) => a.multiply(b), multiply)
  }

  visitDivision(node: Division): Tree {
    return this.binary(node, (a, b) => a.divide(b), divide)
  }

  visitExponentiation(node: Exponentiation): Tree {
    return this.binary(node, (a, b) => a.raise(b), raise)
  }
  
  visitNegation(node: Negation): Tree {
    return this.unary(node, e => e.negate(), negate)
  }

  visitAbsoluteValue(node: AbsoluteValue): Tree {
    return this.unary(node, e => e.abs(), abs)
  }

  visitBinaryLogarithm(node: BinaryLogarithm): Tree {
    return this.unary(node, e => e.lb(), lb)
  }

  visitNaturalLogarithm(node: NaturalLogarithm): Tree {
    return this.unary(node, e => e.ln(), ln)
  }

  visitCommonLogarithm(node: CommonLogarithm): Tree {
    return this.unary(node, e => e.lg(), lg)
  }
  
  visitCosine(node: Cosine): Tree {
    return this.unary(node, e => e.cos(), cos)
  }

  visitSine(node: Sine): Tree {
    return this.unary(node, e => e.sin(), sin)
  }

  visitTangent(node: Tangent): Tree {
    return this.unary(node, e => e.tan(), tan)
  }

  visitSecant(node: Secant): Tree {
    return this.unary(node, e => e.sec(), sec)
  }

  visitCosecant(node: Cosecant): Tree {
    return this.unary(node, e => e.csc(), csc)
  }

  visitCotangent(node: Cotangent): Tree {
    return this.unary(node, e => e.cot(), cot)
  }

  visitArcusCosine(node: ArcusCosine): Tree {
    return this.unary(node, e => e.acos(), acos)
  }

  visitArcusSine(node: ArcusSine): Tree {
    return this.unary(node, e => e.asin(), asin)
  }

  visitArcusTangent(node: ArcusTangent): Tree {
    return this.unary(node, e => e.atan(), atan)
  }

  visitArcusSecant(node: ArcusSecant): Tree {
    return this.unary(node, e => e.asec(), asec)
  }

  visitArcusCosecant(node: ArcusCosecant): Tree {
    return this.unary(node, e => e.acsc(), acsc)
  }

  visitArcusCotangent(node: ArcusCotangent): Tree {
    return this.unary(node, e => e.acot(), acot)
  }

  visitHyperbolicCosine(node: HyperbolicCosine): Tree {
    return this.unary(node, e => e.cosh(), cosh)
  }

  visitHyperbolicSine(node: HyperbolicSine): Tree {
    return this.unary(node, e => e.sinh(), sinh)
  }

  visitHyperbolicTangent(node: HyperbolicTangent): Tree {
    return this.unary(node, e => e.tanh(), tanh)
  }

  visitHyperbolicSecant(node: HyperbolicSecant): Tree {
    return this.unary(node, e => e.sech(), sech)
  }

  visitHyperbolicCosecant(node: HyperbolicCosecant): Tree {
    return this.unary(node, e => e.csch(), csch)
  }

  visitHyperbolicCotangent(node: HyperbolicCotangent): Tree {
    return this.unary(node, e => e.coth(), coth)
  }

  visitAreaHyperbolicCosine(node: AreaHyperbolicCosine): Tree {
    return this.unary(node, e => e.acosh(), acosh)
  }

  visitAreaHyperbolicSine(node: AreaHyperbolicSine): Tree {
    return this.unary(node, e => e.asinh(), asinh)
  }

  visitAreaHyperbolicTangent(node: AreaHyperbolicTangent): Tree {
    return this.unary(node, e => e.atanh(), atanh)
  }

  visitAreaHyperbolicSecant(node: AreaHyperbolicSecant): Tree {
    return this.unary(node, e => e.asech(), asech)
  }

  visitAreaHyperbolicCosecant(node: AreaHyperbolicCosecant): Tree {
    return this.unary(node, e => e.acsch(), acsch)
  }

  visitAreaHyperbolicCotangent(node: AreaHyperbolicCotangent): Tree {
    return this.unary(node, e => e.acoth(), acoth)
  }

  visitFactorial(node: Factorial): Tree {
    return this.unary(node, e => e.factorial(), factorial)
  }

  visitGamma(node: Gamma): Tree {
    return this.unary(node, e => e.gamma(), gamma)
  }

  visitPolygamma(node: Polygamma): Tree {
    return this.unary(node, e => e.digamma(), polygamma)
  }

  visitDerivative(node: Derivative): Tree {
    const differentiation = new Differentiation()
    return node.expression.accept(differentiation).accept(this)
  }

  private binary<T extends Binary>(
    node: T, 
    whenNumeric: WhenBinaryNumeric, 
    whenSymbolic: WhenBinarySymbolic<T>
  ): Tree {
    let a = node.a.accept(this), b = node.b.accept(this)
    if( node instanceof Exponentiation 
      && a instanceof Real && a.isNegative() ){
      a = complex(a.value, 0)
    }
    return match<[Tree, Tree], Tree>([a, b])
      .with(
        [instanceOf(Real), instanceOf(Real)], 
        [instanceOf(Complex), instanceOf(Complex)],
        ([a, b]) => whenNumeric(a, b)
      )
      .with(
        [instanceOf(Real), instanceOf(Complex)], 
        ([a, b]) => whenNumeric(complex(a.value), b)
      )
      .with(
        [instanceOf(Complex), instanceOf(Real)],
        ([a, b]) => whenNumeric(a, complex(b.value))
      )
      .otherwise(([a, b]) => whenSymbolic(a, b) as Tree)
  }

  private unary<T extends Unary>(
    node: T, 
    whenNumeric: WhenUnaryNumeric, 
    whenSymbolic: WhenUnarySymbolic<T>
  ): Tree {
    const e = node.expression.accept(this)
    return match<Tree, Tree>(e)
      .with(instanceOf(Real), instanceOf(Complex), e => whenNumeric(e))
      .otherwise(e => whenSymbolic(e) as Tree)
  }
}
