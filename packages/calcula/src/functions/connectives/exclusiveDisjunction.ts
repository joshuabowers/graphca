import { _ } from '@arrows/multimethod'
import { Writer, unit } from "../../monads/writer"
import { Clades, Genera, Species, isSpecies, isGenus } from "../../utility/tree"
import { Real, Complex, Boolean, boolean } from "../../primitives"
import { BinaryNode, binary, when } from "../../closures/binary"
import { deepEquals, isValue } from "../../utility/deepEquals"
import { Connective } from './connective'
import { not } from './complement'
import { and } from './conjunction'
import { or } from './disjunction'

export type ExclusiveDisjunction = Connective<Species.xor>

export const [xor, isExclusiveDisjunction, $xor] = binary<ExclusiveDisjunction, Boolean>(
  Species.xor, Genera.connective
)(
  (l, r) => [and(or(unit(l), unit(r)), not(and(unit(l), unit(r)))), 'real exclusive disjunction'],
  (l, r) => [and(or(unit(l), unit(r)), not(and(unit(l), unit(r)))), 'complex exclusive disjunction'],
  (l, r) => [and(or(unit(l), unit(r)), not(and(unit(l), unit(r)))), 'boolean exclusive disjunction']
)(
  when(
    [isValue(boolean(false)), _], 
    (_l, r) => [unit(r), 'exclusive disjunctive identity']
  ),
  when(
    [_, isValue(boolean(false))],
    (l, _r) => [unit(l), 'exclusive disjunctive identity']
  ),
  when(
    [isValue(boolean(true)), _],
    (_l, r) => [not(unit(r)), 'exclusive disjunctive complementation']
  ),
  when(
    [_, isValue(boolean(true))],
    (l, _r) => [not(unit(l)), 'exclusive disjunctive complementation']
  ),
  when(
    deepEquals, [boolean(false), 'exclusive disjunctive annihilator']
  )
)
