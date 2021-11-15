import {
  Addition, Subtraction, Multiplication, Division, Exponentiation,
  Negation, BinaryLogarithm, NaturalLogarithm, CommonLogarithm,
  Cosine, Sine, Tangent,
  Real, Complex, Variable, Tree, Logarithm,
  add, subtract, multiply, divide, raise, real, complex, variable,
  negate, lb, ln, lg,
  cos, sin, tan
} from '../Tree'

export {
  Addition, Subtraction, Multiplication, Division, Exponentiation,
  Negation, BinaryLogarithm, NaturalLogarithm, CommonLogarithm,
  Cosine, Sine, Tangent,
  Real, Complex, Variable,
  add, subtract, multiply, divide, raise, real, complex, variable,
  negate, lb, ln, lg,
  cos, sin, tan
}
export type { Tree, Logarithm }

export abstract class Visitor<Value> {
  abstract visitReal(node: Real): Value
  abstract visitComplex(node: Complex): Value

  abstract visitVariable(node: Variable): Value

  abstract visitAddition(node: Addition): Value
  abstract visitSubtraction(node: Subtraction): Value
  abstract visitMultiplication(node: Multiplication): Value
  abstract visitDivision(node: Division): Value
  abstract visitExponentiation(node: Exponentiation): Value

  abstract visitNegation(node: Negation): Value

  abstract visitBinaryLogarithm(node: BinaryLogarithm): Value
  abstract visitNaturalLogarithm(node: NaturalLogarithm): Value
  abstract visitCommonLogarithm(node: CommonLogarithm): Value

  abstract visitCosine(node: Cosine): Value
  abstract visitSine(node: Sine): Value
  abstract visitTangent(node: Tangent): Value

  visit(node: Tree): Value {
    return node.accept(this)
  }
}
