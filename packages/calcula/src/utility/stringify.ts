import { method, multi, Multi } from '@arrows/multimethod'
import { Unicode } from '../Unicode'
import { Writer } from '../monads/writer'
import { TreeNode, TreeNodeGuardFn, isTreeNode } from './tree'
import { isReal, isComplex, isBoolean } from '../primitives'
import { isVariable } from '../variable'
import { UnaryNode } from '../closures/unary'
import { BinaryNode } from '../closures/binary'
import { isAddition, isMultiplication, isExponentiation } from '../arithmetic'
import { 
  isLogarithm, isPermutation, isCombination,
  isCosine, isSine, isTangent, isSecant, isCosecant, isCotangent,
  isArcusCosine, isArcusSine, isArcusTangent, 
  isArcusSecant, isArcusCosecant, isArcusCotangent,
  isHyperbolicCosine, isHyperbolicSine, isHyperbolicTangent,
  isHyperbolicSecant, isHyperbolicCosecant, isHyperbolicCotangent,
  isAreaHyperbolicCosine, isAreaHyperbolicSine, isAreaHyperbolicTangent,
  isAreaHyperbolicSecant, isAreaHyperbolicCosecant, isAreaHyperbolicCotangent,
  isFactorial, isGamma, isPolygamma, isAbsolute
} from '../functions'

type ToString<T extends TreeNode> = (expression: Writer<T>) => string

const when = <T extends TreeNode>(guard: TreeNodeGuardFn<T>, fn: ToString<T>) =>
  method(guard, fn)

const binaryInfix = (operator: string) => 
  (e: Writer<BinaryNode>) =>
    `(${stringify(e.value.left)}${operator}${stringify(e.value.right)})`

const binary = (name: string) =>
  (e: Writer<BinaryNode>) =>
    `${name}(${stringify(e.value.left)},${stringify(e.value.right)})`

const unary = (name: string) =>
  (e: Writer<UnaryNode>) =>
    `${name}(${stringify(e.value.expression)})`

export type StringifyFn = (expression: Writer<TreeNode>) => string

export const stringify: StringifyFn = multi(
  when(isReal, r => r.value.value.toString()),
  when(isComplex, c => `${c.value.a}${c.value.b >= 0 ? '+' : ''}${c.value.b}${Unicode.i}`),
  when(isBoolean, b => b.value.value.toString()),
  when(isVariable, v => v.value.name),
  when(isAddition, binaryInfix('+')),
  when(isMultiplication, binaryInfix('*')),
  when(isExponentiation, binaryInfix('^')),
  when(isLogarithm, binary('log')),
  when(isPermutation, binary('P')),
  when(isCombination, binary('C')),
  when(isCosine, unary('cos')),
  when(isSine, unary('sin')),
  when(isTangent, unary('tan')),
  when(isSecant, unary('sec')),
  when(isCosecant, unary('csc')),
  when(isCotangent, unary('cot')),
  when(isArcusCosine, unary('acos')),
  when(isArcusSine, unary('asin')),
  when(isArcusTangent, unary('atan')),
  when(isArcusSecant, unary('asec')),
  when(isArcusCosecant, unary('acsc')),
  when(isArcusCotangent, unary('acot')),
  when(isHyperbolicCosine, unary('cosh')),
  when(isHyperbolicSine, unary('sinh')),
  when(isHyperbolicTangent, unary('tanh')),
  when(isHyperbolicSecant, unary('sech')),
  when(isHyperbolicCosecant, unary('csch')),
  when(isHyperbolicCotangent, unary('coth')),
  when(isAreaHyperbolicCosine, unary('acosh')),
  when(isAreaHyperbolicSine, unary('asinh')),
  when(isAreaHyperbolicTangent, unary('atanh')),
  when(isAreaHyperbolicSecant, unary('asech')),
  when(isAreaHyperbolicCosecant, unary('acsch')),
  when(isAreaHyperbolicCotangent, unary('acoth')),
  when(isFactorial, f => `(${stringify(f.value.expression)})!`),
  when(isGamma, unary(Unicode.gamma)),
  when(isPolygamma, binary(Unicode.digamma)),
  when(isAbsolute, unary('abs')),
  when(isTreeNode, e => `Unhandled expression type: '${e.value.species}'`)
)
