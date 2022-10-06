import { _ } from '@arrows/multimethod'
import { Writer, unit } from "../../monads/writer"
import { Clades, Genera, Species, isSpecies, isGenus } from "../../utility/tree"
import { Real, Complex, Boolean, boolean } from "../../primitives"
import { BinaryNode, binary, when, binaryInfixRule } from "../../closures/binary"
import { deepEquals, isValue } from "../../utility/deepEquals"
import { Connective } from './connective'
import { not, notRule } from './complement'
import { and } from './conjunction'
import { or } from './disjunction'
import { Unicode } from '../../Unicode'
import { rule } from '../../utility/rule'

export type ExclusiveDisjunction = Connective<Species.xor>

export const xorRule = binaryInfixRule(Unicode.xor)

export const [xor, isExclusiveDisjunction, $xor] = binary<ExclusiveDisjunction, Boolean>(
  Species.xor, Genera.connective
)(
  (l, r) => [
    and(or(unit(l), unit(r)), not(and(unit(l), unit(r)))), 
    xorRule(l, r),
    'real exclusive disjunction'
  ],
  (l, r) => [
    and(or(unit(l), unit(r)), not(and(unit(l), unit(r)))), 
    xorRule(l, r),
    'complex exclusive disjunction'
  ],
  (l, r) => [
    and(or(unit(l), unit(r)), not(and(unit(l), unit(r)))), 
    xorRule(l, r),
    'boolean exclusive disjunction'
  ]
)(
  when(
    [isValue(boolean(false)), _], 
    (_l, r) => [unit(r), rule`${r}`, 'exclusive disjunctive identity']
  ),
  when(
    [_, isValue(boolean(false))],
    (l, _r) => [unit(l), rule`${l}`, 'exclusive disjunctive identity']
  ),
  when(
    [isValue(boolean(true)), _],
    (_l, r) => [not(unit(r)), notRule(r), 'exclusive disjunctive complementation']
  ),
  when(
    [_, isValue(boolean(true))],
    (l, _r) => [not(unit(l)), notRule(l), 'exclusive disjunctive complementation']
  ),
  when(
    deepEquals, 
    [boolean(false), rule`${boolean(false)}`, 'exclusive disjunctive annihilator']
  )
)
