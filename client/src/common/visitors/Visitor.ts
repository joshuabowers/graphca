import {
  Real, Complex,
  Variable, Assignment, Invocation,
  Addition, Subtraction, Multiplication, Division, Exponentiation,
  Negation, AbsoluteValue,
  BinaryLogarithm, NaturalLogarithm, CommonLogarithm,
  Cosine, Sine, Tangent,
  ArcusCosine, ArcusSine, ArcusTangent,
  HyperbolicCosine, HyperbolicSine, HyperbolicTangent,
  AreaHyperbolicCosine, AreaHyperbolicSine, AreaHyperbolicTangent,
  Factorial, Gamma, Polygamma,
  Derivative
} from '../Tree'

export interface Visitor<Value> {
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

  visitArcusCosine(node: ArcusCosine): Value
  visitArcusSine(node: ArcusSine): Value
  visitArcusTangent(node: ArcusTangent): Value

  visitHyperbolicCosine(node: HyperbolicCosine): Value
  visitHyperbolicSine(node: HyperbolicSine): Value
  visitHyperbolicTangent(node: HyperbolicTangent): Value

  visitAreaHyperbolicCosine(node: AreaHyperbolicCosine): Value
  visitAreaHyperbolicSine(node: AreaHyperbolicSine): Value
  visitAreaHyperbolicTangent(node: AreaHyperbolicTangent): Value

  visitFactorial(node: Factorial): Value
  visitGamma(node: Gamma): Value
  visitPolygamma(node: Polygamma): Value

  visitDerivative(node: Derivative): Value
}
