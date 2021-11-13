import { Visitor, Node, Location, $visit, $node } from 'pegase'
import { Complex } from '../fields/Complex'
import { Field } from '../fields/Field'
import { Real } from '../fields/Real'
import { add, subtract, multiply, divide, raise, negate, real } from './helpers/Node'
import { match, not, __ } from 'ts-pattern'

const isComplex = (value: Real | Complex): value is Complex => {
  return value instanceof Complex
}

const equals = (a: Real | Complex, b: Real | Complex): boolean => {
  let c: Field<any> = a, d: Field<any> = b
  if(isComplex(a) && !isComplex(b)){
    d = new Complex(b.value)
  } else if(!isComplex(a) && isComplex(b)){
    c = new Complex(a.value)
  }
  return c.equals(d)
}

const stripLocations = (node: Node): Omit<Node, '$from' | '$to'> => {
  const {$from, $to, ...fields} = node
  return fields
}

const equivalent = (a: Node, b: Node): boolean => {
  const sa = stripLocations(a), sb = stripLocations(b)  
  for(const p in sa) {
    if(typeof sa[p] === 'string' && sa[p] !== sb[p]){ return false }
    else if(
      sa[p].value && typeof sa[p].value.equals === 'function' 
      && !(sa[p].value.equals(sb[p].value))
    ){ return false }
    else if(sa[p].$label && !equivalent(sa[p], sb[p])){ return false }
  }
  return true
}

type Binary = 'ADD' | 'SUBTRACT' | 'MULTIPLY' | 'DIVIDE' | 'RAISE'
type Unary = 'LB' | 'LN' | 'LG'

type AST = 
  | { $label: Binary, a: AST, b: AST, $from: Location, $to: Location }
  | { $label: Unary, expression: AST, $from: Location, $to: Location }
  | { $label: 'REAL', value: Real, $from: Location, $to: Location }
  | { $label: 'COMPLEX', value: Complex, $from: Location, $to: Location }
  | { $label: 'VARIABLE', name: string, $from: Location, $to: Location }

const identity = (node: Node): Node => node

const logarithm = (base: number) => {
  return (node: Node): Node => {
    const expression = $visit(node.expression)
    return match<AST, Node>(expression)
      .with(
        {$label: 'RAISE', a: {value: {value: base}}}, 
        (expression) => expression.b
      )
      .otherwise((expression) => $node(node.$label, {expression}))
  }
}

