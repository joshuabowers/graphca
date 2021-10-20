import { Visitor, Node, $visit, $node } from 'pegase';
import { Field } from '../fields/Field';
import { Complex } from '../fields/Complex';
import { Real } from '../fields/Real';

const createFieldNode = (label: string, value: Field<any>) => {
  return $node(label, {value})
}

type EvaluateBinary = (a: Field<any>, b: Field<any>) => Field<any>

const visitBinary = (node: Node, evaluate: EvaluateBinary): Node => {
  let a = $visit(node.a), b = $visit(node.b)
  if( a.value === undefined || b.value === undefined ){
    // Either a or b does not immediately evaluate to a Field subclass
    return $node(node.$label, {a, b})
  } 
  if( a.$label !== b.$label ){
    // lift real to complex
    if( a.$label === 'REAL' ){
      a = createFieldNode('COMPLEX', new Complex(a.value.value, 0))
    } else {
      b = createFieldNode('COMPLEX', new Complex(b.value.value, 0))
    }
  }
  return createFieldNode(a.$label, evaluate(a.value, b.value))
}

type EvaluateUnary = (expression: Field<any>) => Field<any>

const visitUnary = (node: Node, evaluate: EvaluateUnary): Node => {
  let expression = $visit(node.expression)
  if( expression.value === undefined ){
    return $node(node.$label, {expression})
  }
  return createFieldNode(expression.$label, evaluate(expression.value))
}

export const evaluateVisitor: Visitor<Node> = {
  NUMBER: (node) => createFieldNode('REAL', new Real(node.value)),
  I: (node) => createFieldNode('COMPLEX', new Complex(0, node.value)),
  E: (node) => createFieldNode('REAL', Real.E),
  PI: (node) => createFieldNode('REAL', Real.PI),
  INFINITY: (node) => createFieldNode('REAL', Real.Infinity),
  VARIABLE: (node) => node,

  PLUS: (node) => visitBinary(node, (a, b) => a.add(b)),
  MINUS: (node) => visitBinary(node, (a, b) => a.subtract(b)),
  MULTIPLY: (node) => visitBinary(node, (a, b) => a.multiply(b)),
  DIVIDE: (node) => visitBinary(node, (a, b) => a.divide(b)),
  EXPONENT: (node) => visitBinary(node, (a, b) => a.raise(b)),

  NEGATE: (node) => visitUnary(node, (expression) => expression.negate()),
  COS: (node) => visitUnary(node, (expression) => expression.cos()),
  SIN: (node) => visitUnary(node, (expression) => expression.sin()),
  TAN: (node) => visitUnary(node, (expression) => expression.tan()),
  ACOS: (node) => visitUnary(node, (expression) => expression.acos()),
  ASIN: (node) => visitUnary(node, (expression) => expression.asin()),
  ATAN: (node) => visitUnary(node, (expression) => expression.atan()),
  COSH: (node) => visitUnary(node, (expression) => expression.cosh()),
  SINH: (node) => visitUnary(node, (expression) => expression.sinh()),
  TANH: (node) => visitUnary(node, (expression) => expression.tanh()),
  ACOSH: (node) => visitUnary(node, (expression) => expression.acosh()),
  ASINH: (node) => visitUnary(node, (expression) => expression.asinh()),
  ATANH: (node) => visitUnary(node, (expression) => expression.atanh()),
  LB: (node) => visitUnary(node, (expression) => expression.lb()),
  LN: (node) => visitUnary(node, (expression) => expression.ln()),
  LG: (node) => visitUnary(node, (expression) => expression.lg()),
  GAMMA: (node) => visitUnary(node, (expression) => expression.gamma()),
  ABS: (node) => visitUnary(node, (expression) => expression.abs()),
  FACTORIAL: (node) => visitUnary(node, (expression) => expression.factorial()),
}
