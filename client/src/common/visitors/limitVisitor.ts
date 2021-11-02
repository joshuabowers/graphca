import { $visit, Visitor, Node, $node } from 'pegase'
import { Complex } from '../fields/Complex'
import { Real } from '../fields/Real'

export const createLimitVisitor = (asymptotes: {[x:string]: number | Real | Complex}): Visitor<Node> => {
  return {
    REAL: (node) => node,
    COMPLEX: (node) => $node('REAL', {value: new Real(node.value.modulus())}),
    VARIABLE: (node) => {
      const value = asymptotes[node.name]
      const label = typeof(value) === 'number' ? 'REAL' : value.fieldName
      const next = typeof(value) === 'number' ? new Real(value) : value
      return $node(label, {value: next})  
    },

    PLUS: (node) => {
      const a = $visit(node.a), b = $visit(node.b)
      return $node('PLUS', {a, b})
    },

    MINUS: (node) => {
      const a = $visit(node.a), b = $visit(node.b)
      return $node('MINUS', {a, b})
    }
  }
}