export const simplifyVisitor: Visitor<Node> = {
  REAL: identity,
  COMPLEX: identity,
  VARIABLE: identity,

  ADD: (node) => {
    const a = $visit(node.a), b = $visit(node.b)
    return match<[AST, AST], Node>([a, b])
      .with([{value: {value: 0}}, __], ([, b]) => b)
      .with([__, {value: {value: 0}}], ([a, ]) => a)
      .with(
        [{$label: 'MULTIPLY', a: {$label: 'REAL'}}, {$label: not('MULTIPLY')}],
        ([a, b]) => equivalent(a.b, b),
        ([a, b]) => multiply(real(a.a.value.value + 1), b)
      )
      .with(
        [{$label: 'MULTIPLY', b: {$label: 'REAL'}}, {$label: not('MULTIPLY')}],
        ([a, b]) => equivalent(a.a, b),
        ([a, b]) => multiply(real(a.b.value.value + 1), b)        
      )
      .with(
        [{$label: not('MULTIPLY')}, {$label: 'MULTIPLY', a: {$label: 'REAL'}}],
        ([a, b]) => equivalent(a, b.b),
        ([a, b]) => multiply(real(b.a.value.value + 1), a)
      )
      .with(
        [{$label: not('MULTIPLY')}, {$label: 'MULTIPLY', b: {$label: 'REAL'}}],
        ([a, b]) => equivalent(a, b.a),
        ([a, b]) => multiply(real(b.b.value.value + 1), a)
      )
      .with(
        [{$label: 'MULTIPLY', a: {$label: 'REAL'}}, {$label: 'MULTIPLY', a: {$label: 'REAL'}}],
        ([a, b]) => equivalent(a.b, b.b),
        ([a, b]) => multiply(real(a.a.value.value + b.a.value.value), a.b)
      )
      .with(
        [{$label: 'MULTIPLY', a: {$label: 'REAL'}}, {$label: 'MULTIPLY', b: {$label: 'REAL'}}],
        ([a, b]) => equivalent(a.b, b.a),
        ([a, b]) => multiply(real(a.a.value.value + b.b.value.value), a.b)
      )
      .with(
        [{$label: 'MULTIPLY', b: {$label: 'REAL'}}, {$label: 'MULTIPLY', a: {$label: 'REAL'}}],
        ([a, b]) => equivalent(a.a, b.b),
        ([a, b]) => multiply(real(a.b.value.value + b.a.value.value), a.a)
      )
      .with(
        [{$label: 'MULTIPLY', b: {$label: 'REAL'}}, {$label: 'MULTIPLY', b: {$label: 'REAL'}}],
        ([a, b]) => equivalent(a.a, b.a),
        ([a, b]) => multiply(real(a.b.value.value + b.b.value.value), a.a)
      )
      .when(([a, b]) => equivalent(a, b), ([a, ]) => multiply(real(2), a))
      .otherwise(([a, b]) => add(a, b))
  },

  SUBTRACT: (node) => {
    const a = $visit(node.a), b = $visit(node.b)
    return match<[AST, AST], Node>([a, b])
      .with([{value: {value: 0}}, __], ([, b]) => negate(b))
      .with([__, {value: {value: 0}}], ([a, ]) => a)
      // The following case can happen due to, e.g. $visit(DIVIDE)
      .with( 
        [{$label: 'REAL'}, {$label: 'REAL'}], 
        ([a,b]) => real(a.value.value - b.value.value)
      )
      .when(([a, b]) => equivalent(a, b), () => real(0))
      .otherwise(([a, b]) => subtract(a, b))
  },

  MULTIPLY: (node) => {
    const a = $visit(node.a), b = $visit(node.b)
    return match<[AST, AST], Node>([a, b])
      .with([{value: {value: 0}}, __], () => real(0))
      .with([__, {value: {value: 0}}], () => real(0))
      .with([{value: {value: 1}}, __], ([, b]) => b)
      .with([__, {value: {value: 1}}], ([a, ]) => a)
      .otherwise(([a, b]) => multiply(a, b))
  },

  DIVIDE: (node) => {
    const a = $visit(node.a), b = $visit(node.b)
    return match<[AST, AST], Node>([a, b])
      .with([{value: {value: 0}}, __], () => real(0))
      .with([__, {value: {value: 0}}], () => real(Infinity))
      .with([__, {value: {value: 1}}], ([a, ]) => a)
      .when(([a, b]) => equivalent(a, b), () => real(1))
      .with(
        [{$label: 'RAISE'}, {$label: not('RAISE')}],
        ([a, b]) => equivalent(a.a, b),
        ([a, ]) => $visit(raise(a.a, subtract(a.b, real(1)))) as Node
      )
      .with(
        [{$label: not('RAISE')}, {$label: 'RAISE'}],
        ([a, b]) => equivalent(a, b.a),
        ([, b]) => $visit(divide(real(1), raise(b.a, subtract(b.b, real(1)))))
      )
      .otherwise(([a, b]) => divide(a, b))
  },

  RAISE: (node) => {
    const a = $visit(node.a), b = $visit(node.b)
    return match<[AST, AST], Node>([a, b])
      .with([{value: {value: 0}}, __], () => real(0))
      .with([__, {value: {value: 0}}], () => real(1))
      .with([{value: {value: 1}}, __], ([a,]) => a)
      .with([__, {value: {value: 1}}], ([a,]) => a)
      .with([{value: {value: 2}}, {$label: 'LB'}], ([, b]) => b.expression)
      .with([{value: {value: Math.E}}, {$label: 'LN'}], ([, b]) => b.expression)
      .with([{value: {value: 10}}, {$label: 'LG'}], ([, b]) => b.expression)
      .otherwise(([a, b]) => raise(a, b))
  },

  LB: logarithm(2),
  LN: logarithm(Math.E),
  LG: logarithm(10),

  $default: (node) => {
    return node.expression 
      ? $node(node.$label, {expression: $visit(node.expression)})
      : node
  }
}