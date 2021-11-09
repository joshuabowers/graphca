import { Visitor, Node, $visit, $node, $context, applyVisitor, $options } from 'pegase';
import { Scope } from '../Scope';
import { Field } from '../fields/Field';
import { Complex } from '../fields/Complex';
import { Real } from '../fields/Real';
import { parameterVisitor } from './parameterVisitor';

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
  if( node.$label === 'EXPONENT' ){
    if( a.$label === 'REAL' && a.value.isNegative() ){
      a = createFieldNode('COMPLEX', new Complex(a.value.value, 0))
    }
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

const visitVariable = (node: Node): Node => {
  const scope = $context() as Scope
  const value = scope?.get(node.name)
  if(value && value.$label === 'VARIABLE' && value.name === node.name){
    return node
  }
  const evaluated = value && $visit(value)
  return evaluated ?? node
}

const visitAssign = (node: Node): Node => {
  const scope = $context() as Scope
  if(!scope){ throw new Error('No scope provided for assignment context'); }
  const evaluated = $visit(node.expression)
  scope.set(node.identifier, evaluated)
  return evaluated
}

const visitInvoke = (node: Node): Node => {
  const scope = $context() as Scope
  const setParameters = new Array<string>()
  if(!scope){ throw new Error('No scope provided for invocation context'); }
  const functionBody = scope?.get(node.identifier)
  if(!functionBody){ return node }
  try {
    const parameters = applyVisitor(functionBody, parameterVisitor, $options())
    if(parameters){
      parameters.forEach( (parameter, index) => {
        const argument = node.argumentList[index] ?
          $visit(node.argumentList[index]) : undefined
        if(argument){
          scope.set(parameter, argument)
          setParameters.push(parameter)
        }
      })
    }
    return $visit(functionBody)
  } finally {
    setParameters.forEach( parameter => {
      scope.removeLast(parameter)
    })
  }
}

export const evaluateVisitor: Visitor<Node> = {
  NUMBER: (node) => createFieldNode('REAL', new Real(node.value)),
  I: (node) => createFieldNode('COMPLEX', new Complex(0, node.value)),
  E: (node) => createFieldNode('REAL', Real.E),
  PI: (node) => createFieldNode('REAL', Real.PI),
  EPSILON: (node) => createFieldNode('REAL', Real.Epsilon),
  INFINITY: (node) => createFieldNode('REAL', Real.Infinity),
  REAL: (node) => node,
  COMPLEX: (node) => node,

  VARIABLE: (node) => visitVariable(node),
  ASSIGN: (node) => visitAssign(node),
  INVOKE: (node) => visitInvoke(node),

  ADD: (node) => visitBinary(node, (a, b) => a.add(b)),
  SUBTRACT: (node) => visitBinary(node, (a, b) => a.subtract(b)),
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
