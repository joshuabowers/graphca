import { Visitor, Node, $visit, $node, $context, applyVisitor, $options } from 'pegase';
import { Scope } from '../Scope';
import { Field } from '../fields/Field';
import { Complex } from '../fields/Complex';
import { Real } from '../fields/Real';
import { parameterVisitor } from './parameterVisitor';
import { complex } from './helpers/Node';
import { differentiationVisitor } from './differentiationVisitor';

const createFieldNode = (label: string, value: Field<any>) => {
  return $node(label, {value})
}

type EvaluateBinary = (a: Field<any>, b: Field<any>) => Field<any>

const visitBinary = (evaluate: EvaluateBinary) => (node: Node): Node => {
  let a = $visit(node.a), b = $visit(node.b)
  if( a.value === undefined || b.value === undefined ){
    // Either a or b does not immediately evaluate to a Field subclass
    return $node(node.$label, {a, b})
  } 
  if( node.$label === 'RAISE' ){
    if( a.$label === 'REAL' && a.value.isNegative() ){
      a = complex(a.value.value)
    }
  }
  if( a.$label !== b.$label ){
    // lift real to complex
    if( a.$label === 'REAL' ){
      a = complex(a.value.value)
    } else {
      b = complex(b.value.value)
    }
  }
  return createFieldNode(a.$label, evaluate(a.value, b.value))
}

type EvaluateUnary = (expression: Field<any>) => Field<any>

const visitUnary = (evaluate: EvaluateUnary) => (node: Node): Node => {
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

const visitDifferentiate = (node: Node): Node => {
  const derivative = applyVisitor(node.expression, differentiationVisitor, $options())
  return $visit(derivative)
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

  ADD: visitBinary((a, b) => a.add(b)),
  SUBTRACT: visitBinary((a, b) => a.subtract(b)),
  MULTIPLY: visitBinary((a, b) => a.multiply(b)),
  DIVIDE: visitBinary((a, b) => a.divide(b)),
  RAISE: visitBinary((a, b) => a.raise(b)),

  NEGATE: visitUnary((expression) => expression.negate()),
  COS: visitUnary((expression) => expression.cos()),
  SIN: visitUnary((expression) => expression.sin()),
  TAN: visitUnary((expression) => expression.tan()),
  ACOS: visitUnary((expression) => expression.acos()),
  ASIN: visitUnary((expression) => expression.asin()),
  ATAN: visitUnary((expression) => expression.atan()),
  COSH: visitUnary((expression) => expression.cosh()),
  SINH: visitUnary((expression) => expression.sinh()),
  TANH: visitUnary((expression) => expression.tanh()),
  ACOSH: visitUnary((expression) => expression.acosh()),
  ASINH: visitUnary((expression) => expression.asinh()),
  ATANH: visitUnary((expression) => expression.atanh()),
  LB: visitUnary((expression) => expression.lb()),
  LN: visitUnary((expression) => expression.ln()),
  LG: visitUnary((expression) => expression.lg()),
  GAMMA: visitUnary((expression) => expression.gamma()),
  DIGAMMA: visitUnary((expression) => expression.digamma()),
  ABS: visitUnary((expression) => expression.abs()),
  FACTORIAL: visitUnary((expression) => expression.factorial()),

  DIFFERENTIATE: visitDifferentiate
}
