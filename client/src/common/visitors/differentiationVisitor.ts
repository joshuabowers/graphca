import { Visitor, Node, $visit, $context } from 'pegase'
import { 
  real,
  add, subtract, multiply, divide, raise,
  cos, sin, tan, cosh, sinh, tanh,
  negate, ln,
  factorial, gamma, digamma
} from './helpers/Node'
import { Scope } from '../Scope'

const logarithm = (base: number) => (node: Node) => divide(
  $visit(node.expression),
  base === Math.E ? node.expression : multiply(
    node.expression,
    ln(real(base))
  )
)

const constant = (node: Node) => real(0)

export const differentiationVisitor: Visitor<Node> = {
  REAL: constant,
  NUMBER: constant,
  E: constant,
  PI: constant,

  VARIABLE: (node) => {
    const scope = $context() as Scope
    const body = scope?.get(node.name)
    return body
      ? $visit(body)
      : real(1)
  },

  ADD: (node) => add($visit(node.a), $visit(node.b)),
  SUBTRACT: (node) => subtract($visit(node.a), $visit(node.b)),

  /**
   * Applies the product rule to the node:
   * for a node representing f * g,
   * (f * g)' === (f' * g) + (f * g')
   * @param node a multiplication node to differentiate
   * @returns the product rule
   */
  MULTIPLY: (node) => {
    return add(
      multiply($visit(node.a), node.b),
      multiply(node.a, $visit(node.b))
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
    return divide(
      subtract(
        multiply($visit(node.a), node.b),
        multiply($visit(node.b), node.a)
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
    return multiply(
      node,
      add(
        multiply(
          $visit(node.a),
          divide(node.b, node.a)
        ),
        multiply(
          $visit(node.b),
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
    return multiply(
      negate(sin(node.expression)),
      $visit(node.expression)
    )
  },

  SIN: (node) => {
    return multiply(
      cos(node.expression),
      $visit(node.expression)
    )
  },

  TAN: (node) => {
    return multiply(
      add(
        real(1),
        raise(
          tan(node.expression),
          real(2)
        )
      ),
      $visit(node.expression)
    )
  },

  ACOS: (node) => {
    return negate(
      divide(
        $visit(node.expression),
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
    return divide(
      $visit(node.expression),
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
    return divide(
      $visit(node.expression),
      add(
        real(1),
        raise(node.expression, real(2))
      )
    )
  },

  COSH: (node) => {
    return multiply(
      sinh(node.expression),
      $visit(node.expression)
    )
  },

  SINH: (node) => {
    return multiply(
      cosh(node.expression),
      $visit(node.expression)
    )
  },

  TANH: (node) => {
    return multiply(
      subtract(
        real(1),
        raise(tanh(node.expression), real(2))
      ),
      $visit(node.expression)
    )
  },

  ACOSH: (node) => {
    return divide(
      $visit(node.expression),
      raise(
        subtract(
          raise(node.expression, real(2)),
          real(1)
        ),
        real(0.5)
      )
    )
  },

  ASINH: (node) => {
    return divide(
      $visit(node.expression),
      raise(
        add(
          real(1),
          raise(node.expression, real(2))
        ),
        real(0.5)
      )
    )
  },

  ATANH: (node) => {
    return divide(
      $visit(node.expression),
      subtract(
        real(1),
        raise(node.expression, real(2))
      )
    )
  },

  LB: logarithm(2),
  LN: logarithm(Math.E),
  LG: logarithm(10),

  FACTORIAL: (node) => {
    return multiply(
      multiply(
        factorial(node.expression),
        digamma(
          add(node.expression, real(1))
        )
      ),
      $visit(node.expression)
    )
  },

  GAMMA: (node) => {
    return multiply(
      multiply(
        gamma(node.expression),
        digamma(node.expression)
      ),
      $visit(node.expression)
    )
  },

  ABS: (node) => {
    return divide(
      multiply(node.expression, $visit(node.expression)),
      node
    )
  },

  DIFFERENTIATE: (node) => $visit($visit(node.expression))
}