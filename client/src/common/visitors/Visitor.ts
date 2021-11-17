import {
  Expression, Real, Complex,
  Variable, Assignment, Invocation,
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
  Derivative
} from '../Tree'

export type Scope = Map<string, Expression>

export const scope = (): Scope => new Map<string, Expression>()

export interface Visitor<Value> {
  scope?: Scope

  visitReal(node: Real): Value
  visitComplex(node: Complex): Value

  visitVariable(node: Variable): Value
  visitAssignment(node: Assignment): Value
  visitInvocation(node: Invocation): Value

  visitAddition(node: Addition): Value
  visitSubtraction(node: Subtraction): Value
  visitMultiplication(node: Multiplication): Value
  visitDivision(node: Division): Value
  visitExponentiation(node: Exponentiation): Value

  visitNegation(node: Negation): Value
  visitAbsoluteValue(node: AbsoluteValue): Value

  visitBinaryLogarithm(node: BinaryLogarithm): Value
  visitNaturalLogarithm(node: NaturalLogarithm): Value
  visitCommonLogarithm(node: CommonLogarithm): Value

  visitCosine(node: Cosine): Value
  visitSine(node: Sine): Value
  visitTangent(node: Tangent): Value
  visitSecant(node: Secant): Value
  visitCosecant(node: Cosecant): Value
  visitCotangent(node: Cotangent): Value

  visitArcusCosine(node: ArcusCosine): Value
  visitArcusSine(node: ArcusSine): Value
  visitArcusTangent(node: ArcusTangent): Value
  visitArcusSecant(node: ArcusSecant): Value
  visitArcusCosecant(node: ArcusCosecant): Value
  visitArcusCotangent(node: ArcusCotangent): Value

  visitHyperbolicCosine(node: HyperbolicCosine): Value
  visitHyperbolicSine(node: HyperbolicSine): Value
  visitHyperbolicTangent(node: HyperbolicTangent): Value
  visitHyperbolicSecant(node: HyperbolicSecant): Value
  visitHyperbolicCosecant(node: HyperbolicCosecant): Value
  visitHyperbolicCotangent(node: HyperbolicCotangent): Value

  visitAreaHyperbolicCosine(node: AreaHyperbolicCosine): Value
  visitAreaHyperbolicSine(node: AreaHyperbolicSine): Value
  visitAreaHyperbolicTangent(node: AreaHyperbolicTangent): Value
  visitAreaHyperbolicSecant(node: AreaHyperbolicSecant): Value
  visitAreaHyperbolicCosecant(node: AreaHyperbolicCosecant): Value
  visitAreaHyperbolicCotangent(node: AreaHyperbolicCotangent): Value

  visitFactorial(node: Factorial): Value
  visitGamma(node: Gamma): Value
  visitPolygamma(node: Polygamma): Value

  visitDerivative(node: Derivative): Value
}
