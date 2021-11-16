// import {
//   Addition, Subtraction, Multiplication, Division, Exponentiation,
//   Negation, AbsoluteValue,
//   BinaryLogarithm, NaturalLogarithm, CommonLogarithm,
//   Cosine, Sine, Tangent,
//   ArcusCosine, ArcusSine, ArcusTangent,
//   HyperbolicCosine, HyperbolicSine, HyperbolicTangent,
//   AreaHyperbolicCosine, AreaHyperbolicSine, AreaHyperbolicTangent,
//   Factorial, Gamma, Polygamma,
//   Real, Complex, Variable, Assignment, Invocation,
//   Derivative,
//   Logarithm, Kind,
//   add, subtract, multiply, divide, raise, 
//   real, complex, variable, assign, invoke, differentiate,
//   negate, abs,
//   lb, ln, lg,
//   cos, sin, tan,
//   acos, asin, atan,
//   cosh, sinh, tanh,
//   acosh, asinh, atanh,
//   factorial, gamma, polygamma
// } from '../Tree'
// import { Tree } from "../Tree"

// export {
//   Addition, Subtraction, Multiplication, Division, Exponentiation,
//   Negation, AbsoluteValue,
//   BinaryLogarithm, NaturalLogarithm, CommonLogarithm,
//   Cosine, Sine, Tangent,
//   ArcusCosine, ArcusSine, ArcusTangent,
//   HyperbolicCosine, HyperbolicSine, HyperbolicTangent,
//   AreaHyperbolicCosine, AreaHyperbolicSine, AreaHyperbolicTangent,
//   Factorial, Gamma, Polygamma,
//   Real, Complex, Variable, Assignment, Invocation, Kind,
//   Derivative,
//   add, subtract, multiply, divide, raise, 
//   real, complex, variable, assign, invoke, differentiate,
//   negate, abs,
//   lb, ln, lg,
//   cos, sin, tan,
//   acos, asin, atan,
//   cosh, sinh, tanh,
//   acosh, asinh, atanh,
//   factorial, gamma, polygamma
// }
// export type { Tree, Logarithm }

declare interface Node { accept<V>(visitor: Visitor<V>): V } 
declare class Real {}
declare class Complex {}
declare class Variable {}
declare class Assignment {}
declare class Invocation {}
declare class Addition {}
declare class Subtraction {}
declare class Multiplication {}
declare class Division {}
declare class Exponentiation {}
declare class Negation {}
declare class AbsoluteValue {}
declare class BinaryLogarithm {}
declare class NaturalLogarithm {}
declare class CommonLogarithm {}
declare class Cosine {}
declare class Sine {}
declare class Tangent {}
declare class ArcusCosine {}
declare class ArcusSine {}
declare class ArcusTangent {}
declare class HyperbolicCosine {}
declare class HyperbolicSine {}
declare class HyperbolicTangent {}
declare class AreaHyperbolicCosine {}
declare class AreaHyperbolicSine {}
declare class AreaHyperbolicTangent {}
declare class Factorial {}
declare class Gamma {}
declare class Polygamma {}
declare class Derivative {}
declare type Tree = Node;

export abstract class Visitor<Value> {
  abstract visitReal(node: Real): Value
  abstract visitComplex(node: Complex): Value

  abstract visitVariable(node: Variable): Value
  abstract visitAssignment(node: Assignment): Value
  abstract visitInvocation(node: Invocation): Value

  abstract visitAddition(node: Addition): Value
  abstract visitSubtraction(node: Subtraction): Value
  abstract visitMultiplication(node: Multiplication): Value
  abstract visitDivision(node: Division): Value
  abstract visitExponentiation(node: Exponentiation): Value

  abstract visitNegation(node: Negation): Value
  abstract visitAbsoluteValue(node: AbsoluteValue): Value

  abstract visitBinaryLogarithm(node: BinaryLogarithm): Value
  abstract visitNaturalLogarithm(node: NaturalLogarithm): Value
  abstract visitCommonLogarithm(node: CommonLogarithm): Value

  abstract visitCosine(node: Cosine): Value
  abstract visitSine(node: Sine): Value
  abstract visitTangent(node: Tangent): Value

  abstract visitArcusCosine(node: ArcusCosine): Value
  abstract visitArcusSine(node: ArcusSine): Value
  abstract visitArcusTangent(node: ArcusTangent): Value

  abstract visitHyperbolicCosine(node: HyperbolicCosine): Value
  abstract visitHyperbolicSine(node: HyperbolicSine): Value
  abstract visitHyperbolicTangent(node: HyperbolicTangent): Value

  abstract visitAreaHyperbolicCosine(node: AreaHyperbolicCosine): Value
  abstract visitAreaHyperbolicSine(node: AreaHyperbolicSine): Value
  abstract visitAreaHyperbolicTangent(node: AreaHyperbolicTangent): Value

  abstract visitFactorial(node: Factorial): Value
  abstract visitGamma(node: Gamma): Value
  abstract visitPolygamma(node: Polygamma): Value

  abstract visitDerivative(node: Derivative): Value

  visit(node: Tree): Value {
    return node.accept(this)
  }
}
