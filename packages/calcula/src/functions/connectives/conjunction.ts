import { _ } from '@arrows/multimethod'
import { Genera, Species, Notation } from "../../utility/tree"
import { Boolean, boolean } from "../../primitives"
import { binary, when } from "../../closures/binary"
import { deepEquals, isValue } from "../../utility/deepEquals"
import { Connective } from './connective'
import { isComplement } from './complement'
import { isDisjunction } from './disjunction'
import { Unicode } from '../../Unicode'

export type Conjunction = Connective<Species.and>

export const [and, isConjunction, $and] = binary<Conjunction, Boolean>(
  Unicode.and, Notation.infix, Species.and, Genera.connective
)(
  (l, r) => boolean(l.value.value !== 0 && r.value.value !== 0),
  (l, r) => boolean(
    (l.value.a !== 0 || l.value.b !== 0) 
    && (r.value.a !== 0 || r.value.b !== 0)
  ), 
  (l, r) => boolean(l.value.value && r.value.value)
)(
  when(
    [_, isValue(boolean(true))], 
    (l, _r) => [l, 'conjunctive identity']
  ),
  when(
    [isValue(boolean(true)), _], 
    (_l, r) => [r, 'conjunctive identity']
  ),
  when(
    [_, isValue(boolean(false))], 
    [boolean(false), 'conjunctive annihilator']
  ),
  when(
    [isValue(boolean(false)), _], 
    [boolean(false), 'conjunctive annihilator']
  ),
  when(
    deepEquals, 
    (l, _r) => [l, 'conjunctive idempotency']
  ),
  when(
    (l, r) => isDisjunction(r) && deepEquals(l, r.value.left),
    (l, _r) => [l, 'conjunctive absorption']
  ),
  when(
    (l, r) => isDisjunction(r) && deepEquals(l, r.value.right),
    (l, _r) => [l, 'conjunctive absorption']
  ),
  when(
    (l, r) => isDisjunction(l) && deepEquals(l.value.left, r),
    (_l, r) => [r, 'conjunctive absorption']
  ),
  when(
    (l, r) => isDisjunction(l) && deepEquals(l.value.right, r),
    (_l, r) => [r, 'conjunctive absorption']
  ),
  when(
    (l, r) => isComplement(r) && deepEquals(l, r.value.expression),
    [boolean(false), 'conjunctive contradiction']
  ),
  when(
    (l, r) => isComplement(l) && deepEquals(l.value.expression, r),
    [boolean(false), 'conjunctive contradiction']
  )
)
