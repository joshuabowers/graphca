import { Node, $node } from 'pegase'
import { Complex } from '../../fields/Complex'
import { Real } from '../../fields/Real'

export const unary = (label: string) => (expression: Node) => $node(label, {expression})
export const binary = (label: string) => (a: Node, b: Node) => $node(label, {a, b})

export const real = (value: number | string) => $node('REAL', {value: new Real(value)})
export const complex = (a: number | string, b: number | string = 0) => $node('COMPLEX', {value: new Complex(a, b)})

export const add = binary('ADD')
export const subtract = binary('SUBTRACT')
export const multiply = binary('MULTIPLY')
export const divide = binary('DIVIDE')
export const raise = binary('RAISE')

export const negate = unary('NEGATE')

export const cos = unary('COS')
export const sin = unary('SIN')
export const tan = unary('TAN')

export const cosh = unary('COSH')
export const sinh = unary('SINH')
export const tanh = unary('TANH')

export const lb = unary('LB')
export const ln = unary('LN')
export const lg = unary('LG')

export const factorial = unary('FACTORIAL')
export const gamma = unary('GAMMA')
export const digamma = unary('DIGAMMA')
export const abs = unary('ABS')

export const differentiate = unary('DIFFERENTIATE')