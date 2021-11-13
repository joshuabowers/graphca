import { Visitor, Node, $visit, $node } from 'pegase'
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
type Unary = 'LB' | 'LN' | 'LG' | 'NEGATE'

type AST = (
  | { $label: Binary, a: AST, b: AST }
  | { $label: Unary, expression: AST }
  | { $label: 'REAL', value: Real }
  | { $label: 'COMPLEX', value: Complex }
  | { $label: 'VARIABLE', name: string }
) & Pick<Node, '$from' | '$to'>
  
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
      // Can occur in, e.g., $visit(MULTIPLY)
      .with(
        [{$label: 'REAL'}, {$label: 'REAL'}], 
        ([a, b]) => real(a.value.value + b.value.value)
      )
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
      .with(
        [{$label: 'DIVIDE'}, {$label: 'DIVIDE'}],
        ([a, b]) => $visit(divide(multiply(a.a, b.a), multiply(a.b, b.b)))
      )
      .with([__, {$label: 'DIVIDE'}], ([a, b]) => divide(multiply(a, b.a), b.b))
      .with([{$label: 'DIVIDE'}, __], ([a, b]) => divide(multiply(a.a, b), a.b))
      .with([__, {$label: 'REAL'}], ([a, b]) => multiply(b, a))
      .with(
        [{$label: not('RAISE')}, {$label: 'RAISE'}],
        ([a, b]) => equivalent(a, b.a),
        ([, b]) => $visit(raise(b.a, add(b.b, real(1))))
      )
      .with(
        [{$label: 'RAISE'}, {$label: not('RAISE')}],
        ([a, b]) => equivalent(a.a, b),
        ([a, ]) => $visit(raise(a.a, add(a.b, real(1))))
      )
      .with(
        [{$label: 'RAISE'}, {$label: 'RAISE'}],
        ([a, b]) => equivalent(a.a, b.a),
        ([a, b]) => $visit(raise(a.a, add(a.b, b.b)))
      )
      .when(([a, b]) => equivalent(a, b), ([a, ]) => raise(a, real(2)))
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
      .with(
        [{$label: 'RAISE'}, {$label: 'RAISE'}],
        ([a, b]) => equivalent(a.a, b.a),
        ([a, b]) => $visit(raise(a.a, subtract(a.b, b.b)))
      )
      .with( // (x * y) / x => y
        [{$label: 'MULTIPLY'}, {$label: not('MULTIPLY')}],
        ([a, b]) => equivalent(a.a, b),
        ([a, ]) => a.b
      )
      .with( // (x * y) / y => x
        [{$label: 'MULTIPLY'}, {$label: not('MULTIPLY')}],
        ([a, b]) => equivalent(a.b, b),
        ([a, ]) => a.a
      )
      .with( // x / (x * y) => 1 / y
        [{$label: not('MULTIPLY')}, {$label: 'MULTIPLY'}],
        ([a, b]) => equivalent(a, b.a),
        ([, b]) => divide(real(1), b.b)
      )
      .with( // y / (x * y) => 1 / x
        [{$label: not('MULTIPLY')}, {$label: 'MULTIPLY'}],
        ([a, b]) => equivalent(a, b.b),
        ([, b]) => divide(real(1), b.a)
      )
      .with( // (x * y) / (x * z) => y / z
        [{$label: 'MULTIPLY'}, {$label: 'MULTIPLY'}],
        ([a, b]) => equivalent(a.a, b.a),
        ([a, b]) => $visit(divide(a.b, b.b))
      )
      .with( // (x * y) / (z * x) => y / z
        [{$label: 'MULTIPLY'}, {$label: 'MULTIPLY'}],
        ([a, b]) => equivalent(a.a, b.b),
        ([a, b]) => $visit(divide(a.b, b.a))
      )
      .with( // (x * y) / (y * z) => x / z
        [{$label: 'MULTIPLY'}, {$label: 'MULTIPLY'}],
        ([a, b]) => equivalent(a.b, b.a),
        ([a, b]) => $visit(divide(a.a, b.b))
      )
      .with( // (x * y) / (z * y) => x / z
        [{$label: 'MULTIPLY'}, {$label: 'MULTIPLY'}],
        ([a, b]) => equivalent(a.b, b.b),
        ([a, b]) => $visit(divide(a.a, b.a))
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
      .with([__, {$label: 'NEGATE'}], ([a, b]) => divide(real(1), raise(a, b.expression)))
      .with(
        [__, {$label: 'REAL'}],
        ([, b]) => b.value.value < 0,
        ([a, b]) => divide(real(1), raise(a, real(-b.value.value)))
      )
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