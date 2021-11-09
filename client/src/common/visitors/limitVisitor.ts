import { $visit, Visitor, Node, $node } from 'pegase'
import { Complex } from '../fields/Complex'
import { Real } from '../fields/Real'

export type Asymptote = {[x: string]: number | Real | Complex}

type BinaryOverride = (a: Node, b: Node) => Node | undefined

const binaryOp = (node: Node, override?: BinaryOverride) => {
  const a = $visit(node.a), b = $visit(node.b)
  return override && override(a, b) || $node(node.$label, {a, b})
}

type UnaryOverride = (n: Node) => Node | undefined

const unaryOp = (node: Node, override?: UnaryOverride) => {
  const expression = $visit(node.expression)
  return override && override(expression) || $node(node.$label, {expression})
}

export const createLimitVisitor = (asymptotes: Asymptote): Visitor<Node | undefined> => {
  return {
    REAL: (node) => node,
    COMPLEX: (node) => $node('REAL', {value: new Real(node.value.modulus())}),
    VARIABLE: (node) => {
      const value = asymptotes[node.name]
      const label = typeof(value) === 'number' ? 'REAL' : value.fieldName
      const next = typeof(value) === 'number' ? new Real(value) : value
      return $node(label, {value: next})  
    },

    ADD: binaryOp,
    SUBTRACT: binaryOp,
    MULTIPLY: binaryOp,
    DIVIDE: (node) => binaryOp(node, (a,b) => (
      b.value instanceof Real && b.value.value === 0
      || b.value instanceof Complex && b.value.modulus() === 0
      ? $node('UNDEFINED', {}) : undefined
    )),
    EXPONENT: (node) => binaryOp(node, (a,b) => (
      (a.value instanceof Real && a.value.value === 0)
      && (b.value instanceof Real && b.value.value < 0 && (
        b.value.value % 2 === 0
        ? $node('INFINITY', {}) 
        : $node('NEGATE', {expression: $node('INFINITY', {})})
        )) 
      || undefined
    )),

    NEGATE: unaryOp,

    COS: unaryOp,
    SIN: unaryOp,
    TAN: unaryOp,

    LB: unaryOp,
    LN: unaryOp,
    LG: unaryOp
  }
}
