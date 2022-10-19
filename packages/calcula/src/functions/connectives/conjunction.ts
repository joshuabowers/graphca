import { _ } from '@arrows/multimethod'
import { unit } from "../../monads/writer"
import { Genera, Species, Notation } from "../../utility/tree"
import { Boolean, boolean } from "../../primitives"
import { binary, when, binaryInfixRule } from "../../closures/binary"
import { deepEquals, isValue } from "../../utility/deepEquals"
import { Connective } from './connective'
import { isComplement } from './complement'
import { isDisjunction } from './disjunction'
import { Unicode } from '../../Unicode'
import { rule } from '../../utility/rule'

export type Conjunction = Connective<Species.and>

export const andRule = binaryInfixRule(Unicode.and)

export const [and, isConjunction, $and] = binary<Conjunction, Boolean>(
  Unicode.and, Notation.infix, Species.and, Genera.connective
)(
  (l, r) => boolean(l.value !== 0 && r.value !== 0),
  (l, r) => boolean((l.a !== 0 || l.b !== 0) && (r.a !== 0 || r.b !== 0)), 
  (l, r) => boolean(l.value && r.value)
)(
  when(
    [_, isValue(boolean(true))], 
    (l, _r) => [unit(l), rule`${l}`, 'conjunctive identity']
  ),
  when(
    [isValue(boolean(true)), _], 
    (_l, r) => [unit(r), rule`${r}`, 'conjunctive identity']
  ),
  when(
    [_, isValue(boolean(false))], 
    [boolean(false), rule`${boolean(false)}`, 'conjunctive annihilator']
  ),
  when(
    [isValue(boolean(false)), _], 
    [boolean(false), rule`${boolean(false)}`, 'conjunctive annihilator']
  ),
  when(
    deepEquals, 
    (l, _r) => [unit(l), rule`${l}`, 'conjunctive idempotency']
  ),
  when(
    (l, r) => isDisjunction(r) && deepEquals(l, r.value.left),
    (l, _r) => [unit(l), rule`${l}`, 'conjunctive absorption']
  ),
  when(
    (l, r) => isDisjunction(r) && deepEquals(l, r.value.right),
    (l, _r) => [unit(l), rule`${l}`, 'conjunctive absorption']
  ),
  when(
    (l, r) => isDisjunction(l) && deepEquals(l.value.left, r),
    (_l, r) => [unit(r), rule`${r}`, 'conjunctive absorption']
  ),
  when(
    (l, r) => isDisjunction(l) && deepEquals(l.value.right, r),
    (_l, r) => [unit(r), rule`${r}`, 'conjunctive absorption']
  ),
  when(
    (l, r) => isComplement(r) && deepEquals(l, r.value.expression),
    [boolean(false), rule`${boolean(false)}`, 'contradiction']
  ),
  when(
    (l, r) => isComplement(l) && deepEquals(l.value.expression, r),
    [boolean(false), rule`${boolean(false)}`, 'contradiction']
  )
)
