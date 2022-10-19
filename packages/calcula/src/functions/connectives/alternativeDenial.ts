import { _ } from '@arrows/multimethod'
import { unit } from "../../monads/writer"
import { TreeNode, Genera, Species, Notation } from "../../utility/tree"
import { Boolean, boolean } from "../../primitives"
import { binary, when, binaryInfixRule } from "../../closures/binary"
import { deepEquals, isValue } from "../../utility/deepEquals"
import { Connective } from './connective'
import { Complement, isComplement, not } from './complement'
import { and } from './conjunction'
import { or } from './disjunction'
import { implies } from './implication'
import { rule } from '../../utility/rule'
import { Unicode } from '../../Unicode'

export type AlternativeDenial = Connective<Species.nand>

export const nandRule = binaryInfixRule(Unicode.nand)

export const [nand, isAlternativeDenial, $nand] = binary<AlternativeDenial, Boolean>(
  Unicode.nand, Notation.infix, Species.nand, Genera.connective
)(
  (l, r) => not(and(unit(l), unit(r))),
  (l, r) => not(and(unit(l), unit(r))),
  (l, r) => not(and(unit(l), unit(r)))
)(
  when(
    [_, isValue(boolean(true))],
    (l, _r) => [
      not(unit(l)), 
      rule`${Unicode.not}(${l})`, 
      'alternative deniable complementation'
    ]
  ),
  when(
    [isValue(boolean(true)), _],
    (_l, r) => [
      not(unit(r)), 
      rule`${Unicode.not}(${r})`, 
      'alternative deniable complementation'
    ]
  ),
  when(
    [_, isValue(boolean(false))],
    [boolean(true), rule`${boolean(true)}`, 'alternative deniable annihilator']
  ),
  when(
    [isValue(boolean(false)), _],
    [boolean(true), rule`${boolean(true)}`, 'alternative deniable annihilator']
  ),
  when(
    deepEquals, 
    (l, _r) => [
      not(unit(l)), 
      rule`${Unicode.not}(${l})`, 
      'alternative deniable complementation'
    ]
  ),
  when<TreeNode, AlternativeDenial>(
    (l, r) => isAlternativeDenial(r) && deepEquals(l, r.value.left),
    (l, r) => [
      implies(unit(l), r.right), 
      rule`${l} ${Unicode.implies} ${r.right}`,
      'alternative deniable implication'
    ]
  ),
  when<TreeNode, AlternativeDenial>(
    (l, r) => isAlternativeDenial(r) && deepEquals(l, r.value.right),
    (l, r) => [
      implies(unit(l), r.left), 
      rule`${l} ${Unicode.implies} ${r.left}`,
      'alternative deniable implication'
    ]
  ),
  when<Complement, Complement>(
    (l, r) => isComplement(l) && isComplement(r),
    (l, r) => [
      or(l.expression, r.expression), 
      rule`${l.expression} ${Unicode.or} ${l.expression}`,
      'De Morgan'
    ]
  ),
  when(
    (l, r) => isComplement(r) && deepEquals(l, r.value.expression),
    [boolean(true), rule`${boolean(true)}`, 'alternative deniable annihilator']
  ),
  when(
    (l, r) => isComplement(l) && deepEquals(l.value.expression, r),
    [boolean(true), rule`${boolean(true)}`, 'alternative deniable annihilator']
  )
)
