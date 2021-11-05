import { Visitor, Node, $visit, $node } from 'pegase'
import { Real } from '../fields/Real'

const unary = (label: string, expression: Node) => $node(label, {expression})

const real = (value: number) => $node('REAL', {value: new Real(value)})
const add = (a: Node, b: Node) => $node('PLUS', {a, b})
const subtract = (a: Node, b: Node) => $node('MINUS', {a, b})
const multiply = (a: Node, b: Node) => $node('MULTIPLY', {a, b})
const divide = (a: Node, b: Node) => $node('DIVIDE', {a, b})
const raise = (a: Node, b: Node) => $node('EXPONENT', {a, b})
const negate = (expression: Node) => unary('NEGATE', expression)
const cos = (expression: Node) => unary('COS', expression)
const sin = (expression: Node) => unary('SIN', expression)
const tan = (expression: Node) => unary('TAN', expression)
const ln = (expression: Node) => unary('LN', expression)

export const differentiationVisitor: Visitor<Node> = {
  REAL: (node) => real(0),
  VARIABLE: (node) => real(1),

  PLUS: (node) => add($visit(node.a), $visit(node.b)),
  MINUS: (node) => subtract($visit(node.a), $visit(node.b)),

  /**
   * Applies the product rule to the node:
   * for a node representing f * g,
   * (f * g)' === (f' * g) + (f * g')
   * @param node a multiplication node to differentiate
   * @returns the product rule
   */
  MULTIPLY: (node) => {
    const a = $visit(node.a), b = $visit(node.b)
    return add(
      multiply(a, node.b),
      multiply(node.a, b)
    )
  },

  /**
   * Applies the quotient rule to the node:
   * for a node representing f / g,
   * (f / g)' === ((f' * g) - (g' * f)) / g ** 2
   * @param node a division node to differentiate
   * @returns the quotient rule
   */
  DIVIDE: (node) => {
    const a = $visit(node.a), b = $visit(node.b)
    return divide(
      subtract(
        multiply(a, node.b),
        multiply(b, node.a)
      ),
      raise(node.b, real(2))
    )
  },

  /**
   * Applies the generalized power rule to the node:
   * for a node representing f ** g,
   * (f ** g)' === (f ** g) * ((f' * (g / f)) + (g' * ln(f)))
   * @param node an exponent node to differentiate
   * @returns the generalized power rule
   */
  EXPONENT: (node) => {
    const a = $visit(node.a), b = $visit(node.b)
    return multiply(
      node,
      add(
        multiply(
          a,
          divide(node.b, node.a)
        ),
        multiply(
          b,
          ln(node.a)
        )
      )
    )
  },

  /**
   * Uses the constant factor rule:
   * for a node representing -1 * f (=== -f),
   * (-1 * f)' === -1 * f' === -(f')
   * @param node a negation to differentiate
   * @returns the negation of the derivative of the inner expression
   */
  NEGATE: (node) => negate($visit(node.expression)),

  COS: (node) => {
    const expression = $visit(node.expression)
    return multiply(
      negate(sin(node.expression)),
      expression
    )
  },

  SIN: (node) => {
    const expression = $visit(node.expression)
    return multiply(
      cos(node.expression),
      expression
    )
  },

  TAN: (node) => {
    const expression = $visit(node.expression)
    return multiply(
      add(
        real(1),
        raise(
          tan(node.expression),
          real(2)
        )
      ),
      expression
    )
  },

  ACOS: (node) => {
    const expression = $visit(node.expression)
    return negate(
      divide(
        expression,
        raise(
          subtract(
            real(1),
            raise(node.expression, real(2))
          ),
          real(0.5)
        )
      )
    )
  },

  ASIN: (node) => {
    const expression = $visit(node.expression)
    return divide(
      expression,
      raise(
        subtract(
          real(1),
          raise(node.expression, real(2))
        ),
        real(0.5)
      )
    )
  },

  ATAN: (node) => {
    const expression = $visit(node.expression)
    return divide(
      expression,
      add(
        real(1),
        raise(node.expression, real(2))
      )
    )
  }
}