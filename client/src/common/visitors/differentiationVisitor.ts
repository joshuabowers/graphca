import { Visitor, Node, $visit, $node } from 'pegase'
import { Real } from '../fields/Real'

const binaryOp = (node: Node): Node => {
  const a = $visit(node.a), b = $visit(node.b)
  return $node(node.$label, {a, b})
}

const real = (value: number): Node => {
  return $node('REAL', {value: new Real(value)})
}

export const differentiationVisitor: Visitor<Node> = {
  REAL: (node) => real(0),
  VARIABLE: (node) => real(1),

  PLUS: binaryOp,
  MINUS: binaryOp,

  /**
   * Applies the product rule to the node:
   * for a node representing f * g,
   * (f * g)' === (f' * g) + (f * g')
   * @param node a multiplication node to differentiate
   * @returns the product rule
   */
  MULTIPLY: (node) => {
    const a = $visit(node.a), b = $visit(node.b)
    return $node('PLUS', {
      a: $node('MULTIPLY', {
        a, b: node.b
      }),
      b: $node('MULTIPLY', {
        a: node.a, b
      })
    })
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
    return $node('DIVIDE', {
      a: $node('MINUS', {
        a: $node('MULTIPLY', {a, b: node.b}),
        b: $node('MULTIPLY', {a: b, b: node.a})
      }),
      b: $node('EXPONENT', {
        a: node.b, 
        b: real(2)
      })
    })
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
    return $node('MULTIPLY', {
      a: node,
      b: $node('PLUS', {
        a: $node('MULTIPLY', {
          a: a,
          b: $node('DIVIDE', {a: node.b, b: node.a})
        }),
        b: $node('MULTIPLY', {
          a: b,
          b: $node('LN', {expression: node.a})
        })
      })
    })
  },

  /**
   * Uses the constant factor rule:
   * for a node representing -1 * f (=== -f),
   * (-1 * f)' === -1 * f' === -(f')
   * @param node a negation to differentiate
   * @returns the negation of the derivative of the inner expression
   */
  NEGATE: (node) => $node('NEGATE', {expression: $visit(node.expression)}),

  COS: (node) => {
    const expression = $visit(node.expression)
    return $node('MULTIPLY', {
      a: $node('NEGATE', {expression: $node('SIN', {expression: node.expression})}),
      b: expression
    })
  },

  SIN: (node) => {
    const expression = $visit(node.expression)
    return $node('MULTIPLY', {
      a: $node('COS', {expression: node.expression}),
      b: expression
    })
  },

  TAN: (node) => {
    const expression = $visit(node.expression)
    return $node('MULTIPLY', {
      a: $node('PLUS', {
        a: real(1),
        b: $node('EXPONENT', {
          a: $node('TAN', {expression: node.expression}),
          b: real(2)
        })
      }),
      b: expression
    })
  },

  ACOS: (node) => {
    const expression = $visit(node.expression)
    return $node('NEGATE', {
      expression: $node('DIVIDE', {
        a: expression,
        b: $node('EXPONENT', {
          a: $node('MINUS', {
            a: real(1),
            b: $node('EXPONENT', {a: node.expression, b: real(2)})
          }),
          b: real(0.5)
        })
      })
    })
  },

  ASIN: (node) => {
    const expression = $visit(node.expression)
    return $node('DIVIDE', {
      a: expression,
      b: $node('EXPONENT', {
        a: $node('MINUS', {
          a: real(1),
          b: $node('EXPONENT', {
            a: node.expression,
            b: real(2)
          })
        }),
        b: real(0.5)
      })
    })
  },

  ATAN: (node) => {
    const expression = $visit(node.expression)
    return $node('DIVIDE', {
      a: expression,
      b: $node('PLUS', {
        a: real(1),
        b: $node('EXPONENT', {
          a: node.expression,
          b: real(2)
        })
      })
    })
  }
}