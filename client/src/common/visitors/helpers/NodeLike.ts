import { Node } from 'pegase'
import { Real } from '../../fields/Real'

export type NodeLike = Omit<Node, '$from' | '$to'>

export const unary = ($label: string) => (expression: NodeLike): NodeLike => ({$label, expression})
export const binary = ($label: string) => (a: NodeLike, b: NodeLike): NodeLike => ({$label, a, b})

export const real = (val: string): NodeLike => ({'$label': 'REAL', 'value': new Real(val)})
export const variable = (name: string): NodeLike => ({'$label': 'VARIABLE', name})

export const add = binary('PLUS')
export const subtract = binary('MINUS')
export const multiply = binary('MULTIPLY')
export const divide = binary('DIVIDE')
export const raise = binary('EXPONENT')

export const negate = unary('NEGATE')
export const ln = unary('LN')

export const cos = unary('COS')
export const sin = unary('SIN')
export const tan = unary('TAN')

export const cosh = unary('COSH')
export const sinh = unary('SINH')
export const tanh = unary('TANH')