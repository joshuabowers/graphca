import { Base } from "../Tree";
// import { match, instanceOf, not } from 'ts-pattern'
// import {
//   Expression,
//   Real, Complex, Variable, Assignment, Invocation, 
//   AbsoluteValue, Addition, ArcusCosecant, ArcusCosine, 
//   ArcusCotangent, ArcusSecant, ArcusSine, ArcusTangent, 
//   AreaHyperbolicCosecant, AreaHyperbolicCosine, AreaHyperbolicCotangent, 
//   AreaHyperbolicSecant, AreaHyperbolicSine, AreaHyperbolicTangent, 
//   BinaryLogarithm, CommonLogarithm, Cosecant, Cosine, Cotangent, 
//   Derivative, Division, Exponentiation, Factorial, Gamma, 
//   HyperbolicCosecant, HyperbolicCosine, HyperbolicCotangent, 
//   HyperbolicSecant, HyperbolicSine, HyperbolicTangent, Multiplication,
//   NaturalLogarithm, Negation, Polygamma, Secant, Sine, Subtraction, Tangent
// } from '../Tree'
// import { Visitor, Scope, scope } from './Visitor'

// export class Parameterization implements Visitor<Set<string>> {
//   constructor(public scope: Scope | undefined = undefined) {}

//   visitReal(node: Real): Set<string> {
//     return new Set()
//   }

//   visitComplex(node: Complex): Set<string> {
//     return new Set()
//   }

//   visitVariable(node: Variable): Set<string> {
//     const expression = this.scope?.get(node.name)
//     return match<Expression | undefined, Set<string>>(expression)
//       .with(instanceOf(Variable), v => v.name === node.name, v => new Set(v.name))
//       .with(not(undefined), e => e.accept(this))
//       .otherwise(() => new Set(node.name))
//   }

//   visitAssignment(node: Assignment): Set<string> {
//     return this.union(node.a.accept(this), node.b.accept(this))
//   }

//   visitInvocation(node: Invocation): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitAddition(node: Addition): Set<string> {
//     return this.union(node.a.accept(this), node.b.accept(this))
//   }

//   visitSubtraction(node: Subtraction): Set<string> {
//     return this.union(node.a.accept(this), node.b.accept(this))
//   }

//   visitMultiplication(node: Multiplication): Set<string> {
//     return this.union(node.a.accept(this), node.b.accept(this))
//   }

//   visitDivision(node: Division): Set<string> {
//     return this.union(node.a.accept(this), node.b.accept(this))
//   }

//   visitExponentiation(node: Exponentiation): Set<string> {
//     return this.union(node.a.accept(this), node.b.accept(this))
//   }

//   visitNegation(node: Negation): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitAbsoluteValue(node: AbsoluteValue): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitBinaryLogarithm(node: BinaryLogarithm): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitNaturalLogarithm(node: NaturalLogarithm): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitCommonLogarithm(node: CommonLogarithm): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitCosine(node: Cosine): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitSine(node: Sine): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitTangent(node: Tangent): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitSecant(node: Secant): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitCosecant(node: Cosecant): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitCotangent(node: Cotangent): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitArcusCosine(node: ArcusCosine): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitArcusSine(node: ArcusSine): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitArcusTangent(node: ArcusTangent): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitArcusSecant(node: ArcusSecant): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitArcusCosecant(node: ArcusCosecant): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitArcusCotangent(node: ArcusCotangent): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitHyperbolicCosine(node: HyperbolicCosine): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitHyperbolicSine(node: HyperbolicSine): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitHyperbolicTangent(node: HyperbolicTangent): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitHyperbolicSecant(node: HyperbolicSecant): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitHyperbolicCosecant(node: HyperbolicCosecant): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitHyperbolicCotangent(node: HyperbolicCotangent): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitAreaHyperbolicCosine(node: AreaHyperbolicCosine): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitAreaHyperbolicSine(node: AreaHyperbolicSine): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitAreaHyperbolicTangent(node: AreaHyperbolicTangent): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitAreaHyperbolicSecant(node: AreaHyperbolicSecant): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitAreaHyperbolicCosecant(node: AreaHyperbolicCosecant): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitAreaHyperbolicCotangent(node: AreaHyperbolicCotangent): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitFactorial(node: Factorial): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitGamma(node: Gamma): Set<string> {
//     return node.expression.accept(this)
//   }

//   visitPolygamma(node: Polygamma): Set<string> {
//     return this.union(node.order.accept(this), node.expression.accept(this))
//   }

//   visitDerivative(node: Derivative): Set<string> {
//     return node.expression.accept(this)
//   }

//   union(a: Set<string>, b: Set<string>) {
//     const u = new Set(a)
//     for(const e of b){
//       u.add(e)
//     }
//     return u
//   }
// }