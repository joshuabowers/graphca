import { Visitor, Node, $visit, $node } from 'pegase'
import { Real } from '../fields/Real'

const binaryOp = (node: Node): Node => {
  const a = $visit(node.a), b = $visit(node.b)
  return $node(node.$label, {a, b})
}

export const differentiationVisitor: Visitor<Node> = {
  REAL: (node) => $node('REAL', {value: Real.Zero}),
  VARIABLE: (node) => $node('REAL', {value: new Real(1)}),

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
        b: $node('REAL', {value: new Real(2)
      })})
    })
  }
}