import { $visit, Visitor, Node, $node } from 'pegase'
import { Real } from '../fields/Real'

export const limitVisitor: Visitor<Node> = {
  REAL: (node) => node,
  COMPLEX: (node) => $node('REAL', {value: new Real(node.value.modulus())})
}