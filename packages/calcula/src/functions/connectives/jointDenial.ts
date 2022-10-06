import { _ } from '@arrows/multimethod'
import { Writer, unit } from "../../monads/writer"
import { Clades, Genera, Species, isSpecies, isGenus } from "../../utility/tree"
import { Real, Complex, Boolean, boolean } from "../../primitives"
import { BinaryNode, binary, when, binaryInfixRule } from "../../closures/binary"
import { deepEquals, isValue } from "../../utility/deepEquals"
import { Connective } from './connective'
import { Complement, isComplement, not, notRule } from './complement'
import { or } from './disjunction'
import { and, andRule } from './conjunction'
import { Unicode } from '../../Unicode'
import { rule } from '../../utility/rule'

export type JointDenial = Connective<Species.nor>

export const norRule = binaryInfixRule(Unicode.nor)

export const [nor, isJointDenial, $nor] = binary<JointDenial, Boolean>(
  Species.nor, Genera.connective
)(
  (l, r) => [not(or(unit(l), unit(r))), norRule(l, r), 'real joint denial'],
  (l, r) => [not(or(unit(l), unit(r))), norRule(l, r), 'complex joint denial'],
  (l, r) => [not(or(unit(l), unit(r))), norRule(l, r), 'boolean joint denial']
)(
  when(
    [_, isValue(boolean(true))],
    [boolean(false), rule`${boolean(false)}`, 'joint denial annihilator']
  ),
  when(
    [isValue(boolean(true)), _],
    [boolean(false), rule`${boolean(false)}`, 'joint denial annihilator']
  ),
  when(
    [_, isValue(boolean(false))],
    (l, _r) => [not(unit(l)), notRule(l), 'joint denial complementation']
  ),
  when(
    [isValue(boolean(false)), _],
    (_l, r) => [not(unit(r)), notRule(r), 'joint denial complementation']
  ),
  when(
    deepEquals, 
    (l, _r) => [not(unit(l)), notRule(l), 'joint denial complementation']
  ),
  when<Complement, Complement>(
    (l, r) => isComplement(l) && isComplement(r),
    (l, r) => [
      and(l.expression, r.expression), 
      andRule(l.expression, r.expression), 
      'De Morgan'
    ]
  ),
  when(
    (l, r) => isComplement(r) && deepEquals(l, r.value.expression),
    [boolean(false), rule`${boolean(false)}`, 'joint denial annihilator']
  ),
  when(
    (l, r) => isComplement(l) && deepEquals(l.value.expression, r),
    [boolean(false), rule`${boolean(false)}`, 'joint denial annihilator']
  )
)
