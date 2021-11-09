import { Node } from 'pegase'
import { Real } from '../../fields/Real'

export type NodeLike = Omit<Node, '$from' | '$to'>
export type Transform = (value: number | string) => unknown

export const unary = ($label: string) => (expression: NodeLike): NodeLike => ({$label, expression})
export const binary = ($label: string) => (a: NodeLike, b: NodeLike): NodeLike => ({$label, a, b})
export const constant = ($label: string, transform: Transform) => (value: number | string): NodeLike => ({$label, value: transform(value)})

export const num = constant('NUMBER', (v) => v.toString())
export const real = constant('REAL', (v) => new Real(v))
export const variable = (name: string): NodeLike => ({'$label': 'VARIABLE', name})

export const add = binary('ADD')
export const subtract = binary('SUBTRACT')
export const multiply = binary('MULTIPLY')
export const divide = binary('DIVIDE')
export const raise = binary('EXPONENT')

export const negate = unary('NEGATE')
export const ln = unary('LN')
export const lg = unary('LG')

export const cos = unary('COS')
export const sin = unary('SIN')
export const tan = unary('TAN')

export const acos = unary('ACOS')
export const asin = unary('ASIN')
export const atan = unary('ATAN')

export const cosh = unary('COSH')
export const sinh = unary('SINH')
export const tanh = unary('TANH')

export const acosh = unary('ACOSH')
export const asinh = unary('ASINH')
export const atanh = unary('ATANH')

export const gamma = unary('GAMMA')
export const factorial = unary('FACTORIAL')
export const abs = unary('ABS')

export const assign = (identifier: string, expression: NodeLike): NodeLike => ({$label: 'ASSIGN', identifier, expression})
export const invoke = (identifier: string, argumentList: NodeLike[]): NodeLike => ({$label: 'INVOKE', identifier, argumentList})
