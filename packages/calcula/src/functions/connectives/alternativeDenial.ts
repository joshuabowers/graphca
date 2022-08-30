import { _ } from '@arrows/multimethod'
import { Writer, unit } from "../../monads/writer"
import { TreeNode, Clades, Genera, Species, isSpecies, isGenus } from "../../utility/tree"
import { Real, Complex, Boolean, boolean } from "../../primitives"
import { BinaryNode, binary, when } from "../../closures/binary"
import { deepEquals, isValue } from "../../utility/deepEquals"
import { Connective } from './connective'
import { Complement, isComplement, not } from './complement'
import { and } from './conjunction'
import { or } from './disjunction'
import { implies } from './implication'

export type AlternativeDenial = Connective<Species.nand>

export const [nand, isAlternativeDenial, $nand] = binary<AlternativeDenial, Boolean>(
  Species.nand, Genera.connective
)(
  (l, r) => [not(and(unit(l), unit(r))), 'real alternative denial'],
  (l, r) => [not(and(unit(l), unit(r))), 'complex alternative denial'],
  (l, r) => [not(and(unit(l), unit(r))), 'boolean alternative denial']
)(
  when(
    [_, isValue(boolean(true))],
    (l, _r) => [not(unit(l)), 'alternative deniable complementation']
  ),
  when(
    [isValue(boolean(true)), _],
    (_l, r) => [not(unit(r)), 'alternative deniable complementation']
  ),
  when(
    [_, isValue(boolean(false))],
    [boolean(true), 'alternative deniable annihilator']
  ),
  when(
    [isValue(boolean(false)), _],
    [boolean(true), 'alternative deniable annihilator']
  ),
  when(
    deepEquals, (l, _r) => [not(unit(l)), 'alternative deniable complementation']
  ),
  when<TreeNode, AlternativeDenial>(
    (l, r) => isAlternativeDenial(r) && deepEquals(l, r.value.left),
    (l, r) => [implies(unit(l), r.right), 'alternative deniable implication']
  ),
  when<TreeNode, AlternativeDenial>(
    (l, r) => isAlternativeDenial(r) && deepEquals(l, r.value.right),
    (l, r) => [implies(unit(l), r.left), 'alternative deniable implication']
  ),
  when<Complement, Complement>(
    (l, r) => isComplement(l) && isComplement(r),
    (l, r) => [or(l.expression, r.expression), 'De Morgan']
  ),
  when(
    (l, r) => isComplement(r) && deepEquals(l, r.value.expression),
    [boolean(true), 'alternative deniable annihilator']
  ),
  when(
    (l, r) => isComplement(l) && deepEquals(l.value.expression, r),
    [boolean(true), 'alternative deniable annihilator']
  )
)
