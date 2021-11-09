import { Node, $node } from 'pegase'
import { Real } from '../../fields/Real'

export const unary = (label: string) => (expression: Node) => $node(label, {expression})
export const binary = (label: string) => (a: Node, b: Node) => $node(label, {a, b})

export const real = (value: number) => $node('REAL', {value: new Real(value)})

export const add = binary('ADD')
export const subtract = binary('SUBTRACT')
export const multiply = binary('MULTIPLY')
export const divide = binary('DIVIDE')
export const raise = binary('EXPONENT')

export const negate = unary('NEGATE')

export const cos = unary('COS')
export const sin = unary('SIN')
export const tan = unary('TAN')

export const cosh = unary('COSH')
export const sinh = unary('SINH')
export const tanh = unary('TANH')

export const ln = unary('LN')
