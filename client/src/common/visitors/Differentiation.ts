import {
  Visitor,
  Addition, Subtraction, Multiplication, Division, Exponentiation,
  Negation, BinaryLogarithm, NaturalLogarithm, CommonLogarithm,
  Real, Complex, Tree, Logarithm, 
  add, subtract, multiply, divide, raise, real, complex,
  negate, lb, ln, lg
} from './Visitor'

export class Differentiation extends Visitor<Tree> {
  visitReal(_: Real): Tree {
    return real(0)
  }

  visitComplex(_: Complex): Tree {
    return complex(0)
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

  visitBinaryLogarithm(node: BinaryLogarithm): Tree {
    return this.logarithm(2, node)
  }

  visitNaturalLogarithm(node: NaturalLogarithm): Tree {
    return this.logarithm(Math.E, node)
  }

  visitCommonLogarithm(node: CommonLogarithm): Tree {
    return this.logarithm(10, node)
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
