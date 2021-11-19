import React from 'react'
import { match, instanceOf, __, when } from 'ts-pattern'
import { 
  Unary, Binary, Expression,
  Real, Complex, Variable, Assignment, Invocation, Addition, Subtraction, 
  Multiplication, Division, Exponentiation, Negation, AbsoluteValue, 
  BinaryLogarithm, NaturalLogarithm, CommonLogarithm, Cosine, Sine, Tangent,
  Secant, Cosecant, Cotangent, ArcusCosine, ArcusSine, ArcusTangent, 
  ArcusSecant, ArcusCosecant, ArcusCotangent, HyperbolicCosine, 
  HyperbolicSine, HyperbolicTangent, HyperbolicSecant, HyperbolicCosecant, 
  HyperbolicCotangent, AreaHyperbolicCosine, AreaHyperbolicSine, 
  AreaHyperbolicTangent, AreaHyperbolicSecant, AreaHyperbolicCosecant, 
  AreaHyperbolicCotangent, Factorial, Gamma, Polygamma, Derivative 
} from '../../Tree'
import { Scope, Visitor } from '../Visitor'
import styles from './Componentization.module.css'

export class Componentization implements Visitor<JSX.Element> {
  constructor(public scope?: Scope) {}

  visitReal(node: Real): JSX.Element {
    return <span className={[styles.constant, styles.real].join(' ')}>
      {node.toString()}
    </span>
  }

  visitComplex(node: Complex): JSX.Element {
    return <span className={[styles.constant, styles.complex].join(' ')}>
      {node.toString()}
    </span>
  }

  visitVariable(node: Variable): JSX.Element {
    return <span className={styles.variable}>
      {node.name}
    </span>
  }

  visitAssignment(node: Assignment): JSX.Element {
    throw new Error('Method not implemented.')
  }

  visitInvocation(node: Invocation): JSX.Element {
    throw new Error('Method not implemented.')
  }

  visitAddition(node: Addition): JSX.Element {
    return this.binary(node, 'addition')
  }

  visitSubtraction(node: Subtraction): JSX.Element {
    return this.binary(node, 'subtraction')
  }

  visitMultiplication(node: Multiplication): JSX.Element {
    return this.binary(node, 'multiplication')
  }

  visitDivision(node: Division): JSX.Element {
    return this.binary(node, 'division')
  }

  visitExponentiation(node: Exponentiation): JSX.Element {
    return this.binary(node, 'exponentiation')
  }

  visitNegation(node: Negation): JSX.Element {
    const child = node.expression.accept(this)
    return <span className={[styles.functional, styles.negation].join(' ')}>
      {node.function}{
        match<Expression, JSX.Element>(node.expression)
          .with(
            instanceOf(Addition), instanceOf(Subtraction),
            instanceOf(Multiplication), instanceOf(Division),
            instanceOf(Exponentiation),
            () => <>({child})</>
          )
          .otherwise(() => child)
      }
    </span>
  }

  visitAbsoluteValue(node: AbsoluteValue): JSX.Element {
    return this.unary(node, 'absolute')
  }

  visitBinaryLogarithm(node: BinaryLogarithm): JSX.Element {
    return this.unary(node, 'logarithmic')
  }

  visitNaturalLogarithm(node: NaturalLogarithm): JSX.Element {
    return this.unary(node, 'logarithmic')
  }

  visitCommonLogarithm(node: CommonLogarithm): JSX.Element {
    return this.unary(node, 'logarithmic')
  }

  visitCosine(node: Cosine): JSX.Element {
    return this.unary(node, 'trigonometric')
  }

  visitSine(node: Sine): JSX.Element {
    return this.unary(node, 'trigonometric')
  }

  visitTangent(node: Tangent): JSX.Element {
    return this.unary(node, 'trigonometric')
  }

  visitSecant(node: Secant): JSX.Element {
    return this.unary(node, 'trigonometric')
  }

  visitCosecant(node: Cosecant): JSX.Element {
    return this.unary(node, 'trigonometric')
  }

  visitCotangent(node: Cotangent): JSX.Element {
    return this.unary(node, 'trigonometric')
  }

  visitArcusCosine(node: ArcusCosine): JSX.Element {
    return this.unary(node, 'arcus')
  }

  visitArcusSine(node: ArcusSine): JSX.Element {
    return this.unary(node, 'arcus')
  }

