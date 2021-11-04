import { Visitor, Node, $visit, $node } from 'pegase'
import { Real } from '../fields/Real'

export const differentiationVisitor: Visitor<Node> = {
  REAL: (node) => $node('REAL', {value: Real.Zero})
}