import { Visitor, Node, $visit, $node } from 'pegase'
import { Complex } from '../fields/Complex'
import { Field } from '../fields/Field'
import { Real } from '../fields/Real'
import { add, subtract, multiply, divide, raise, negate, real } from './helpers/Node'

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

const identity = (node: Node): Node => node

const logarithm = (base: number) => {
  const b = new Real(base)
  return (node: Node): Node => {
    const expression = $visit(node.expression)
    if( expression.$label === 'RAISE' ){
      const a = expression.a
      if( a.value && equals(a.value, b) ){ return expression.b }
    }
    return $node(node.$label, {expression})
  }
}

export const simplifyVisitor: Visitor<Node> = {
  REAL: identity,
  COMPLEX: identity,
  VARIABLE: identity,

  ADD: (node) => {
    const a = $visit(node.a), b = $visit(node.b)
    const zero = new Real(0)
    if( a.value && equals(zero, a.value) ){ return b }
    else if( b.value && equals(zero, b.value) ){ return a }
    else if( equivalent(a, b) ){ return multiply(real(2), a) }
    else if( a.$label === 'MULTIPLY' && b.$label !== 'MULTIPLY' ) {
      if( a.b.$label === 'REAL' && equivalent( a.a, b ) ){ 
        return multiply(real(a.b.value.value + 1), b) 
      }
      else if( a.a.$label === 'REAL' && equivalent( a.b, b ) ){ 
        return multiply(real(a.a.value.value + 1), b) 
      }
    }
    else if( a.$label !== 'MULTIPLY' && b.$label === 'MULTIPLY' ) {
      if( b.b.$label === 'REAL' && equivalent( a, b.a ) ){ 
        return multiply(real(b.b.value.value + 1), a) 
      }
      else if( b.a.$label === 'REAL' && equivalent( a, b.b ) ){ 
        return multiply(real(b.a.value.value + 1), a)
      }
    }
    else if( a.$label === 'MULTIPLY' && b.$label === 'MULTIPLY' ) {
      if( a.a.$label === 'REAL' && b.a.$label === 'REAL' && equivalent(a.b, b.b) ){ 
        return multiply(real(a.a.value.value + b.a.value.value), a.b) 
      }
      else if( a.b.$label === 'REAL' && b.a.$label === 'REAL' && equivalent(a.a, b.b) ){ 
        return multiply(real(a.b.value.value + b.a.value.value), a.a) 
      }
      else if( a.a.$label === 'REAL' && b.b.$label === 'REAL' && equivalent(a.b, b.a) ){ 
        return multiply(real(a.a.value.value + b.b.value.value), a.b) 
      }
      else if( a.b.$label === 'REAL' && b.b.$label === 'REAL' && equivalent(a.a, b.a) ){ 
        return multiply(real(a.b.value.value + b.b.value.value), a.a) 
      }
    }
    return add(a, b)
  },

  SUBTRACT: (node) => {
    const a = $visit(node.a), b = $visit(node.b)
    const zero = new Real(0)
    if( a.value && equals(zero, a.value) ){ return negate(b) }
    else if( b.value && equals(zero, b.value) ){ return a }
    return subtract(a, b)
  },

  MULTIPLY: (node) => {
    const a = $visit(node.a), b = $visit(node.b)
    const zero = new Real(0), one = new Real(1)
    if( a.value && equals(zero, a.value) ){ return real(0) }
    else if( b.value && equals(zero, b.value) ){ return real(0) }
    else if( a.value && equals(one, a.value) ){ return b }
    else if( b.value && equals(one, b.value) ){ return a }
    return multiply(a, b)
  },

  DIVIDE: (node) => {
    const a = $visit(node.a), b = $visit(node.b)
    const zero = new Real(0), one = new Real(1)
    if( a.value && equals(zero, a.value) ){ return real(0) }
    else if( b.value && equals(zero, b.value) ){ return real(Infinity) }
    else if( b.value && equals(one, b.value) ){ return a }
    return divide(a, b)
  },

  RAISE: (node) => {
    const a = $visit(node.a), b = $visit(node.b)
    const zero = new Real(0), one = new Real(1)
    if( a.value && equals(zero, a.value) ){ return real(0) }
    else if( b.value && equals(zero, b.value) ){ return real(1) }
    else if( a.value && equals(one, a.value) ){ return a }
    else if( b.value && equals(one, b.value) ){ return a }
    else if( b.$label === 'LB' && a.value && equals(new Real(2), a.value) ){ return b.expression }
    else if( b.$label === 'LN' && a.value && equals(new Real(Math.E), a.value) ){ return b.expression }
    else if( b.$label === 'LG' && a.value && equals(new Real(10), a.value) ){ return b.expression }
    return raise(a, b)
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