  visitArcusTangent(node: ArcusTangent): JSX.Element {
    return this.unary(node, 'arcus')
  }

  visitArcusSecant(node: ArcusSecant): JSX.Element {
    return this.unary(node, 'arcus')
  }

  visitArcusCosecant(node: ArcusCosecant): JSX.Element {
    return this.unary(node, 'arcus')
  }

  visitArcusCotangent(node: ArcusCotangent): JSX.Element {
    return this.unary(node, 'arcus')
  }

  visitHyperbolicCosine(node: HyperbolicCosine): JSX.Element {
    return this.unary(node, 'hyperbolic')
  }

  visitHyperbolicSine(node: HyperbolicSine): JSX.Element {
    return this.unary(node, 'hyperbolic')
  }

  visitHyperbolicTangent(node: HyperbolicTangent): JSX.Element {
    return this.unary(node, 'hyperbolic')
  }

  visitHyperbolicSecant(node: HyperbolicSecant): JSX.Element {
    return this.unary(node, 'hyperbolic')
  }

  visitHyperbolicCosecant(node: HyperbolicCosecant): JSX.Element {
    return this.unary(node, 'hyperbolic')
  }

  visitHyperbolicCotangent(node: HyperbolicCotangent): JSX.Element {
    return this.unary(node, 'hyperbolic')
  }

  visitAreaHyperbolicCosine(node: AreaHyperbolicCosine): JSX.Element {
    return this.unary(node, 'areaHyperbolic')
  }

  visitAreaHyperbolicSine(node: AreaHyperbolicSine): JSX.Element {
    return this.unary(node, 'areaHyperbolic')
  }

  visitAreaHyperbolicTangent(node: AreaHyperbolicTangent): JSX.Element {
    return this.unary(node, 'areaHyperbolic')
  }

  visitAreaHyperbolicSecant(node: AreaHyperbolicSecant): JSX.Element {
    return this.unary(node, 'areaHyperbolic')
  }

  visitAreaHyperbolicCosecant(node: AreaHyperbolicCosecant): JSX.Element {
    return this.unary(node, 'areaHyperbolic')
  }

  visitAreaHyperbolicCotangent(node: AreaHyperbolicCotangent): JSX.Element {
    return this.unary(node, 'areaHyperbolic')
  }

  visitFactorial(node: Factorial): JSX.Element {
    const child = node.expression.accept(this)
    const wrap = node.expression.$kind > 3 && node.expression.$kind < 11
    return <span className={styles.factorial}>
      {wrap ? this.wrap(child) : child}{node.function}
    </span>
  }

  visitGamma(node: Gamma): JSX.Element {
    return this.unary(node, 'gamma')
  }

  visitPolygamma(node: Polygamma): JSX.Element {
    const order = node.order.accept(this)
    const expression = node.expression.accept(this)
    return <span className={[styles.functional, styles.polygamma].join(' ')}>
      {node.function}<span className={styles.super}>{order}</span>({expression})
    </span>
  }

  visitDerivative(node: Derivative): JSX.Element {
    throw new Error('Method not implemented.')
  }

  private unary(node: Unary, className: string): JSX.Element {
    return <span className={[styles.functional, styles[className]].join(' ')}>
      {node.function}({node.expression.accept(this)})
    </span>
  }

  private binary(node: Binary, className: string): JSX.Element {
    const a = node.a.accept(this), b = node.b.accept(this)
    const op = node.operators[0]
    return (
      <span className={[styles.binary, styles[className]].join(' ')}>
        {this.parenthesize(node, node.a, a)}
        <span className={styles.operator}>{op}</span>
        {this.parenthesize(node, node.b, b)}
      </span>
    )
  }

  private parenthesize(node: Binary, child: Expression, output: JSX.Element): JSX.Element {
    const wrapped = () => this.wrap(output)
    return match<[Binary, Expression], JSX.Element>([node, child])
      .with(
        [instanceOf(Multiplication), instanceOf(Addition)],
        [instanceOf(Multiplication), instanceOf(Subtraction)],
        [instanceOf(Division), instanceOf(Addition)],
        [instanceOf(Division), instanceOf(Subtraction)],
        [instanceOf(Exponentiation), {$kind: when(k => k > 2)}],
        wrapped
      )
      .otherwise(() => output)
  }

  private wrap(e: JSX.Element) {
    return <>({e})</>
  }
}
